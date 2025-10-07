import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Lottie from "lottie-react";

const ProfileSetup = () => {
  const { currentUser, userProfile, completeProfile, saveProfileStep } =
    useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",

    // University Information
    studentId: "",
    faculty: "",
    department: "",
    yearOfStudy: "",
    semester: "",

    // Profile Details
    bio: "",
    interests: [],
    lookingFor: "",

    // Contact Preferences
    showEmail: false,
    showPhone: false,

    // Profile Picture
    profilePicture: null,
    profilePicturePreview: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if user is authenticated and email is verified
  useEffect(() => {
    console.log("🔍 ProfileSetup - Current user:", currentUser);
    console.log("🔍 ProfileSetup - User profile:", userProfile);

    if (!currentUser) {
      console.log("❌ No current user, redirecting to login");
      navigate("/login");
      return;
    }

    if (!currentUser.emailVerified) {
      console.log("❌ Email not verified, redirecting to email verification");
      navigate("/email-verification");
      return;
    }

    console.log("✅ User authenticated and email verified");

    // Load existing profile data if available
    if (userProfile) {
      console.log("📋 Loading existing profile data:", userProfile);
      setFormData((prev) => ({
        ...prev,
        ...userProfile,
      }));
    }
  }, [currentUser, userProfile, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file" && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
        profilePicturePreview: URL.createObjectURL(file),
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleInterestChange = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        // Only require first and last name
        return formData.firstName && formData.lastName;
      case 2:
        // Make university info optional
        return true; // Allow users to skip university info
      case 3:
        // Make profile details optional
        return true; // Allow users to skip profile details
      default:
        return true;
    }
  };

  // Save current step data to database
  const saveCurrentStep = async () => {
    let stepData = {};

    switch (currentStep) {
      case 1:
        stepData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
          gender: formData.gender,
        };
        break;
      case 2:
        stepData = {
          studentId: formData.studentId,
          faculty: formData.faculty,
          department: formData.department,
          yearOfStudy: parseInt(formData.yearOfStudy),
          semester: parseInt(formData.semester),
        };
        break;
      case 3:
        stepData = {
          bio: formData.bio,
          interests: formData.interests,
          lookingFor: formData.lookingFor,
        };
        break;
      case 4:
        stepData = {
          showEmail: formData.showEmail,
          showPhone: formData.showPhone,
        };
        break;
      default:
        return { success: true };
    }

    try {
      const result = await saveProfileStep(stepData, currentStep);
      return result;
    } catch (error) {
      console.error(`Error saving step ${currentStep}:`, error);
      return { success: false, error: error.message };
    }
  };

  const nextStep = async () => {
    if (validateStep(currentStep)) {
      setIsSaving(true);
      setError("");

      try {
        // Save current step data before proceeding
        const saveResult = await saveCurrentStep();

        if (saveResult.success) {
          setCurrentStep((prev) => Math.min(prev + 1, 4));
          setError("");
        } else {
          setError(
            saveResult.error || "Failed to save current step. Please try again."
          );
        }
      } catch (error) {
        setError("An error occurred while saving. Please try again.");
      } finally {
        setIsSaving(false);
      }
    } else {
      let errorMessage =
        "Please fill in all required fields before proceeding.";

      if (currentStep === 3) {
        if (formData.bio && formData.bio.length < 1) {
          errorMessage = "Bio must be at least 1 character long.";
        }
      }

      setError(errorMessage);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // First save the final step data
      const saveResult = await saveCurrentStep();
      if (!saveResult.success) {
        setError(saveResult.error || "Failed to save final step data.");
        return;
      }

      // Prepare data for backend validation
      const profileData = {
        ...formData,
        // Only convert to int if value exists
        yearOfStudy: formData.yearOfStudy
          ? parseInt(formData.yearOfStudy)
          : undefined,
        semester: formData.semester ? parseInt(formData.semester) : undefined,
        // Only convert date if value exists
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : undefined,
      };

      // Remove empty strings and undefined values
      Object.keys(profileData).forEach((key) => {
        if (profileData[key] === "" || profileData[key] === undefined) {
          delete profileData[key];
        }
      });

      console.log("📤 Completing profile with data:", profileData);

      const result = await completeProfile(profileData);
      if (result.success) {
        console.log(
          "✅ Profile completed successfully, redirecting to main app"
        );
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("❌ Profile completion error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple Lottie animation for profile setup
  const profileAnimation = {
    v: "5.5.7",
    fr: 60,
    ip: 0,
    op: 180,
    w: 400,
    h: 400,
    nm: "Profile Setup",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Profile",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [200, 200, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                d: 1,
                ty: "el",
                s: { a: 0, k: [100, 100] },
                p: { a: 0, k: [0, 0] },
              },
            ],
          },
        ],
      },
    ],
  };

  if (!currentUser || !currentUser.emailVerified) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-romantic-50 via-primary-50 to-secondary-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-3xl font-bold">👤</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-xl text-gray-600">
            Help others get to know you better and find meaningful connections
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? "bg-primary-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {currentStep} of 4
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: University Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  University Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your student ID (optional)"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter your university student ID (optional)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Faculty
                    </label>
                    <input
                      type="text"
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your faculty (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Computer Science & Engineering (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year of Study
                      </label>
                      <select
                        name="yearOfStudy"
                        value={formData.yearOfStudy}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select year (optional)</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="5">5th Year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Semester
                      </label>
                      <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select semester (optional)</option>
                        <option value="1">1st Semester</option>
                        <option value="2">2nd Semester</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Profile Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tell others about yourself, your interests, and what you're looking for... (optional)"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.bio.length}/1000 characters (optional)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests (Select any that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Technology",
                      "Sports",
                      "Music",
                      "Reading",
                      "Travel",
                      "Cooking",
                      "Gaming",
                      "Art",
                      "Photography",
                      "Fitness",
                      "Movies",
                      "Dancing",
                      "Writing",
                      "Nature",
                      "Fashion",
                      "Food",
                      "Languages",
                      "Volunteering",
                    ].map((interest) => (
                      <label
                        key={interest}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {interest}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Looking For
                  </label>
                  <input
                    type="text"
                    name="lookingFor"
                    value={formData.lookingFor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="What are you looking for? (optional)"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Final Details & Profile Picture */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Final Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture (Optional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {formData.profilePicturePreview ? (
                        <img
                          src={formData.profilePicturePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-2xl">👤</span>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        name="profilePicture"
                        onChange={handleChange}
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Optional: Square image, max 5MB. You can add this later.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Privacy Settings
                  </h3>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="showEmail"
                      checked={formData.showEmail}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      Allow others to see my email address
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="showPhone"
                      checked={formData.showPhone}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      Allow others to see my phone number
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mt-6">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>

              <div className="flex space-x-4">
                {currentStep < 4 ? (
                  <>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={isSaving}
                      className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isSaving ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </div>
                      ) : (
                        "Next"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Skip to Complete
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Completing Profile...
                      </div>
                    ) : (
                      "Complete Profile"
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Lottie Animation */}
        <div className="flex justify-center mt-8">
          <div className="w-32 h-32">
            <Lottie
              animationData={profileAnimation}
              loop={true}
              autoplay={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
