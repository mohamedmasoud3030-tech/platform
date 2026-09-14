import { describe, expect, it } from "vitest";
import { spokenText, voiceLanguage } from "./voice";

describe("assistant browser voice bridge", () => {
  it("selects a browser speech language for both supported locales", () => {
    expect(voiceLanguage("ar")).toBe("ar");
    expect(voiceLanguage("en")).toBe("en");
  });

  it("keeps URLs and control whitespace out of spoken answers", () => {
    expect(spokenText("Open https://example.com\nthen continue."))
      .toBe("Open then continue.");
  });
});
