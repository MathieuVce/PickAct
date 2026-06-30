/**
 * Géométrie de la roue PickAct, partagée par l'icône du site et les images de
 * partage. Chaque part est un secteur coloré reprenant la palette du thème.
 */
const WHEEL_COLORS = [
  "#8b5cf6", // primary
  "#f472b6", // accent
  "#22d3ee", // cyan
  "#fbbf24", // amber
  "#34d399", // green
  "#7c3aed", // primary strong
];

export type WheelSlice = { fill: string; d: string };

export function wheelSlices(cx = 50, cy = 50, r = 46): WheelSlice[] {
  const n = WHEEL_COLORS.length;
  const step = (2 * Math.PI) / n;

  return WHEEL_COLORS.map((fill, i) => {
    const a0 = -Math.PI / 2 + i * step;
    const a1 = a0 + step;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    return {
      fill,
      d: `M${cx} ${cy} L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`,
    };
  });
}
