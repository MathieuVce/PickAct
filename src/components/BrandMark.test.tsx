import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrandWheel } from "./BrandMark";

describe("BrandWheel", () => {
  it("rend un SVG à la taille demandée avec ses secteurs", () => {
    const { container } = render(<BrandWheel size={120} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("width", "120");
    // 6 secteurs de la roue + le curseur en haut.
    expect(container.querySelectorAll("path").length).toBe(7);
  });
});
