import React from "react";

const FirebaseSetup = () => {
  const isFirebaseConfigured =
    process.env.REACT_APP_FIREBASE_API_KEY &&
    process.env.REACT_APP_FIREBASE_PROJECT_ID &&
    process.env.REACT_APP_FIREBASE_API_KEY !== "your-actual-firebase-api-key";

  if (isFirebaseConfigured) {
    return null; // Don't show if Firebase is configured
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔥</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Firebase Setup Required
          </h1>
          <p className="text-gray-600">
            Your Campus Crush app needs Firebase configuration to work properly.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-yellow-600 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">
                  Configuration Missing
                </h3>
                <p className="text-yellow-700 text-sm">
                  Firebase credentials are not properly configured in your .env
                  file.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Quick Setup Steps:
            </h2>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Create Firebase Project</p>
                  <p className="text-sm text-gray-600">
                    Go to{" "}
                    <a
                      href="https://console.firebase.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Firebase Console
                    </a>{" "}
                    and create a new project named "campus-crush"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Enable Authentication</p>
                  <p className="text-sm text-gray-600">
                    Go to Authentication → Sign-in method → Enable
                    "Email/Password"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Get Configuration</p>
                  <p className="text-sm text-gray-600">
                    Project Settings → General → Your apps → Add web app → Copy
                    config
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Update .env File</p>
                  <p className="text-sm text-gray-600">
                    Replace the placeholder values in{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      frontend/.env
                    </code>{" "}
                    with your actual Firebase credentials
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <div>
                  <p className="font-medium">Restart Development Server</p>
                  <p className="text-sm text-gray-600">
                    Run{" "}
                    <code className="bg-gray-100 px-1 rounded">npm start</code>{" "}
                    again to load the new configuration
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-blue-600 text-xl mr-3">📚</div>
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">Need Help?</h3>
                <p className="text-blue-700 text-sm mb-2">
                  Check the detailed setup guide:{" "}
                  <code className="bg-blue-100 px-1 rounded">
                    FIREBASE_QUICK_SETUP.md
                  </code>
                </p>
                <p className="text-blue-700 text-sm">
                  This setup takes about 5 minutes and only needs to be done
                  once.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              I've Updated the Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetup;
