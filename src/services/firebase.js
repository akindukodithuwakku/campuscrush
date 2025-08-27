// Firebase service functions for Campus Crush
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../config/firebase";

class FirebaseService {
  // Upload image to Firebase Storage
  async uploadImage(file, path) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { success: true, url: downloadURL };
    } catch (error) {
      console.error("Error uploading image:", error);
      return { success: false, error: error.message };
    }
  }

  // Delete image from Firebase Storage
  async deleteImage(imagePath) {
    try {
      const storageRef = ref(storage, imagePath);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      console.error("Error deleting image:", error);
      return { success: false, error: error.message };
    }
  }

  // Upload user profile photo
  async uploadProfilePhoto(userId, file) {
    const path = `users/${userId}/photos/${Date.now()}_${file.name}`;
    return this.uploadImage(file, path);
  }

  // Real-time listener for user matches
  subscribeToMatches(userId, callback) {
    const matchesRef = collection(db, "matches");
    const q = query(
      matchesRef,
      where("users", "array-contains", userId),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const matches = [];
      snapshot.forEach((doc) => {
        matches.push({ id: doc.id, ...doc.data() });
      });
      callback(matches);
    });
  }

  // Real-time listener for chat messages
  subscribeToChatMessages(matchId, callback) {
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("matchId", "==", matchId),
      orderBy("timestamp", "asc")
    );

    return onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      callback(messages);
    });
  }

  // Send a chat message
  async sendMessage(matchId, senderId, receiverId, message) {
    try {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        matchId,
        senderId,
        receiverId,
        message,
        timestamp: serverTimestamp(),
        read: false,
      });

      // Update match with last message info
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, {
        lastMessage: message,
        lastMessageTime: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error sending message:", error);
      return { success: false, error: error.message };
    }
  }

  // Mark messages as read
  async markMessagesAsRead(matchId, userId) {
    try {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("matchId", "==", matchId),
        where("receiverId", "==", userId),
        where("read", "==", false)
      );

      const querySnapshot = await getDocs(q);
      const batch = [];

      querySnapshot.forEach((docSnapshot) => {
        batch.push(updateDoc(docSnapshot.ref, { read: true }));
      });

      await Promise.all(batch);
      return { success: true };
    } catch (error) {
      console.error("Error marking messages as read:", error);
      return { success: false, error: error.message };
    }
  }

  // Get unread message count
  async getUnreadMessageCount(userId) {
    try {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("receiverId", "==", userId),
        where("read", "==", false)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  // Report a user
  async reportUser(reporterId, reportedUserId, reason, description) {
    try {
      const reportsRef = collection(db, "reports");
      await addDoc(reportsRef, {
        reporterId,
        reportedUserId,
        reason,
        description,
        timestamp: serverTimestamp(),
        status: "pending",
      });

      return { success: true };
    } catch (error) {
      console.error("Error reporting user:", error);
      return { success: false, error: error.message };
    }
  }

  // Block a user
  async blockUser(userId, blockedUserId) {
    try {
      const blockRef = doc(db, "blocks", `${userId}_${blockedUserId}`);
      await addDoc(blockRef, {
        userId,
        blockedUserId,
        timestamp: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error blocking user:", error);
      return { success: false, error: error.message };
    }
  }

  // Get user's blocked list
  async getBlockedUsers(userId) {
    try {
      const blocksRef = collection(db, "blocks");
      const q = query(blocksRef, where("userId", "==", userId));

      const querySnapshot = await getDocs(q);
      const blocked = [];

      querySnapshot.forEach((doc) => {
        blocked.push(doc.data().blockedUserId);
      });

      return blocked;
    } catch (error) {
      console.error("Error getting blocked users:", error);
      return [];
    }
  }

  // Search users by interests
  async searchUsersByInterests(
    interests,
    excludeUserIds = [],
    limitCount = 10
  ) {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("interests", "array-contains-any", interests),
        where("profileCompleted", "==", true),
        where("isActive", "==", true),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const users = [];

      querySnapshot.forEach((doc) => {
        if (!excludeUserIds.includes(doc.id)) {
          users.push({ id: doc.id, ...doc.data() });
        }
      });

      return users;
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }

  // Analytics - track user activity
  async trackUserActivity(userId, activity, metadata = {}) {
    try {
      const activityRef = collection(db, "analytics");
      await addDoc(activityRef, {
        userId,
        activity,
        metadata,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error tracking activity:", error);
    }
  }
}

export default new FirebaseService();
