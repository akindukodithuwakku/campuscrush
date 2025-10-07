import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import hybridApi from "../services/hybridApi";
import DashboardNav from "../components/Dashboard/DashboardNav";
import DashboardOverview from "../components/Dashboard/DashboardOverview";
import BrowseSection from "../components/Dashboard/BrowseSection";
import MatchesSection from "../components/Dashboard/MatchesSection";
import ProfileSection from "../components/Dashboard/ProfileSection";
import SettingsSection from "../components/Dashboard/SettingsSection";

const Dashboard = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalMatches: 0,
      totalLikes: 0,
      profileViews: 0,
      newMessages: 0,
    },
    recentMatches: [],
    potentialMatches: [],
    isLoading: true,
  });

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentUser || !userProfile) return;

      try {
        setDashboardData((prev) => ({ ...prev, isLoading: true }));

        // Load dashboard stats and matches in parallel
        const [statsResponse, matchesResponse] = await Promise.all([
          hybridApi.getDashboardStats(),
          hybridApi.getDashboardMatches(10, 0),
        ]);

        setDashboardData({
          stats: statsResponse.data.stats,
          recentMatches: matchesResponse.data.matches,
          potentialMatches: [],
          isLoading: false,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setDashboardData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadDashboardData();
  }, [currentUser, userProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-romantic-50 via-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-romantic-50 via-primary-50 to-secondary-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            Please log in to access your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview data={dashboardData} />;
      case "browse":
        return <BrowseSection />;
      case "matches":
        return <MatchesSection matches={dashboardData.recentMatches} />;
      case "profile":
        return <ProfileSection userProfile={userProfile} />;
      case "settings":
        return <SettingsSection userProfile={userProfile} />;
      default:
        return <DashboardOverview data={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-romantic-50 via-primary-50 to-secondary-50">
      <div className="flex">
        {/* Sidebar Navigation */}
        <DashboardNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          userProfile={userProfile}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <div className="p-6">{renderActiveSection()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
