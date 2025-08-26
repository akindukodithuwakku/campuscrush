import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Lottie from "lottie-react";

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const email = location.state?.email || currentUser?.email || "";
  const displayName =
    location.state?.displayName || currentUser?.displayName || "";

  useEffect(() => {
    if (!email) {
      navigate("/signup");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleResendEmail = async () => {
    if (!currentUser) return;

    try {
      // This would typically call a function to resend verification email
      setCountdown(60);
      setCanResend(false);
      // You can add a toast notification here
    } catch (error) {
      console.error("Error resending email:", error);
    }
  };

  const handleCheckVerification = async () => {
    if (!currentUser) return;

    try {
      // Reload user to check if email is verified
      await currentUser.reload();

      if (currentUser.emailVerified) {
        navigate("/profile-setup");
      }
    } catch (error) {
      console.error("Error checking verification:", error);
    }
  };

  // Simple Lottie animation for email verification
  const emailAnimation = {
    v: "5.5.7",
    fr: 60,
    ip: 0,
    op: 180,
    w: 400,
    h: 400,
    nm: "Email Verification",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Envelope",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-romantic-50 via-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl">✉️</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600">We've sent a verification link to</p>
          <p className="text-primary-600 font-medium break-all">{email}</p>
        </div>

        {/* Lottie Animation */}
        <div className="flex justify-center">
          <div className="w-48 h-48">
            <Lottie
              animationData={emailAnimation}
              loop={true}
              autoplay={true}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 text-center">
            Next Steps
          </h3>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p className="text-gray-700 text-sm">
                Check your email inbox (and spam folder)
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p className="text-gray-700 text-sm">
                Click the verification link in the email
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p className="text-gray-700 text-sm">
                Return here and click "I've Verified My Email"
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleCheckVerification}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105"
          >
            I've Verified My Email
          </button>

          <button
            onClick={handleResendEmail}
            disabled={!canResend}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {canResend
              ? "Resend Verification Email"
              : `Resend in ${countdown}s`}
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Need Help?</h4>
          <p className="text-xs text-gray-600 mb-3">
            If you don't receive the email within a few minutes, check your spam
            folder or contact support.
          </p>
          <div className="flex space-x-4 text-xs">
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Contact Support
            </a>
            <a href="#" className="text-primary-600 hover:text-primary-700">
              FAQ
            </a>
          </div>
        </div>

        {/* Back to Signup */}
        <div className="text-center">
          <button
            onClick={() => navigate("/signup")}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            ← Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;

