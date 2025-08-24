import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadMessages: {}, // Track unread messages per user: { userId: count }

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/user");
      const currentUserId = useAuthStore.getState().authUser?._id;
      
      // Double-check: filter out current user on frontend too
      const filteredUsers = res.data.filter(user => 
        user._id.toString() !== currentUserId?.toString()
      );
      
      console.log("🔍 Frontend: Current user ID:", currentUserId);
      console.log("🔍 Frontend: Users from API:", res.data.length);
      console.log("🔍 Frontend: Filtered users:", filteredUsers.length);
      
      set({ users: filteredUsers });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      
      // Clear unread count for this user
      const { unreadMessages } = get();
      const newUnreadMessages = { ...unreadMessages };
      delete newUnreadMessages[userId];
      set({ unreadMessages: newUnreadMessages });
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  listenMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, unreadMessages } = get();
      const currentUserId = useAuthStore.getState().authUser?._id;
      
      console.log("🔍 New message received:", {
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        currentUserId: currentUserId,
        selectedUserId: selectedUser?._id,
        selectedUserName: selectedUser?.fullName
      });
      
      // Check if this message belongs to the current conversation
      const isCurrentConversation = selectedUser && (
        (newMessage.senderId === currentUserId && newMessage.receiverId === selectedUser._id) ||
        (newMessage.senderId === selectedUser._id && newMessage.receiverId === currentUserId)
      );
      
      if (isCurrentConversation) {
        // Add to current chat messages
        console.log("✅ Adding to current conversation");
        set({ messages: [...get().messages, newMessage] });
      } else {
        // Determine which user to increment unread count for
        const otherUserId = newMessage.senderId === currentUserId 
          ? newMessage.receiverId 
          : newMessage.senderId;
        
        // Only increment if it's not from current user (avoid self-notification)
        if (newMessage.senderId !== currentUserId) {
          console.log("📨 Adding to unread count for user:", otherUserId);
          const newUnreadMessages = { ...unreadMessages };
          newUnreadMessages[otherUserId] = (newUnreadMessages[otherUserId] || 0) + 1;
          set({ unreadMessages: newUnreadMessages });
        }
      }
    });
  },

  notListenMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  listenOnlineUsers: () => {
    // This listener is removed to avoid conflicts with useAuthStore
    // The online users should only be managed in useAuthStore
    // We can listen to other events here if needed but not getOnlineUsers
  },

  notListenOnlineUsers: () => {
    // No longer needed since we removed the listener
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
    
    // Clear unread count when selecting a user
    if (user) {
      const { unreadMessages } = get();
      const newUnreadMessages = { ...unreadMessages };
      delete newUnreadMessages[user._id];
      set({ unreadMessages: newUnreadMessages });
    }
  },

  // Helper function to get unread count for a user
  getUnreadCount: (userId) => {
    const { unreadMessages } = get();
    return unreadMessages[userId] || 0;
  },
}));
