import mongoose from "mongoose";
import { logError, logInfo } from "../utils/logger.js";
import { runUserCreditLedgerMigrationOnce } from "../migrations/userCreditLedgerMigration.js";

async function connectDB() {
  logInfo("MongoDB: connecting");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const dbName = mongoose.connection?.db?.databaseName ?? "unknown";
    logInfo(`MongoDB connected (database: ${dbName})`);
    await runUserCreditLedgerMigrationOnce();
  } catch (error) {
    logError("MongoDB connection failed", error);
    throw error;
  }
}

export default connectDB;
