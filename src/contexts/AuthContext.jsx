import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import { auth } from "../config/firebase";
import hybridApi from "../services/hybridApi";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Validate UOM email
  const validateUOMEmail = (email) => {
    const uomDomain = process.env.REACT_APP_UNIVERSITY_DOMAIN || "uom.lk";
    return email.toLowerCase().endsWith(`@${uomDomain}`);
  };

  // Sign up function (Firebase Auth + MongoDB)
  const signup = async (email, password, displayName) => {
    try {
      // Check if Firebase is properly configured
      const isFirebaseConfigured =
        process.env.REACT_APP_FIREBASE_API_KEY &&
        process.env.REACT_APP_FIREBASE_PROJECT_ID &&
        process.env.REACT_APP_FIREBASE_API_KEY !==
          "your-actual-firebase-api-key";

      if (!isFirebaseConfigured) {
        return {
          success: false,
          error:
            "Firebase is not properly configured. Please set up your Firebase credentials in the .env file. See FIREBASE_QUICK_SETUP.md for instructions.",
        };
      }

      // Validate UOM email
      if (!validateUOMEmail(email)) {
        return {
          success: false,
          error: "Only University of Moratuwa email addresses are allowed",
        };
      }

      // Create user in Firebase
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name
      await updateProfile(result.user, { displayName });

      // Send email verification
      await sendEmailVerification(result.user);

      // Wait a moment for Firebase token to be ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Register user profile in MongoDB backend
      try {
        const [firstName, ...lastNameParts] = displayName.split(" ");
        const lastName = lastNameParts.join(" ") || "Unknown";

        const mongoResult = await hybridApi.registerUserProfile({
          firstName,
          lastName,
        });

        setUserProfile(mongoResult.data.user);

        return {
          success: true,
          user: result.user,
          profile: mongoResult.data.user,
        };
      } catch (mongoError) {
        console.error("MongoDB registration error:", mongoError);
        // Firebase user created but MongoDB registration failed
        // User can still login and complete registration later
        return {
          success: true,
          user: result.user,
          warning:
            "Account created but profile registration incomplete. Please login to complete setup.",
        };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  // Login function (Firebase Auth + MongoDB)
  const login = async (email, password) => {
    try {
      // Check if Firebase is properly configured
      const isFirebaseConfigured =
        process.env.REACT_APP_FIREBASE_API_KEY &&
        process.env.REACT_APP_FIREBASE_PROJECT_ID &&
        process.env.REACT_APP_FIREBASE_API_KEY !==
          "your-actual-firebase-api-key";

      if (!isFirebaseConfigured) {
        return {
          success: false,
          error:
            "Firebase is not properly configured. Please set up your Firebase credentials in the .env file. See FIREBASE_QUICK_SETUP.md for instructions.",
        };
      }

      console.log("🔥 Starting Firebase authentication...");

      // Step 1: Authenticate with Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Firebase authentication successful:", result.user.email);

      // Step 2: Get Firebase ID token for backend communication
      const idToken = await result.user.getIdToken(true);
      console.log("🔥 Firebase ID token obtained successfully");

      // Step 3: Login/sync with MongoDB backend
      try {
        console.log("🔄 Syncing with MongoDB backend...");
        const mongoResult = await hybridApi.loginWithFirebase();
        console.log("✅ MongoDB sync successful:", mongoResult.data.user);

        setUserProfile(mongoResult.data.user);

        // Check if profile is complete
        const needsOnboarding = !mongoResult.data.user.profileCompleted;
        console.log(
          `📋 Profile completion status: ${
            needsOnboarding ? "Incomplete - needs onboarding" : "Complete"
          }`
        );

        return {
          success: true,
          user: result.user,
          userProfile: mongoResult.data.user,
          needsOnboarding: needsOnboarding,
          message: needsOnboarding
            ? "Login successful! Please complete your profile setup."
            : "Login successful! Welcome back.",
        };
      } catch (mongoError) {
        console.error("❌ MongoDB login error:", mongoError);

        // Step 4: Auto-registration if user doesn't exist in MongoDB
        if (
          mongoError.message.includes("User not found") ||
          mongoError.message.includes("404")
        ) {
          console.log(
            "🆕 User not found in MongoDB, attempting auto-registration..."
          );

          try {
            const displayName = result.user.displayName || "Unknown User";
            const [firstName, ...lastNameParts] = displayName.split(" ");
            const lastName = lastNameParts.join(" ") || "Unknown";

            console.log("📝 Creating user profile with:", {
              firstName,
              lastName,
            });

            const registerResult = await hybridApi.registerUserProfile({
              firstName,
              lastName,
            });

            console.log(
              "✅ Auto-registration successful:",
              registerResult.data.user
            );
            setUserProfile(registerResult.data.user);

            return {
              success: true,
              user: result.user,
              userProfile: registerResult.data.user,
              needsOnboarding: true, // New users always need onboarding
              message:
                "Account created successfully! Please complete your profile setup.",
            };
          } catch (registerError) {
            console.error("❌ Auto-registration failed:", registerError);
            return {
              success: false,
              error:
                "Login successful but profile setup failed. Please try again.",
            };
          }
        }

        // Handle other MongoDB errors
        return {
          success: false,
          error: mongoError.message || "Login failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("❌ Firebase login error:", error);

      // Provide user-friendly error messages
      let userMessage = "Login failed. Please try again.";

      if (error.code === "auth/user-not-found") {
        userMessage = "No account found with this email. Please sign up first.";
      } else if (error.code === "auth/wrong-password") {
        userMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        userMessage =
          "Invalid email format. Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        userMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === "auth/user-disabled") {
        userMessage = "This account has been disabled. Please contact support.";
      }

      return { success: false, error: userMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Get user profile from MongoDB
  const getUserProfile = async () => {
    try {
      const result = await hybridApi.getCurrentUser();
      return result.data.user;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  };

  // Update user profile in MongoDB
  const updateUserProfile = async (profileData) => {
    if (!currentUser) {
      return { success: false, error: "No user logged in" };
    }

    try {
      const result = await hybridApi.updateUserProfile(profileData);

      if (result.status === "success") {
        // Update local state
        setUserProfile((prev) => ({
          ...prev,
          ...profileData,
          profileCompleted: true,
        }));
        return { success: true };
      }

      return {
        success: false,
        error: result.message || "Failed to update profile",
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        success: false,
        error: error.message || "Failed to update profile",
      };
    }
  };

  // Save profile step (progressive saving)
  const saveProfileStep = async (stepData, stepNumber) => {
    if (!currentUser) {
      console.error("❌ No current user found");
      return { success: false, error: "No user logged in" };
    }

    console.log("🔍 Current user details:", {
      uid: currentUser.uid,
      email: currentUser.email,
      emailVerified: currentUser.emailVerified,
    });

    try {
      console.log(`💾 Saving profile step ${stepNumber}:`, stepData);

      const result = await hybridApi.updateUserProfile(stepData);

      if (result.status === "success") {
        // Update local state with the saved data
        setUserProfile((prev) => ({
          ...prev,
          ...stepData,
        }));
        console.log(`✅ Step ${stepNumber} saved successfully`);
        return { success: true, user: result.data.user };
      }

      return {
        success: false,
        error: result.message || `Failed to save step ${stepNumber}`,
      };
    } catch (error) {
      console.error(`Error saving profile step ${stepNumber}:`, error);
      return {
        success: false,
        error: error.message || `Failed to save step ${stepNumber}`,
      };
    }
  };

  // Complete user profile (for profile setup)
  const completeProfile = async (profileData) => {
    if (!currentUser) {
      return { success: false, error: "No user logged in" };
    }

    try {
      const result = await hybridApi.completeProfile(profileData);

      if (result.status === "success") {
        setUserProfile(result.data.user);
        return { success: true, user: result.data.user };
      }

      return {
        success: false,
        error: result.message || "Failed to complete profile",
      };
    } catch (error) {
      console.error("Error completing profile:", error);
      return {
        success: false,
        error: error.message || "Failed to complete profile",
      };
    }
  };

  // Check if user profile is complete
  const isProfileComplete = () => {
    return userProfile && userProfile.profileCompleted;
  };

  // Check profile completion status from backend
  const checkProfileStatus = async () => {
    if (!currentUser) return { profileCompleted: false, needsOnboarding: true };

    try {
      const result = await hybridApi.getProfileStatus();
      return {
        profileCompleted: result.data.profileCompleted,
        needsOnboarding: result.data.needsOnboarding,
        user: result.data.user,
      };
    } catch (error) {
      console.error("Error checking profile status:", error);
      return { profileCompleted: false, needsOnboarding: true };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      return { success: false, error: error.message };
    }
  };

  // Delete user account
  const deleteAccount = async () => {
    if (!currentUser) {
      return { success: false, error: "No user logged in" };
    }

    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, "users", currentUser.uid));

      // Delete user authentication
      await deleteUser(currentUser);

      setCurrentUser(null);
      setUserProfile(null);

      return { success: true };
    } catch (error) {
      console.error("Delete account error:", error);
      return { success: false, error: error.message };
    }
  };

  // Get potential matches from MongoDB
  const getPotentialMatches = async (preferences = {}) => {
    if (!currentUser) return [];

    try {
      const result = await hybridApi.getPotentialMatches(preferences);
      return result.data?.matches || [];
    } catch (error) {
      console.error("Error getting matches:", error);
      return [];
    }
  };

  // Like a user (MongoDB)
  const likeUser = async (likedUserId) => {
    if (!currentUser) return { success: false, error: "No user logged in" };

    try {
      const result = await hybridApi.likeUser(likedUserId);
      return {
        success: result.status === "success",
        isMatch: result.data?.isMatch || false,
        message: result.message,
      };
    } catch (error) {
      console.error("Like user error:", error);
      return { success: false, error: error.message };
    }
  };

  // Pass a user (MongoDB)
  const passUser = async (passedUserId) => {
    if (!currentUser) return { success: false, error: "No user logged in" };

    try {
      const result = await hybridApi.passUser(passedUserId);
      return {
        success: result.status === "success",
        message: result.message,
      };
    } catch (error) {
      console.error("Pass user error:", error);
      return { success: false, error: error.message };
    }
  };

  // Get user matches from MongoDB
  const getUserMatches = async () => {
    if (!currentUser) return [];

    try {
      const result = await hybridApi.getUserMatches();
      return result.data?.matches || [];
    } catch (error) {
      console.error("Error getting matches:", error);
      return [];
    }
  };

  // Upload profile image
  const uploadProfileImage = async (file) => {
    if (!currentUser) return { success: false, error: "No user logged in" };

    try {
      const result = await hybridApi.uploadProfileImage(file);
      return {
        success: result.status === "success",
        imageUrl: result.data?.imageUrl,
        message: result.message,
      };
    } catch (error) {
      console.error("Upload image error:", error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    // Check if Firebase is properly configured before setting up auth listener
    const isFirebaseConfigured =
      process.env.REACT_APP_FIREBASE_API_KEY &&
      process.env.REACT_APP_FIREBASE_PROJECT_ID &&
      process.env.REACT_APP_FIREBASE_API_KEY !== "your-actual-firebase-api-key";

    if (!isFirebaseConfigured) {
      console.warn(
        "🔥 Firebase not configured properly. Auth state listener not initialized."
      );
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Get user profile from MongoDB
        try {
          const profile = await getUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    getUserProfile,
    updateUserProfile,
    saveProfileStep,
    completeProfile,
    isProfileComplete,
    checkProfileStatus,
    resetPassword,
    deleteAccount,
    getPotentialMatches,
    likeUser,
    passUser,
    getUserMatches,
    uploadProfileImage,
    validateUOMEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
