import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

import path from "path";
dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve(); // phải gọi path.resolve()

app.use(express.json({ limit: "10mb" })); // tăng giới hạn JSON lên 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true })); // nếu dùng form-urlencoded

app.use(cookieParser());

// Dynamic CORS configuration
const corsOrigins = process.env.NODE_ENV === "production" 
  ? [process.env.FRONTEND_URL || "https://your-app-name.onrender.com"] 
  : ["http://localhost:5173"];

app.use(cors({ 
  origin: corsOrigins, 
  credentials: true 
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  // Serve static files from the frontend build
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  // Handle React routing - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
  connectDB();
});
