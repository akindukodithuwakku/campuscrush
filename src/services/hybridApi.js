// Firebase API service: Firebase Auth + Firestore Backend
import { auth } from "../config/firebase";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class FirebaseApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get Firebase ID token for API requests
  async getFirebaseToken() {
    try {
      // Check if Firebase is properly configured
      const isFirebaseConfigured =
        process.env.REACT_APP_FIREBASE_API_KEY &&
        process.env.REACT_APP_FIREBASE_PROJECT_ID &&
        process.env.REACT_APP_FIREBASE_API_KEY !==
          "your-actual-firebase-api-key";

      if (!isFirebaseConfigured) {
        console.error("❌ Firebase not configured properly");
        throw new Error(
          "Firebase is not properly configured. Please set up your Firebase credentials."
        );
      }

      const user = auth.currentUser;
      console.log("🔍 Current Firebase user:", user ? user.uid : "No user");

      if (user) {
        // Force refresh the token to ensure it's valid
        const token = await user.getIdToken(true);
        console.log(
          "🔥 Firebase token obtained successfully, length:",
          token.length
        );
        console.log("🔥 Token preview:", token.substring(0, 50) + "...");
        return token;
      }
      console.warn("⚠️ No Firebase user found for token generation");
      return null;
    } catch (error) {
      console.error("❌ Error getting Firebase token:", error);
      return null;
    }
  }

  // Get authentication headers with Firebase token
  async getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    const token = await this.getFirebaseToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders();

    const config = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);

      // Specific handling for Firebase token errors
      if (
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        console.error("🔥 Firebase token validation failed on backend");
        console.error("This usually means:");
        console.error(
          "1. Firebase Authentication not enabled in Firebase Console"
        );
        console.error("2. Backend Firebase Admin SDK not properly configured");
        console.error("3. Token expired or invalid");
      }

      throw error;
    }
  }

  // Firebase Auth + MongoDB Registration
  async registerUserProfile(profileData) {
    const token = await this.getFirebaseToken();
    if (!token) {
      throw new Error("No Firebase token available");
    }

    return this.request("/auth/firebase/register", {
      method: "POST",
      body: JSON.stringify({
        idToken: token,
        profileData,
      }),
    });
  }

  // Firebase Auth + MongoDB Login
  async loginWithFirebase() {
    const token = await this.getFirebaseToken();
    if (!token) {
      throw new Error("No Firebase token available");
    }

    return this.request("/auth/firebase/login", {
      method: "POST",
      body: JSON.stringify({
        idToken: token,
      }),
    });
  }

  // Get current user (requires Firebase auth)
  async getCurrentUser() {
    return this.request("/auth/firebase/me");
  }

  // Check profile completion status
  async getProfileStatus() {
    return this.request("/auth/profile-status");
  }

  // Logout
  async logout() {
    return this.request("/auth/firebase/logout", {
      method: "POST",
    });
  }

  // User profile endpoints
  async getUserProfile(userId) {
    return this.request(`/users/${userId}`);
  }

  async updateUserProfile(profileData) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async completeProfile(profileData) {
    return this.request("/profiles/complete", {
      method: "POST",
      body: JSON.stringify(profileData),
    });
  }

  // Matching endpoints
  async getPotentialMatches(preferences = {}) {
    const queryParams = new URLSearchParams(preferences).toString();
    return this.request(
      `/matching/potential${queryParams ? `?${queryParams}` : ""}`
    );
  }

  async likeUser(userId) {
    return this.request("/matching/like", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  }

  async passUser(userId) {
    return this.request("/matching/pass", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  }

  async getUserMatches() {
    return this.request("/matching/matches");
  }

  async getMatchDetails(matchId) {
    return this.request(`/matching/matches/${matchId}`);
  }

  // Chat endpoints (for future implementation)
  async getChatMessages(matchId, page = 1, limit = 50) {
    return this.request(
      `/chat/${matchId}/messages?page=${page}&limit=${limit}`
    );
  }

  async sendMessage(matchId, message) {
    return this.request(`/chat/${matchId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  // Health check
  async healthCheck() {
    const response = await fetch("http://localhost:5000/health");
    return response.json();
  }

  // Profile image upload (using MongoDB backend)
  async uploadProfileImage(file) {
    const token = await this.getFirebaseToken();
    if (!token) {
      throw new Error("No Firebase token available");
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await fetch(`${this.baseURL}/users/upload-profile-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    return response.json();
  }

  // Search users
  async searchUsers(searchParams) {
    const queryParams = new URLSearchParams(searchParams).toString();
    return this.request(`/users/search?${queryParams}`);
  }

  // Report user
  async reportUser(userId, reason, description) {
    return this.request("/users/report", {
      method: "POST",
      body: JSON.stringify({
        reportedUserId: userId,
        reason,
        description,
      }),
    });
  }

  // Block user
  async blockUser(userId) {
    return this.request("/users/block", {
      method: "POST",
      body: JSON.stringify({ blockedUserId: userId }),
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request("/users/dashboard/stats");
  }

  async getDashboardMatches(limit = 10, offset = 0) {
    return this.request(
      `/users/dashboard/matches?limit=${limit}&offset=${offset}`
    );
  }

  async getPotentialMatchesForDashboard(limit = 20, offset = 0) {
    return this.request(
      `/users/dashboard/potential-matches?limit=${limit}&offset=${offset}`
    );
  }

  // User statistics
  async getUserStats() {
    return this.request("/users/stats/overview");
  }
}

export default new FirebaseApiService();
