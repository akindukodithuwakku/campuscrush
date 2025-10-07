import React, { useState } from "react";
import {
  HeartIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  ClockIcon,
  MapPinIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const MatchesSection = ({ matches = [] }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.faculty.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "online") {
      return matchesSearch && match.isOnline;
    }
    if (activeTab === "recent") {
      return matchesSearch && match.lastMessageTime.includes("hour");
    }
    return matchesSearch;
  });

  const tabs = [
    { id: "all", name: "All Matches", count: matches.length },
    {
      id: "online",
      name: "Online",
      count: matches.filter((m) => m.isOnline).length,
    },
    {
      id: "recent",
      name: "Recent",
      count: matches.filter((m) => m.lastMessageTime.includes("hour")).length,
    },
  ];

  const handleStartChat = (matchId) => {
    // TODO: Navigate to chat or open chat modal
    console.log("Starting chat with:", matchId);
  };

  const handleViewProfile = (matchId) => {
    // TODO: Navigate to profile view
    console.log("Viewing profile:", matchId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Matches
          </h1>
          <p className="text-gray-600">
            Connect with people who liked you back
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.name}
              <span
                className={`
                ml-2 py-0.5 px-2 rounded-full text-xs
                ${
                  activeTab === tab.id
                    ? "bg-primary-100 text-primary-600"
                    : "bg-gray-100 text-gray-600"
                }
              `}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow"
            >
              {/* Match Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {match.name.charAt(0)}
                    </span>
                  </div>
                  {match.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {match.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <AcademicCapIcon className="h-4 w-4" />
                    <span>{match.faculty}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{match.age} years old</span>
                  </div>
                </div>
              </div>

              {/* Last Message */}
              <div className="mb-4">
                <p className="text-gray-700 text-sm line-clamp-2">
                  {match.lastMessage}
                </p>
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                  <ClockIcon className="h-3 w-3" />
                  <span>{match.lastMessageTime}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStartChat(match.id)}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span>Chat</span>
                </button>
                <button
                  onClick={() => handleViewProfile(match.id)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? "No matches found" : "No matches yet"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Start browsing to find your perfect match!"}
          </p>
          {!searchQuery && (
            <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow">
              Start Browsing
            </button>
          )}
        </div>
      )}

      {/* Match Statistics */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Your Match Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{matches.length}</div>
            <div className="text-sm text-white/80">Total Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {matches.filter((m) => m.isOnline).length}
            </div>
            <div className="text-sm text-white/80">Online Now</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {matches.filter((m) => m.lastMessageTime.includes("hour")).length}
            </div>
            <div className="text-sm text-white/80">Active Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesSection;

