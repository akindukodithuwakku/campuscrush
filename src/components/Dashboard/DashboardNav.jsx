import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  HomeIcon,
  HeartIcon,
  UserGroupIcon,
  UserIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const DashboardNav = ({ activeSection, onSectionChange, userProfile }) => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    {
      id: "overview",
      name: "Overview",
      icon: HomeIcon,
      description: "Dashboard overview",
    },
    {
      id: "browse",
      name: "Browse",
      icon: HeartIcon,
      description: "Discover matches",
    },
    {
      id: "matches",
      name: "Matches",
      icon: UserGroupIcon,
      description: "Your matches",
    },
    {
      id: "chats",
      name: "Chats",
      icon: ChatBubbleLeftRightIcon,
      description: "Messages",
    },
    {
      id: "profile",
      name: "Profile",
      icon: UserIcon,
      description: "Edit profile",
    },
    {
      id: "settings",
      name: "Settings",
      icon: CogIcon,
      description: "Account settings",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg border border-white/20"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-lg border-r border-white/20
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {userProfile?.firstName?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {userProfile?.firstName || "User"}
                </h2>
                <p className="text-sm text-gray-500">
                  {userProfile?.faculty || "University of Moratuwa"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                    }
                  `}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div
                      className={`text-xs ${
                        isActive ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardNav;

