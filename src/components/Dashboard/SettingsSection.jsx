import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  TrashIcon,
  KeyIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const SettingsSection = ({ userProfile }) => {
  const { logout, deleteAccount, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState("notifications");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      newMatches: true,
      messages: true,
      profileViews: false,
      marketing: false,
    },
    privacy: {
      showOnlineStatus: true,
      showLastSeen: true,
      showDistance: true,
      allowProfileDiscovery: true,
    },
    matching: {
      ageRange: { min: 18, max: 25 },
      maxDistance: 10,
      showMe: "everyone",
    },
  });

  const tabs = [
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "privacy", name: "Privacy", icon: ShieldCheckIcon },
    { id: "matching", name: "Matching", icon: EyeIcon },
    { id: "account", name: "Account", icon: KeyIcon },
  ];

  const handleSettingChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to save settings
      console.log("Saving settings:", settings);
      // await updateUserSettings(settings);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!userProfile?.email) return;

    setLoading(true);
    try {
      await resetPassword(userProfile.email);
      alert("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset:", error);
      alert("Error sending password reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await deleteAccount();
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account");
    } finally {
      setLoading(false);
    }
  };

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === "newMatches" &&
                    "Get notified when someone likes you back"}
                  {key === "messages" && "Get notified about new messages"}
                  {key === "profileViews" &&
                    "Get notified when someone views your profile"}
                  {key === "marketing" &&
                    "Receive promotional emails and updates"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    handleSettingChange("notifications", key, e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Privacy Settings
        </h3>
        <div className="space-y-4">
          {Object.entries(settings.privacy).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === "showOnlineStatus" &&
                    "Show when you're online to other users"}
                  {key === "showLastSeen" &&
                    "Show your last seen time to matches"}
                  {key === "showDistance" &&
                    "Show your distance to other users"}
                  {key === "allowProfileDiscovery" &&
                    "Allow your profile to be discovered in search"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    handleSettingChange("privacy", key, e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMatchingTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Matching Preferences
        </h3>
        <div className="space-y-6">
          {/* Age Range */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Age Range</h4>
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Min Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="50"
                  value={settings.matching.ageRange.min}
                  onChange={(e) =>
                    handleSettingChange("matching", "ageRange", {
                      ...settings.matching.ageRange,
                      min: parseInt(e.target.value),
                    })
                  }
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Max Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="50"
                  value={settings.matching.ageRange.max}
                  onChange={(e) =>
                    handleSettingChange("matching", "ageRange", {
                      ...settings.matching.ageRange,
                      max: parseInt(e.target.value),
                    })
                  }
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Distance */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Maximum Distance</h4>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="50"
                value={settings.matching.maxDistance}
                onChange={(e) =>
                  handleSettingChange(
                    "matching",
                    "maxDistance",
                    parseInt(e.target.value)
                  )
                }
                className="flex-1"
              />
              <span className="text-sm text-gray-600">
                {settings.matching.maxDistance} km
              </span>
            </div>
          </div>

          {/* Show Me */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Show Me</h4>
            <select
              value={settings.matching.showMe}
              onChange={(e) =>
                handleSettingChange("matching", "showMe", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="everyone">Everyone</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Account Settings
        </h3>
        <div className="space-y-4">
          {/* Email */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <EnvelopeIcon className="h-5 w-5 text-gray-500" />
              <h4 className="font-medium text-gray-900">Email Address</h4>
            </div>
            <p className="text-sm text-gray-600">{userProfile?.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Password */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <KeyIcon className="h-5 w-5 text-gray-500" />
                <div>
                  <h4 className="font-medium text-gray-900">Password</h4>
                  <p className="text-sm text-gray-600">
                    Last changed 30 days ago
                  </p>
                </div>
              </div>
              <button
                onClick={handlePasswordReset}
                disabled={loading}
                className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              <h4 className="font-medium text-red-900">Delete Account</h4>
            </div>
            <p className="text-sm text-red-700 mb-4">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "notifications":
        return renderNotificationsTab();
      case "privacy":
        return renderPrivacyTab();
      case "matching":
        return renderMatchingTab();
      case "account":
        return renderAccountTab();
      default:
        return renderNotificationsTab();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${
                      activeTab === tab.id
                        ? "bg-primary-100 text-primary-700 border border-primary-200"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            {renderActiveTab()}

            {/* Save Button */}
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              <h3 className="text-xl font-bold text-gray-900">
                Delete Account
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSection;

