import { describe, expect, it } from "vitest";
import { localAssistantReply } from "./local-answer";

describe("local assistant knowledge fallback", () => {
  it("answers a product question from the expanded verified corpus", () => {
    const result = localAssistantReply("ما الذي يديره نظام MALEK؟", "ar");

    expect(result.sources[0]?.id).toBe("malek-system");
    expect(result.answer).toContain("العقارات والوحدات والعقود");
    expect(result.answer).toContain("طلبات الصيانة");
    expect(result.answer).not.toContain("Lara Beauty");
  });

  it("does not turn an unrelated question into a fabricated answer", () => {
    const result = localAssistantReply("ما رأيكم في الطقس اليوم؟", "ar");

    expect(result.sources).toHaveLength(0);
    expect(result.answer).toContain("لم أجد إجابة موثقة");
  });
});
