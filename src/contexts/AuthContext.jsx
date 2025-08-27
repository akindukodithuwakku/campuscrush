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
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

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

  // Sign up function
  const signup = async (email, password, displayName) => {
    try {
      // Validate UOM email
      if (!validateUOMEmail(email)) {
        return {
          success: false,
          error: "Only University of Moratuwa email addresses are allowed",
        };
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name
      await updateProfile(result.user, { displayName });

      // Send email verification
      await sendEmailVerification(result.user);

      // Create user profile in Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName,
        emailVerified: false,
        profileCompleted: false,
        isActive: true,
        lastSeen: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Profile fields for matching
        age: null,
        bio: "",
        interests: [],
        photos: [],
        preferences: {
          ageRange: { min: 18, max: 30 },
          maxDistance: 50,
        },
        // Privacy settings
        privacy: {
          showAge: true,
          showLastSeen: false,
        },
      });

      return { success: true, user: result.user };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Get user profile after successful login
      const profile = await getUserProfile(result.user.uid);

      return {
        success: true,
        user: result.user,
        userProfile: profile,
      };
    } catch (error) {
      return { success: false, error: error.message };
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

  // Get user profile from Firestore
  const getUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (!currentUser) {
      return { success: false, error: "No user logged in" };
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
        profileCompleted: true,
      });

      // Update local state
      setUserProfile((prev) => ({
        ...prev,
        ...profileData,
        profileCompleted: true,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: "Failed to update profile" };
    }
  };

  // Check if user profile is complete
  const isProfileComplete = () => {
    return userProfile && userProfile.profileCompleted;
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

  // Get potential matches
  const getPotentialMatches = async () => {
    if (!currentUser) return [];

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("uid", "!=", currentUser.uid),
        where("profileCompleted", "==", true),
        where("isActive", "==", true),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const matches = [];

      querySnapshot.forEach((doc) => {
        matches.push({ id: doc.id, ...doc.data() });
      });

      return matches;
    } catch (error) {
      console.error("Error getting matches:", error);
      return [];
    }
  };

  // Like a user
  const likeUser = async (likedUserId) => {
    if (!currentUser) return { success: false, error: "No user logged in" };

    try {
      const likeRef = doc(db, "likes", `${currentUser.uid}_${likedUserId}`);
      await setDoc(likeRef, {
        userId: currentUser.uid,
        likedUserId: likedUserId,
        timestamp: serverTimestamp(),
      });

      // Check if it's a match (mutual like)
      const mutualLikeRef = doc(
        db,
        "likes",
        `${likedUserId}_${currentUser.uid}`
      );
      const mutualLikeDoc = await getDoc(mutualLikeRef);

      if (mutualLikeDoc.exists()) {
        // It's a match! Create match document
        const matchRef = doc(
          db,
          "matches",
          `${currentUser.uid}_${likedUserId}`
        );
        await setDoc(matchRef, {
          users: [currentUser.uid, likedUserId],
          timestamp: serverTimestamp(),
          lastMessage: null,
          lastMessageTime: null,
        });

        return { success: true, isMatch: true };
      }

      return { success: true, isMatch: false };
    } catch (error) {
      console.error("Like user error:", error);
      return { success: false, error: error.message };
    }
  };

  // Get user matches
  const getUserMatches = async () => {
    if (!currentUser) return [];

    try {
      const matchesRef = collection(db, "matches");
      const q = query(
        matchesRef,
        where("users", "array-contains", currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      const matches = [];

      for (const matchDoc of querySnapshot.docs) {
        const matchData = matchDoc.data();
        const otherUserId = matchData.users.find(
          (uid) => uid !== currentUser.uid
        );

        // Get other user's profile
        const otherUserDoc = await getDoc(doc(db, "users", otherUserId));
        if (otherUserDoc.exists()) {
          matches.push({
            matchId: matchDoc.id,
            ...matchData,
            otherUser: { id: otherUserDoc.id, ...otherUserDoc.data() },
          });
        }
      }

      return matches;
    } catch (error) {
      console.error("Error getting matches:", error);
      return [];
    }
  };

  // Update last seen
  const updateLastSeen = async () => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        lastSeen: serverTimestamp(),
        isActive: true,
      });
    } catch (error) {
      console.error("Error updating last seen:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Get user profile from Firestore
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Update last seen on user activity
  useEffect(() => {
    if (currentUser && !loading) {
      updateLastSeen();

      // Update last seen every 5 minutes while user is active
      const interval = setInterval(updateLastSeen, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [currentUser, loading]);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    getUserProfile,
    updateUserProfile,
    isProfileComplete,
    resetPassword,
    deleteAccount,
    getPotentialMatches,
    likeUser,
    getUserMatches,
    updateLastSeen,
    validateUOMEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
