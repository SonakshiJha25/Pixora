import mongoose from "mongoose";

export async function connectDb() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    console.error("MongoDB connection failed: MONGODB_URI is missing or empty");
    process.exit(1);
  }

  console.log("Connecting to DB:", uri);

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err.message);
  });

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15_000,
    });

    const name = mongoose.connection.db?.databaseName;
    console.log("MongoDB connected successfully");
    console.log(`MongoDB connected (database: ${name ?? "?"})`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

export function getDbName() {
  return mongoose.connection?.db?.databaseName ?? null;
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}
