import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  AcademicCapIcon,
  CalendarIcon,
  MapPinIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const ProfileSection = ({ userProfile }) => {
  const { updateUserProfile, uploadProfileImage } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: userProfile?.bio || "",
    interests: userProfile?.interests || [],
    lookingFor: userProfile?.lookingFor || "",
    showEmail: userProfile?.showEmail || false,
    showPhone: userProfile?.showPhone || false,
  });
  const [newInterest, setNewInterest] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddInterest = () => {
    if (
      newInterest.trim() &&
      !formData.interests.includes(newInterest.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter(
        (interest) => interest !== interestToRemove
      ),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      bio: userProfile?.bio || "",
      interests: userProfile?.interests || [],
      lookingFor: userProfile?.lookingFor || "",
      showEmail: userProfile?.showEmail || false,
      showPhone: userProfile?.showPhone || false,
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      await uploadProfileImage(file);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <PencilIcon className="h-4 w-4" />
          <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="flex flex-col lg:flex-row lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {userProfile.firstName?.charAt(0) || "U"}
                </span>
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                  <CameraIcon className="h-5 w-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {userProfile.firstName} {userProfile.lastName}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <AcademicCapIcon className="h-5 w-5" />
                  <span>
                    {userProfile.faculty} • {userProfile.department}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <CalendarIcon className="h-5 w-5" />
                  <span>
                    Year {userProfile.yearOfStudy} • Semester{" "}
                    {userProfile.semester}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPinIcon className="h-5 w-5" />
                  <span>University of Moratuwa</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-700">
                  {userProfile.bio || "No bio added yet"}
                </p>
              )}
            </div>

            {/* Looking For */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Looking For
              </label>
              {isEditing ? (
                <select
                  name="lookingFor"
                  value={formData.lookingFor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select what you're looking for</option>
                  <option value="friendship">Friendship</option>
                  <option value="dating">Dating</option>
                  <option value="relationship">Serious Relationship</option>
                  <option value="networking">Networking</option>
                </select>
              ) : (
                <p className="text-gray-700">
                  {userProfile.lookingFor || "Not specified"}
                </p>
              )}
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddInterest()
                      }
                    />
                    <button
                      onClick={handleAddInterest}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        <span>{interest}</span>
                        <button
                          onClick={() => handleRemoveInterest(interest)}
                          className="hover:text-primary-900"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userProfile.interests?.length > 0 ? (
                    userProfile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No interests added yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Privacy Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Privacy Settings
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="showEmail"
                    checked={formData.showEmail}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Show email to matches
                  </span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="showPhone"
                    checked={formData.showPhone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Show phone number to matches
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Completion */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <HeartIcon className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Profile Completion</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Complete your profile to get more matches</span>
            <span>75% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;

