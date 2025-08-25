import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [],
  selectedUser: null,
  selectedGroup: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isGroupsLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/user");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
      const socket = useAuthStore.getState().socket;
      if (socket && Array.isArray(res.data)) {
        socket.emit("joinGroups", res.data.map((g) => g._id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  getMessages: async (userOrGroupId, type = "dm") => {
    set({ isMessagesLoading: true });
    try {
      let res;
      if (type === "group") {
        res = await axiosInstance.get(`/groups/${userOrGroupId}/messages`);
      } else {
        res = await axiosInstance.get(`/messages/${userOrGroupId}`);
      }
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, selectedGroup, messages } = get();
    try {
      let res;
      if (selectedGroup) {
        res = await axiosInstance.post(
          `/groups/${selectedGroup._id}/messages`,
          messageData
        );
      } else if (selectedUser) {
        res = await axiosInstance.post(
          `/messages/send/${selectedUser._id}`,
          messageData
        );
      } else {
        toast.error("No chat selected");
        return;
      }
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  listenMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    const { selectedUser, selectedGroup } = get();
    socket.off("newMessage");
    socket.off("newGroupMessage");
    if (selectedGroup) {
      socket.on("newGroupMessage", (newMessage) => {
        if (newMessage.groupId !== selectedGroup._id) return;
        set({ messages: [...get().messages, newMessage] });
      });
    } else if (selectedUser) {
      socket.on("newMessage", (newMessage) => {
        if (newMessage.senderId !== selectedUser._id) return;
        set({ messages: [...get().messages, newMessage] });
      });
    }
  },

  notListenMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("newGroupMessage");
  },

  listenOnlineUsers: () => {
    const socket = useAuthStore.getState().socket;
    socket.on("getOnlineUsers", (onlineUserIds) => {
      console.log("ChatStore received online users:", onlineUserIds);
      // Refresh danh sach khi co user online

      get().getUsers();
      get().getGroups();
    });
  },

  notListenOnlineUsers: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("getOnlineUsers");
  },

  setSelectedUser: (user) => set({ selectedUser: user, selectedGroup: null }),
  setSelectedGroup: (group) => set({ selectedGroup: group, selectedUser: null }),

  createGroup: async ({ name, memberIds, avatar }) => {
    try {
      const res = await axiosInstance.post("/groups", { name, memberIds, avatar });
      set({ groups: [res.data, ...get().groups] });
      const socket = useAuthStore.getState().socket;
      if (socket) socket.emit("joinGroups", [res.data._id]);
      toast.success("Group created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    }
  },

  addMembersToGroup: async (groupId, memberIds) => {
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/members`, { memberIds });
      const updatedGroups = get().groups.map((g) => (g._id === groupId ? res.data : g));
      const currentSelectedGroup = get().selectedGroup;
      set({
        groups: updatedGroups,
        selectedGroup: currentSelectedGroup && currentSelectedGroup._id === groupId ? res.data : currentSelectedGroup,
      });
      toast.success("Members added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add members");
    }
  },

  leaveGroup: async (groupId) => {
    try {
      await axiosInstance.post(`/groups/${groupId}/leave`);
      set({
        groups: get().groups.filter((g) => g._id !== groupId),
        selectedGroup: get().selectedGroup?._id === groupId ? null : get().selectedGroup,
      });
      const socket = useAuthStore.getState().socket;
      if (socket) socket.emit("leaveGroupRoom", groupId);
      toast.success("Left group");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave group");
    }
  },

  updateGroupAvatar: async (groupId, image) => {
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/avatar`, { image });
      const updated = res.data;
      set({
        groups: get().groups.map((g) => (g._id === groupId ? updated : g)),
        selectedGroup:
          get().selectedGroup && get().selectedGroup._id === groupId
            ? updated
            : get().selectedGroup,
      });
      const socket = useAuthStore.getState().socket;
      if (socket) socket.emit("joinGroups", [groupId]);
      toast.success("Đã cập nhật ảnh nhóm");
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật ảnh nhóm thất bại");
    }
  },
}));
