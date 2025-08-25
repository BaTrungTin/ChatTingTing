import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Map quản lý user online: userId -> socketId
const userSocketMap = {};

// Hàm helper
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Khởi tạo Socket.IO
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("User online:", userId);
  }

  // gửi danh sách user online
  const onlineUserIds = Object.keys(userSocketMap);
  console.log("Online users:", onlineUserIds);
  io.emit("getOnlineUsers", onlineUserIds);

  // Xử lý request lấy danh sách user online
  socket.on("getOnlineUsers", (callback) => {
    callback(Object.keys(userSocketMap));
  });

  // Join/leave group rooms for realtime
  socket.on("joinGroups", (groupIds = []) => {
    try {
      groupIds.forEach((gid) => socket.join(`group:${gid}`));
    } catch (e) {
      console.log("joinGroups error", e.message);
    }
  });

  socket.on("leaveGroupRoom", (groupId) => {
    try {
      socket.leave(`group:${groupId}`);
    } catch (e) {
      console.log("leaveGroupRoom error", e.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      console.log("User offline:", userId);
    }

    const onlineUserIds = Object.keys(userSocketMap);
    console.log("Online users after disconnect:", onlineUserIds);
    io.emit("getOnlineUsers", onlineUserIds);
  });
});

export { app, server };
