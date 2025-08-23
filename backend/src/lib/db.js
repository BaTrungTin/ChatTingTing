import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      console.error("MONGODB_URL is not defined in environment variables");
      process.exit(1);
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
