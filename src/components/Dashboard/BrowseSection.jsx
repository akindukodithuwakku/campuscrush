import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  HeartIcon,
  XMarkIcon,
  StarIcon,
  MapPinIcon,
  AcademicCapIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const BrowseSection = () => {
  const { getPotentialMatches, likeUser, passUser } = useAuth();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Mock data for demonstration
  const mockProfiles = [
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      age: 22,
      faculty: "Engineering",
      department: "Computer Science",
      yearOfStudy: 3,
      bio: "Love coding, hiking, and good coffee. Looking for someone to explore the city with!",
      interests: ["Programming", "Photography", "Travel", "Music"],
      profilePicture: null,
      distance: "2 km away",
    },
    {
      id: "2",
      firstName: "Mike",
      lastName: "Chen",
      age: 21,
      faculty: "Engineering",
      department: "Mechanical Engineering",
      yearOfStudy: 2,
      bio: "Passionate about robotics and sustainability. Let's build something amazing together!",
      interests: ["Robotics", "Sustainability", "Gaming", "Fitness"],
      profilePicture: null,
      distance: "1.5 km away",
    },
    {
      id: "3",
      firstName: "Emma",
      lastName: "Williams",
      age: 23,
      faculty: "Management",
      department: "Business Administration",
      yearOfStudy: 4,
      bio: "Future entrepreneur with a love for art and culture. Always up for new adventures!",
      interests: ["Art", "Business", "Travel", "Dancing"],
      profilePicture: null,
      distance: "3 km away",
    },
  ];

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      // Try to get real data from API first
      const response = await getPotentialMatches();
      if (response && response.length > 0) {
        setProfiles(response);
        setCurrentProfile(response[0]);
      } else {
        // Fallback to mock data if no real data
        setProfiles([...mockProfiles]);
        setCurrentProfile(mockProfiles[0]);
      }
    } catch (error) {
      console.error("Error loading profiles:", error);
      // Fallback to mock data on error
      setProfiles([...mockProfiles]);
      setCurrentProfile(mockProfiles[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    if (!currentProfile || isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(direction);

    try {
      if (direction === "right") {
        await likeUser(currentProfile.id);
        // Handle match logic here
      } else {
        await passUser(currentProfile.id);
      }

      // Move to next profile
      setTimeout(() => {
        const nextProfiles = profiles.slice(1);
        setProfiles(nextProfiles);
        setCurrentProfile(nextProfiles[0] || null);
        setSwipeDirection(null);
        setIsAnimating(false);
      }, 300);
    } catch (error) {
      console.error("Error processing swipe:", error);
      setIsAnimating(false);
      setSwipeDirection(null);
    }
  };

  const handleLike = () => handleSwipe("right");
  const handlePass = () => handleSwipe("left");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading potential matches...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartIcon className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No more profiles
          </h2>
          <p className="text-gray-600 mb-6">
            Check back later for new potential matches!
          </p>
          <button
            onClick={loadProfiles}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover</h1>
        <p className="text-gray-600">Swipe right to like, left to pass</p>
      </div>

      {/* Profile Card */}
      <div className="relative">
        <div
          className={`
            bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300
            ${
              isAnimating
                ? swipeDirection === "right"
                  ? "rotate-12 translate-x-full"
                  : "-rotate-12 -translate-x-full"
                : ""
            }
          `}
          style={{
            minHeight: "600px",
            opacity: isAnimating ? 0.7 : 1,
          }}
        >
          {/* Profile Image */}
          <div className="relative h-96 bg-gradient-to-br from-primary-400 to-secondary-400">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-6xl font-bold">
                  {currentProfile.firstName.charAt(0)}
                </span>
              </div>
            </div>

            {/* Distance Badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
              <MapPinIcon className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {currentProfile.distance}
              </span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentProfile.firstName} {currentProfile.lastName}
              </h2>
              <span className="text-lg text-gray-600">
                {currentProfile.age}
              </span>
            </div>

            {/* Faculty Info */}
            <div className="flex items-center space-x-2 mb-4">
              <AcademicCapIcon className="h-5 w-5 text-primary-500" />
              <span className="text-gray-700">
                {currentProfile.faculty} • {currentProfile.department}
              </span>
            </div>

            {/* Year of Study */}
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="h-5 w-5 text-secondary-500" />
              <span className="text-gray-700">
                Year {currentProfile.yearOfStudy}
              </span>
            </div>

            {/* Bio */}
            <p className="text-gray-700 mb-4 leading-relaxed">
              {currentProfile.bio}
            </p>

            {/* Interests */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Swipe Indicators */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`
              text-6xl font-bold transform transition-all duration-300
              ${swipeDirection === "right" ? "text-green-500" : "text-red-500"}
            `}
            >
              {swipeDirection === "right" ? "LIKE" : "PASS"}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-6 mt-8">
        <button
          onClick={handlePass}
          disabled={isAnimating}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow disabled:opacity-50"
        >
          <XMarkIcon className="h-8 w-8 text-red-500" />
        </button>

        <button
          onClick={handleLike}
          disabled={isAnimating}
          className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow disabled:opacity-50"
        >
          <HeartIcon className="h-8 w-8 text-white" />
        </button>

        <button
          disabled={isAnimating}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow disabled:opacity-50"
        >
          <StarIcon className="h-8 w-8 text-yellow-500" />
        </button>
      </div>

      {/* Remaining Profiles Count */}
      <div className="text-center mt-6">
        <p className="text-gray-600">
          {profiles.length - 1} more profiles to discover
        </p>
      </div>
    </div>
  );
};

export default BrowseSection;
