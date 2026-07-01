import { describe, it, expect } from "vitest";
import { generateInviteCode, generateSessionToken, normalizeCode } from "./codes";

describe("generateInviteCode", () => {
  it("commence par PICK suivi de 4 caractères", () => {
    const code = generateInviteCode();
    expect(code).toMatch(/^PICK[A-Z2-9]{4}$/);
  });

  it("n'utilise pas de caractères ambigus (I, O, 0, 1) ni de tiret dans le suffixe", () => {
    for (let i = 0; i < 50; i++) {
      const suffix = generateInviteCode().slice(4);
      expect(suffix).not.toMatch(/[IO01-]/);
    }
  });

  it("produit des codes variés", () => {
    const codes = new Set(Array.from({ length: 30 }, generateInviteCode));
    expect(codes.size).toBeGreaterThan(1);
  });
});

describe("generateSessionToken", () => {
  it("génère des jetons uniques et longs", () => {
    const a = generateSessionToken();
    const b = generateSessionToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(32);
  });
});

describe("normalizeCode", () => {
  it("met en majuscules et retire les espaces", () => {
    expect(normalizeCode("  pick 4f2a ")).toBe("PICK4F2A");
  });

  it("laisse un code déjà normalisé intact", () => {
    expect(normalizeCode("PICK4F2A")).toBe("PICK4F2A");
  });
});
