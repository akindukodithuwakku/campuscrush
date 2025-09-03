import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProfileStatusGuard = ({ children }) => {
  const { currentUser, userProfile, loading, checkProfileStatus } = useAuth();
  const [profileStatusLoading, setProfileStatusLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (currentUser && !loading) {
        setProfileStatusLoading(true);
        try {
          const status = await checkProfileStatus();

          // If profile is not complete, redirect to profile setup
          if (!status.profileCompleted) {
            console.log(
              "🔄 Profile incomplete detected, will redirect to profile setup"
            );
            setShouldRedirect(true);
          }
        } catch (error) {
          console.error("Error checking profile status:", error);
          // On error, assume profile is incomplete and redirect
          setShouldRedirect(true);
        } finally {
          setProfileStatusLoading(false);
        }
      }
    };

    checkStatus();
  }, [currentUser, loading, checkProfileStatus]);

  if (loading || profileStatusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-romantic-50 via-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking profile status...</p>
        </div>
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

export default ProfileStatusGuard;
