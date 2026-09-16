import { afterEach, describe, expect, it } from "vitest";
import {
  clampRegisterPosition,
  clearRegisterPosition,
  readRegisterPosition,
  saveRegisterPosition,
} from "./register-position";

afterEach(() => {
  window.sessionStorage.clear();
});

describe("register position memory", () => {
  it("remembers the line the visitor was reading", () => {
    saveRegisterPosition(1840);
    expect(readRegisterPosition()).toBe(1840);
  });

  it("has nothing to remember on a first visit", () => {
    expect(readRegisterPosition()).toBeNull();
  });

  it("ignores records from another schema version", () => {
    window.sessionStorage.setItem(
      "lena-digital-house.register-position",
      JSON.stringify({ v: 99, y: 500, at: Date.now() }),
    );
    expect(readRegisterPosition()).toBeNull();
  });

  it("survives a corrupted record instead of throwing", () => {
    window.sessionStorage.setItem("lena-digital-house.register-position", "{not json");
    expect(readRegisterPosition()).toBeNull();
  });

  it("never stores a negative or fractional position", () => {
    saveRegisterPosition(-120.6);
    expect(readRegisterPosition()).toBe(0);
  });

  it("keeps a remembered position inside the sheet that exists now", () => {
    // The sheet is shorter than the window it was read on: the restore must
    // land on the last readable line, never on empty space.
    expect(clampRegisterPosition(3000, 2200, 800)).toBe(1400);
    expect(clampRegisterPosition(300, 2200, 800)).toBe(300);
    expect(clampRegisterPosition(300, 600, 800)).toBe(0);
  });

  it("forgets on request", () => {
    saveRegisterPosition(900);
    clearRegisterPosition();
    expect(readRegisterPosition()).toBeNull();
  });
});
