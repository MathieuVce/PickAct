import { describe, it, expect } from "vitest";
import { MIN_PASSWORD_LENGTH, hashPassword, verifyPassword } from "./password";

describe("hashPassword / verifyPassword", () => {
  it("valide le bon mot de passe", () => {
    const stored = hashPassword("motdepasse");
    expect(verifyPassword("motdepasse", stored)).toBe(true);
  });

  it("rejette un mauvais mot de passe", () => {
    const stored = hashPassword("motdepasse");
    expect(verifyPassword("mauvais", stored)).toBe(false);
  });

  it("produit un format scrypt$salt$hash avec un sel aléatoire", () => {
    const a = hashPassword("secret");
    const b = hashPassword("secret");
    expect(a).toMatch(/^scrypt\$[0-9a-f]+\$[0-9a-f]+$/);
    expect(a).not.toBe(b);
  });

  it("rejette une valeur stockée mal formée", () => {
    expect(verifyPassword("x", "pas-valide")).toBe(false);
    expect(verifyPassword("x", "bcrypt$sel$hash")).toBe(false);
  });

  it("expose une longueur minimale positive", () => {
    expect(MIN_PASSWORD_LENGTH).toBeGreaterThan(0);
  });
});
