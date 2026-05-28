/**
 * One-shot wipe script: removes every generated-image artifact across all
 * three storage backends so the app can start completely fresh.
 *
 *   1. MongoDB: hard-deletes every document in the Image collection.
 *   2. Cloudinary: deletes everything under pixorify/generated (if configured).
 *   3. Local disk: deletes every file under server/public/generated/.
 *
 * Safe-by-default. Pass --confirm (or WIPE_CONFIRM=yes) to actually delete.
 * Without it the script does a dry-run that just reports counts.
 *
 * Usage:
 *   # Dry run (just report what would happen):
 *   npm run wipe-images
 *
 *   # Actually delete everything (images only):
 *   npm run wipe-images:confirm
 *
 *   # Nuclear reset — images + Cloudinary + disk + ALL users + feedback:
 *   npm run wipe-full:confirm
 *
 * Make sure server/.env points at the database/Cloudinary account you want
 * to wipe before running. The script will print which database name it is
 * about to touch and abort if you ^C before confirming.
 */
import dotenv from "dotenv";
dotenv.config();

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import Image from "../models/Image.js";
import User from "../models/User.js";
import Feedback from "../models/Feedback.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.join(__dirname, "..", "public", "generated");
const CLOUDINARY_FOLDER = "pixorify/generated";

const CONFIRMED =
  (process.env.WIPE_CONFIRM || "").toLowerCase() === "yes" ||
  process.argv.includes("--confirm");

/** Also delete every User + Feedback document (MongoDB only — keeps Cloudinary wipe aligned). */
const WIPE_USERS = process.argv.includes("--users");

const log = (...args) => console.log("[wipe]", ...args);

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) return false;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  return true;
}

async function wipeMongo() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    log("MongoDB: MONGODB_URI not set — skipping.");
    return { skipped: true };
  }

  await mongoose.connect(uri);
  const dbName = mongoose.connection.db?.databaseName;
  log(`MongoDB: connected to database "${dbName}".`);

  const total = await Image.countDocuments({});
  log(`MongoDB: ${total} image record(s) currently in the collection.`);

  if (!CONFIRMED) {
    log("MongoDB: dry-run — would hard-delete all of them.");
    return { total, deleted: 0, dryRun: true };
  }

  const res = await Image.deleteMany({});
  log(`MongoDB: deleted ${res.deletedCount} record(s).`);
  return { total, deleted: res.deletedCount, dryRun: false };
}

async function wipeAccounts() {
  if (!WIPE_USERS) {
    return { skipped: true };
  }

  if (mongoose.connection.readyState !== 1) {
    log("MongoDB accounts: database not connected — skipping.");
    return { skipped: true };
  }

  const fbCount = await Feedback.countDocuments({});
  const userCount = await User.countDocuments({});
  log(`MongoDB: ${userCount} user(s), ${fbCount} feedback row(s).`);

  if (!CONFIRMED) {
    log("MongoDB accounts: dry-run — would delete all users + feedback.");
    return { feedback: fbCount, users: userCount, deletedFeedback: 0, deletedUsers: 0, dryRun: true };
  }

  const fr = await Feedback.deleteMany({});
  const ur = await User.deleteMany({});
  log(`MongoDB accounts: deleted ${fr.deletedCount} feedback row(s), ${ur.deletedCount} user(s).`);
  return {
    feedback: fbCount,
    users: userCount,
    deletedFeedback: fr.deletedCount,
    deletedUsers: ur.deletedCount,
    dryRun: false,
  };
}

async function wipeCloudinary() {
  const configured = configureCloudinary();
  if (!configured) {
    log("Cloudinary: env vars not set — skipping.");
    return { skipped: true };
  }

  log(`Cloudinary: targeting folder "${CLOUDINARY_FOLDER}".`);
  let totalDeleted = 0;
  let totalListed = 0;
  let nextCursor;

  do {
    const list = await cloudinary.api.resources({
      type: "upload",
      prefix: CLOUDINARY_FOLDER,
      max_results: 500,
      next_cursor: nextCursor,
    });
    const publicIds = (list.resources || []).map((r) => r.public_id);
    totalListed += publicIds.length;

    if (publicIds.length === 0) break;

    if (!CONFIRMED) {
      log(`Cloudinary: dry-run — would delete ${publicIds.length} asset(s) in this batch.`);
    } else {
      const result = await cloudinary.api.delete_resources(publicIds);
      const deleted = Object.values(result.deleted || {}).filter((v) => v === "deleted").length;
      totalDeleted += deleted;
      log(`Cloudinary: deleted ${deleted} asset(s) in this batch.`);
    }
    nextCursor = list.next_cursor;
  } while (nextCursor);

  if (CONFIRMED) {
    try {
      await cloudinary.api.delete_folder(CLOUDINARY_FOLDER);
      log(`Cloudinary: removed empty folder "${CLOUDINARY_FOLDER}".`);
    } catch (err) {
      log(`Cloudinary: could not delete folder (${err.message}). Probably not empty or already gone.`);
    }
  }

  log(`Cloudinary: ${totalListed} asset(s) found total, ${totalDeleted} deleted.`);
  return { listed: totalListed, deleted: totalDeleted, dryRun: !CONFIRMED };
}

async function wipeDisk() {
  let entries;
  try {
    entries = await fs.readdir(GENERATED_DIR);
  } catch (err) {
    if (err.code === "ENOENT") {
      log("Local disk: server/public/generated does not exist — nothing to do.");
      return { skipped: true };
    }
    throw err;
  }

  const files = entries.filter((f) => !f.startsWith("."));
  log(`Local disk: ${files.length} file(s) in server/public/generated.`);
  if (!CONFIRMED) {
    log("Local disk: dry-run — would delete all of them.");
    return { found: files.length, deleted: 0, dryRun: true };
  }

  let deleted = 0;
  for (const file of files) {
    const filePath = path.join(GENERATED_DIR, file);
    try {
      await fs.unlink(filePath);
      deleted += 1;
    } catch (err) {
      log(`Local disk: failed to delete ${file} (${err.message})`);
    }
  }
  log(`Local disk: deleted ${deleted} file(s).`);
  return { found: files.length, deleted, dryRun: false };
}

(async () => {
  log("===================================================");
  log(CONFIRMED ? "MODE: DESTRUCTIVE — will delete data!" : "MODE: dry-run (no data will be deleted)");
  log("Re-run with --confirm (or WIPE_CONFIRM=yes) to actually delete.");
  if (WIPE_USERS) {
    log("FLAG --users: will also delete ALL accounts + feedback rows.");
  }
  log("===================================================");

  let exitCode = 0;
  try {
    const mongoResult = await wipeMongo();
    const accountsResult = await wipeAccounts();
    const cloudResult = await wipeCloudinary();
    const diskResult = await wipeDisk();

    log("---------------------------------------------------");
    log("Summary:");
    log("  MongoDB images:", mongoResult);
    log("  MongoDB accounts:", accountsResult);
    log("  Cloudinary :", cloudResult);
    log("  Local disk :", diskResult);
    if (!CONFIRMED) {
      log("Re-run with --confirm to actually delete the above.");
    } else {
      log("All done. The app is back to a fresh state.");
    }
  } catch (err) {
    console.error("[wipe] FAILED:", err);
    exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
    process.exit(exitCode);
  }
})();
