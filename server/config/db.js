import mongoose from "mongoose";
import { logError, logInfo } from "../utils/logger.js";
import { runUserCreditLedgerMigrationOnce } from "../migrations/userCreditLedgerMigration.js";
import { runImageThreadRootBackfillOnce } from "../migrations/imageThreadMigration.js";
import { runImageVersionMigrationOnce } from "../migrations/imageVersionMigration.js";
import { areCreditsEnforced } from "./creditsEnabled.js";
import { refillStaleCreditPoolsForToday } from "../services/dailyCreditsService.js";

function requireMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    const msg =
      "MONGODB_URI is not set. Copy server/.env.example to server/.env and paste your MongoDB Atlas connection string.";
    logError(msg);
    throw new Error(msg);
  }
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    const msg = "MONGODB_URI must start with mongodb:// or mongodb+srv://";
    logError(msg);
    throw new Error(msg);
  }
  return uri;
}

async function connectDB() {
  const uri = requireMongoUri();
  logInfo("MongoDB: connecting…");

  mongoose.connection.on("error", (err) => {
    logError("MongoDB connection error", err);
  });

  mongoose.connection.on("disconnected", () => {
    logError("MongoDB disconnected — credit sync and saves will fail until reconnected");
  });

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      maxPoolSize: 20,
      retryWrites: true,
      w: "majority",
    });

    const dbName = mongoose.connection?.db?.databaseName ?? "unknown";
    logInfo(`MongoDB connected (database: ${dbName})`);

    await runUserCreditLedgerMigrationOnce();
    await runImageThreadRootBackfillOnce();
    await runImageVersionMigrationOnce();
    if (areCreditsEnforced()) {
      await refillStaleCreditPoolsForToday();
    }
  } catch (error) {
    logError(
      "MongoDB connection failed. Check MONGODB_URI, Atlas IP allowlist (0.0.0.0/0 for dev), and username/password.",
      error
    );
    throw error;
  }
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export default connectDB;
