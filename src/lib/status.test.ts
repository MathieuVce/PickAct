import { describe, it, expect } from "vitest";
import { STATUS_COLOR, STATUS_LABEL } from "./status";

const STATUSES = ["active", "validated", "skipped", "later"] as const;

describe("status maps", () => {
  it("couvre les quatre statuts pour les libellés et couleurs", () => {
    for (const status of STATUSES) {
      expect(STATUS_LABEL[status]).toBeTruthy();
      expect(STATUS_COLOR[status]).toMatch(/^var\(--[a-z]+\)$/);
    }
  });

  it("associe En jeu au cyan et Validée au vert", () => {
    expect(STATUS_COLOR.active).toBe("var(--cyan)");
    expect(STATUS_COLOR.validated).toBe("var(--green)");
    expect(STATUS_LABEL.active).toBe("En jeu");
  });
});
