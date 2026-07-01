import { describe, it, expect } from "vitest";
import { safeUrl } from "./url";

describe("safeUrl", () => {
  it("accepte les URL http et https", () => {
    expect(safeUrl("https://exemple.fr/page")).toBe("https://exemple.fr/page");
    expect(safeUrl("http://exemple.fr")).toBe("http://exemple.fr/");
  });

  it("rejette les schémas dangereux", () => {
    expect(safeUrl("javascript:alert(1)")).toBeNull();
    expect(safeUrl("data:text/html,<script>")).toBeNull();
    expect(safeUrl("file:///etc/passwd")).toBeNull();
  });

  it("rejette les valeurs vides ou invalides", () => {
    expect(safeUrl(null)).toBeNull();
    expect(safeUrl(undefined)).toBeNull();
    expect(safeUrl("   ")).toBeNull();
    expect(safeUrl("pas une url")).toBeNull();
  });

  it("retire les espaces autour", () => {
    expect(safeUrl("  https://exemple.fr  ")).toBe("https://exemple.fr/");
  });
});
