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
    // 2026-05-15 18:29 UTC → still 2026-05-15 IST
    const beforeMidnight = Date.UTC(2026, 4, 15, 18, 29, 0);
    assert.equal(getIstDateString(beforeMidnight), "2026-05-15");
    // 2026-05-15 18:30 UTC → 2026-05-16 00:00 IST
    const atMidnight = Date.UTC(2026, 4, 15, 18, 30, 0);
    assert.equal(getIstDateString(atMidnight), "2026-05-16");
  });
});

describe("evaluateIstDailyCreditReset", () => {
  const todayMs = Date.UTC(2026, 4, 16, 10, 0, 0); // midday UTC on IST May 16
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

  it("missing stored date: initializes without stealing credits mid-day", () => {
    const r = evaluateIstDailyCreditReset(40, null, todayMs);
    assert.equal(r.initialized, true);
    assert.equal(r.didReset, false);
    assert.equal(r.credits, 40);
    assert.equal(r.lastCreditResetDate, todayIst);
  });

  it("snaps corrupt balance before compare", () => {
    const r = evaluateIstDailyCreditReset(87, todayIst, todayMs);
    assert.equal(r.credits, 80);
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
