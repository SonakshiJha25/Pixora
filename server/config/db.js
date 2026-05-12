import mongoose from "mongoose";

async function connectDB() {
  console.log("Connecting to MongoDB...");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection error:");
    console.error(error);
    throw error;
  }
}

export default connectDB;
