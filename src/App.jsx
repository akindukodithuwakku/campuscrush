// Main App component

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileStatusGuard from "./components/ProfileStatusGuard";
import FirebaseSetup from "./components/FirebaseSetup";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmailVerification from "./pages/EmailVerification";
import ProfileSetup from "./pages/ProfileSetup";
import ProfileOnboarding from "./pages/ProfileOnboarding";
import Dashboard from "./pages/Dashboard";

function App() {
  // Check if Firebase is properly configured
  const isFirebaseConfigured =
    process.env.REACT_APP_FIREBASE_API_KEY &&
    process.env.REACT_APP_FIREBASE_PROJECT_ID &&
    process.env.REACT_APP_FIREBASE_API_KEY !== "your-actual-firebase-api-key";

  // Show setup screen if Firebase is not configured
  if (!isFirebaseConfigured) {
    return <FirebaseSetup />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/email-verification" element={<EmailVerification />} />

            {/* Protected Routes */}
            <Route
              path="/profile-setup"
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <ProfileOnboarding />
                </ProtectedRoute>
              }
            />

            <Route
              path="/browse"
              element={
                <ProtectedRoute>
                  <ProfileStatusGuard>
                    <div className="min-h-screen bg-gradient-to-br from-romantic-50 via-primary-50 to-secondary-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                          Browse Matches Coming Soon!
                        </h1>
                        <p className="text-gray-600 mb-6">
                          This is where users will browse and discover potential
                          matches.
                        </p>
                        <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-4xl">💕</span>
                        </div>
                      </div>
                    </div>
                  </ProfileStatusGuard>
                </ProtectedRoute>
              }
            />

            <Route
              path="/chats"
              element={
                <ProtectedRoute>
                  <ProfileStatusGuard>
                    <div className="min-h-screen bg-gradient-to-br from-romantic-50 via-primary-50 to-secondary-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                          Chats Coming Soon!
                        </h1>
                        <p className="text-gray-600 mb-6">
                          This is where users will chat with their matches.
                        </p>
                        <div className="w-32 h-32 bg-gradient-to-r from-accent-500 to-romantic-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-4xl">💬</span>
                        </div>
                      </div>
                    </div>
                  </ProfileStatusGuard>
                </ProtectedRoute>
              }
            />

            {/* Dashboard route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ProfileStatusGuard>
                    <Dashboard />
                  </ProfileStatusGuard>
                </ProtectedRoute>
              }
            />

            {/* Default route for authenticated users */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ProfileStatusGuard>
                    <Navigate to="/dashboard" replace />
                  </ProfileStatusGuard>
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
