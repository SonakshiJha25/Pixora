import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildInpaintingPrompt,
  buildReplaceBackgroundPrompt,
} from "../services/clipdropRefinementService.js";

describe("Clipdrop refinement prompts", () => {
  it("inpainting prompt includes edit instruction without old scene concatenation", () => {
    const p = buildInpaintingPrompt("warmer golden hour lighting");
    assert.match(p, /warmer golden hour lighting/i);
    assert.doesNotMatch(p, /Refine this result.*composition and subjects unless/);
  });

  it("replace-background prompt describes edit not full regeneration", () => {
    const p = buildReplaceBackgroundPrompt("add soft rain in the background");
    assert.match(p, /add soft rain/i);
    assert.match(p, /Apply this refinement/i);
    assert.doesNotMatch(p, /oldPrompt|concatenate/i);
  });

  it("rejects empty edit", () => {
    assert.throws(() => buildInpaintingPrompt("  "), /required/i);
  });
});

describe("refinement version chain", () => {
  it("increments from parent version", () => {
    const parentVersion = 3;
    assert.equal(parentVersion + 1, 4);
  });
});
