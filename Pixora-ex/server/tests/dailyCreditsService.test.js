import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CREDITS_PER_IMAGE,
  DAILY_CREDITS,
  evaluateIstDailyCreditReset,
  getIstDateString,
  getNextIstMidnightUtcMs,
  snapCreditsToLedger,
} from "../services/dailyCreditsService.js";
import { GENERATION_COST } from "../utils/resetCreditsIfNewDay.js";

describe("snapCreditsToLedger", () => {
  it("allows only 0,10,...,100", () => {
    assert.equal(snapCreditsToLedger(100), 100);
    assert.equal(snapCreditsToLedger(95), 90);
    assert.equal(snapCreditsToLedger(8), 0);
    assert.equal(snapCreditsToLedger(73), 70);
    assert.equal(snapCreditsToLedger(-5), 0);
    assert.equal(snapCreditsToLedger(150), 100);
    assert.equal(snapCreditsToLedger("40"), 40);
  });
});

describe("getIstDateString", () => {
  it("uses IST calendar day not UTC", () => {
    const beforeMidnight = Date.UTC(2026, 4, 15, 18, 29, 0);
    assert.equal(getIstDateString(beforeMidnight), "2026-05-15");
    const atMidnight = Date.UTC(2026, 4, 15, 18, 30, 0);
    assert.equal(getIstDateString(atMidnight), "2026-05-16");
  });
});

describe("evaluateIstDailyCreditReset", () => {
  const todayMs = Date.UTC(2026, 4, 16, 10, 0, 0);
  const todayIst = "2026-05-16";
  const yesterdayIst = "2026-05-15";

  it("same day: keeps balance, no refill", () => {
    const r = evaluateIstDailyCreditReset(50, todayIst, todayMs);
    assert.equal(r.didReset, false);
    assert.equal(r.credits, 50);
    assert.equal(r.lastCreditResetDate, todayIst);
  });

  it("new IST day: refills to 100", () => {
    const r = evaluateIstDailyCreditReset(30, yesterdayIst, todayMs);
    assert.equal(r.didReset, true);
    assert.equal(r.credits, DAILY_CREDITS);
    assert.equal(r.creditsBefore, 30);
    assert.equal(r.lastCreditResetDate, todayIst);
  });

  it("missing stored date: refills to 100 and stamps today", () => {
    const r = evaluateIstDailyCreditReset(40, null, todayMs);
    assert.equal(r.initialized, true);
    assert.equal(r.didReset, true);
    assert.equal(r.credits, DAILY_CREDITS);
    assert.equal(r.lastCreditResetDate, todayIst);
  });

  it("snaps corrupt balance before compare on same day", () => {
    const r = evaluateIstDailyCreditReset(87, todayIst, todayMs);
    assert.equal(r.credits, 80);
    assert.equal(r.didReset, false);
  });

  it("zero credits same day stays zero", () => {
    const r = evaluateIstDailyCreditReset(0, todayIst, todayMs);
    assert.equal(r.credits, 0);
    assert.equal(r.didReset, false);
  });

  it("zero credits after midnight refills", () => {
    const r = evaluateIstDailyCreditReset(0, yesterdayIst, todayMs);
    assert.equal(r.credits, 100);
    assert.equal(r.didReset, true);
  });
});

describe("deduction ledger steps", () => {
  it("ten generations from 100 land on 0", () => {
    let bal = DAILY_CREDITS;
    for (let i = 0; i < 10; i += 1) {
      bal = snapCreditsToLedger(bal - CREDITS_PER_IMAGE);
    }
    assert.equal(bal, 0);
  });

  it("eleventh deduction would fail guard", () => {
    assert.ok(snapCreditsToLedger(0) < CREDITS_PER_IMAGE);
  });
});

describe("getNextIstMidnightUtcMs", () => {
  it("next midnight is after now", () => {
    const now = Date.UTC(2026, 4, 16, 10, 0, 0);
    const next = getNextIstMidnightUtcMs(now);
    assert.ok(next > now);
    assert.equal(getIstDateString(next), "2026-05-17");
  });
});

describe("resetCreditsIfNewDay helper", () => {
  it("GENERATION_COST matches CREDITS_PER_IMAGE", () => {
    assert.equal(GENERATION_COST, CREDITS_PER_IMAGE);
    assert.equal(GENERATION_COST, 10);
  });
});
