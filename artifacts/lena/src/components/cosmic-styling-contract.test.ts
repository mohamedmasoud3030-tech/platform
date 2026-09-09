import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/styles/cosmic-backdrop.css"), "utf8");

/**
 * The frosted glass is scoped with a DESCENDANT :has() — the shells render
 * the sky beside <main> while pages nest it deeper, so a child combinator
 * (`:has(> .cosmic)`) silently matches nothing and no glass ever applies.
 * That exact regression happened once; this contract forbids it.
 */
describe("cosmic styling contract (glass scoping)", () => {
  it("scopes every root with a descendant :has(), never a child combinator", () => {
    for (const scope of [
      ".lena-public:has(.cosmic)",
      ".lena-admin:has(.cosmic)",
      ".lena-login:has(.cosmic)",
    ]) {
      expect(css, `missing scope ${scope}`).toContain(scope);
    }
    expect(css, "child-combinator :has() matches nothing").not.toContain(":has(>");
  });

  it("covers the dashboard tooling panels in both platform themes", () => {
    for (const selector of [
      ".dashboard-panel",
      ".dashboard-record",
      ".dashboard-form",
      ".bento-card",
      ".dark .lena-admin:has(.cosmic)",
    ]) {
      expect(css, `missing ${selector}`).toContain(selector);
    }
  });
});
