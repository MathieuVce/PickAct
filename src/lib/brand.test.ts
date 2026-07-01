import { describe, it, expect } from "vitest";
import { wheelSlices } from "./brand";

describe("wheelSlices", () => {
  it("génère six secteurs colorés", () => {
    const slices = wheelSlices();
    expect(slices).toHaveLength(6);
    for (const slice of slices) {
      expect(slice.fill).toMatch(/^#[0-9a-f]{6}$/i);
      expect(slice.d.startsWith("M")).toBe(true);
    }
  });

  it("utilise des couleurs distinctes", () => {
    const fills = new Set(wheelSlices().map((s) => s.fill));
    expect(fills.size).toBe(6);
  });
});
