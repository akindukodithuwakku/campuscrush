import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requireProfile = false }) => {
  const { currentUser, userProfile, loading, checkProfileStatus } = useAuth();
  const [profileStatusLoading, setProfileStatusLoading] = useState(false);
  const [profileStatus, setProfileStatus] = useState(null);

  // Check profile status when user is authenticated
  useEffect(() => {
    const verifyProfileStatus = async () => {
      if (currentUser && requireProfile) {
        setProfileStatusLoading(true);
        try {
          const status = await checkProfileStatus();
          setProfileStatus(status);
        } catch (error) {
          console.error("Error checking profile status:", error);
          setProfileStatus({ profileCompleted: false, needsOnboarding: true });
        } finally {
          setProfileStatusLoading(false);
        }
      }
    };

    verifyProfileStatus();
  }, [currentUser, requireProfile, checkProfileStatus]);

  if (loading || profileStatusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-romantic-50 via-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If profile is required, check completion status
  if (requireProfile) {
    // Use backend status if available, fallback to local state
    const isProfileComplete = profileStatus
      ? profileStatus.profileCompleted
      : userProfile && userProfile.profileCompleted;

    if (!isProfileComplete) {
      console.log("🔄 Profile incomplete, redirecting to profile setup");
      return <Navigate to="/profile-setup" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
