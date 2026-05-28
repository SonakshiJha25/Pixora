import Image from "../models/Image.js";
import { logInfo } from "../utils/logger.js";

let ran = false;

/** Ensure every image has version >= 1 (legacy rows default to 1). */
export async function runImageVersionMigrationOnce() {
  if (ran) return;
  ran = true;

  const res = await Image.updateMany(
    { $or: [{ version: { $exists: false } }, { version: null }, { version: { $lt: 1 } }] },
    { $set: { version: 1 } }
  );

  if (res.modifiedCount > 0) {
    logInfo(`DB migration: set version=1 on ${res.modifiedCount} legacy images`);
  }
}
