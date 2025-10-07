import React from "react";
import {
  HeartIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const DashboardOverview = ({ data }) => {
  const { stats, recentMatches, isLoading } = data;

  const statCards = [
    {
      title: "Total Matches",
      value: stats.totalMatches,
      icon: HeartIcon,
      color: "from-pink-500 to-rose-500",
      change: "+3 this week",
      changeType: "positive",
    },
    {
      title: "Profile Views",
      value: stats.profileViews,
      icon: EyeIcon,
      color: "from-blue-500 to-cyan-500",
      change: "+12 this week",
      changeType: "positive",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes,
      icon: UserGroupIcon,
      color: "from-purple-500 to-pink-500",
      change: "+8 this week",
      changeType: "positive",
    },
    {
      title: "New Messages",
      value: stats.newMessages,
      icon: ChatBubbleLeftRightIcon,
      color: "from-green-500 to-emerald-500",
      change: "+2 today",
      changeType: "positive",
    },
  ];

  const quickActions = [
    {
      title: "Update Profile",
      description: "Add photos and update your bio",
      icon: "📸",
      action: "profile",
    },
    {
      title: "Browse Matches",
      description: "Discover new people",
      icon: "💕",
      action: "browse",
    },
    {
      title: "View Messages",
      description: "Check your conversations",
      icon: "💬",
      action: "chats",
    },
    {
      title: "Edit Preferences",
      description: "Update your matching criteria",
      icon: "⚙️",
      action: "settings",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-white/90 text-lg">
          Ready to find your perfect match? Let's see what's new in your dating
          journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div
                  className={`text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Matches */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Matches
              </h2>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                View All
              </button>
            </div>

            {recentMatches.length > 0 ? (
              <div className="space-y-4">
                {recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {match.name.charAt(0)}
                        </span>
                      </div>
                      {match.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {match.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {match.faculty} • {match.age} years old
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {match.lastMessage}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {match.lastMessageTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No matches yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start browsing to find your perfect match!
                </p>
                <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow">
                  Start Browsing
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="w-full flex items-center space-x-3 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors text-left"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tips Card */}
          <div className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <ArrowTrendingUpIcon className="h-6 w-6" />
              <h3 className="font-bold text-lg">Pro Tip</h3>
            </div>
            <p className="text-white/90 text-sm">
              Complete your profile with multiple photos and a detailed bio to
              increase your match rate by 40%!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
