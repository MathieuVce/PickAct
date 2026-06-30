import { wheelSlices } from "@/lib/brand";

/**
 * Roue PickAct en SVG, rendue à la fois par satori (next/og) pour les icônes et
 * images de partage, et utilisable côté React. Repère central + curseur en haut.
 */
export function BrandWheel({ size }: { size: number }) {
  const slices = wheelSlices();
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {slices.map((s, i) => (
        <path key={i} d={s.d} fill={s.fill} />
      ))}
      <circle cx="50" cy="50" r="15" fill="#1f1b45" stroke="#f4f2ff" strokeWidth="3" />
      <path d="M50 1 L58 17 L42 17 Z" fill="#f4f2ff" />
    </svg>
  );
}
