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
      
      // Determine who the message is from/to
      const messageFromUserId = newMessage.senderId === currentUserId 
        ? newMessage.receiverId 
        : newMessage.senderId;
      
      // If we're currently chatting with this user, add to current messages
      if (selectedUser && selectedUser._id === messageFromUserId) {
        set({ messages: [...get().messages, newMessage] });
      } else {
        // Otherwise, increment unread count for this user
        const newUnreadMessages = { ...unreadMessages };
        newUnreadMessages[messageFromUserId] = (newUnreadMessages[messageFromUserId] || 0) + 1;
        set({ unreadMessages: newUnreadMessages });
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
