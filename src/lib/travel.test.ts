import { describe, it, expect } from "vitest";
import { TRAVEL_MODES, formatDuration, travelModeIcon, travelModeLabel } from "./travel";

describe("formatDuration", () => {
  it("affiche les minutes sous une heure", () => {
    expect(formatDuration(0)).toBe("0 min");
    expect(formatDuration(45)).toBe("45 min");
  });

  it("affiche les heures pleines sans minutes", () => {
    expect(formatDuration(60)).toBe("1 h");
    expect(formatDuration(120)).toBe("2 h");
  });

  it("affiche heures et minutes avec zéro de gauche", () => {
    expect(formatDuration(65)).toBe("1 h 05");
    expect(formatDuration(150)).toBe("2 h 30");
  });
});

describe("travelModeLabel", () => {
  it("renvoie un libellé pour chaque mode connu", () => {
    for (const mode of TRAVEL_MODES) {
      expect(travelModeLabel(mode)).toBeTruthy();
    }
  });

  it("renvoie « Peu importe » quand le mode est nul", () => {
    expect(travelModeLabel(null)).toBe("Peu importe");
  });
});

describe("travelModeIcon", () => {
  it("renvoie toujours un composant d'icône", () => {
    expect(travelModeIcon("walk")).toBeTypeOf("object");
    expect(travelModeIcon(null)).toBeTypeOf("object");
  });
});
