import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // Check auth khi load app
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("❌ Error khi checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
      
      // Force redirect to login page and refresh
      window.location.href = "/login";
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },

  // Update profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated");
    } catch (error) {
      console.log("❌ Error updating profile:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Kết nối socket
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser) return;

    if (!socket) {
      const newSocket = io(BASE_URL, {
        withCredentials: true,
        query: { userId: authUser._id.toString() }, // 👈 ép string
      });

      newSocket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });

      set({ socket: newSocket });
      
      // Start listening for messages immediately when socket connects
      const { useChatStore } = await import("./useChatStore");
      useChatStore.getState().listenMessages();
    }
  },

  // Ngắt kết nối socket
  disconnectSocket: async () => {
    const { socket } = get();
    if (socket && socket.connected) {
      // Stop listening for messages before disconnecting
      const { useChatStore } = await import("./useChatStore");
      useChatStore.getState().notListenMessages();
      
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
      
      // Clear unread messages when disconnecting
      useChatStore.setState({ unreadMessages: {} });
    }
  },
}));
