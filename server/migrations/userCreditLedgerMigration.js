import User from "../models/User.js";
import { logInfo } from "../utils/logger.js";
import { snapCreditsToLedger, getNextIstMidnightUtcMs } from "../services/dailyCreditsService.js";

let ran = false;

/**
 * One-time normalization: ledger credits, migrate nextCreditResetAt → dailyCreditResetAt,
 * and remove deprecated user fields.
 */
export async function runUserCreditLedgerMigrationOnce() {
  if (ran) return;
  ran = true;

  const now = Date.now();
  let n = 0;

  for await (const doc of User.find().lean().cursor()) {
    const credits = snapCreditsToLedger(doc.credits ?? 0);

    let nextAt =
      doc.nextCreditResetAt != null
        ? new Date(doc.nextCreditResetAt)
        : doc.dailyCreditResetAt != null
          ? new Date(doc.dailyCreditResetAt)
          : null;
    if (!nextAt || Number.isNaN(nextAt.getTime())) {
      nextAt = new Date(getNextIstMidnightUtcMs(now));
    }

    await User.collection.updateOne(
      { _id: doc._id },
      {
        $set: { credits, dailyCreditResetAt: nextAt },
        $unset: {
          creditBalance: "",
          lastCreditResetDate: "",
          picture: "",
          nextCreditResetAt: "",
        },
      }
    );
    n += 1;
  }

  logInfo(
    `DB migration: normalized ${n} users (credit ledger + dailyCreditResetAt, legacy fields unset)`
  );
}
