"use client";

const COLORS = [
  "#8b5cf6",
  "#f472b6",
  "#22d3ee",
  "#fbbf24",
  "#34d399",
  "#fb7185",
  "#a78bfa",
  "#38bdf8",
];

const VIEW = 400;
const R = VIEW / 2;

type Segment = { id: string };

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function segmentPath(index: number, total: number): string {
  const seg = 360 / total;
  const start = index * seg;
  const end = start + seg;
  const p1 = polar(R, R, R, start);
  const p2 = polar(R, R, R, end);
  const largeArc = seg > 180 ? 1 : 0;
  return `M ${R} ${R} L ${p1.x} ${p1.y} A ${R} ${R} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
}

/**
 * Roue de tirage multicolore, sans aucun nom (suspense).
 * Le compteur central reste fixe pendant la rotation.
 * `rotation` (en degres) est anime par le parent ; la transition CSS donne la deceleration.
 */
export default function Wheel({
  segments,
  rotation,
  spinning,
  count,
}: {
  segments: Segment[];
  rotation: number;
  spinning: boolean;
  count: number;
}) {
  const total = Math.max(segments.length, 1);

  return (
    <div className="relative mx-auto aspect-square w-full">
      {/* Halo lumineux derriere la roue */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-2 rounded-full bg-[conic-gradient(from_0deg,#8b5cf6,#f472b6,#22d3ee,#fbbf24,#34d399,#8b5cf6)] opacity-40 blur-2xl ${
          spinning ? "animate-pulse-glow" : ""
        }`}
      />

      {/* Pointeur en haut */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
        style={{
          width: 0,
          height: 0,
          borderLeft: "16px solid transparent",
          borderRight: "16px solid transparent",
          borderTop: "26px solid var(--amber)",
        }}
      />

      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="relative z-10 h-full w-full motion-reduce:!transition-none"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? "transform 3.6s cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
        }}
      >
        {segments.map((s, i) => {
          const seg = 360 / total;
          const mid = i * seg + seg / 2;
          const dot = polar(R, R, R * 0.78, mid);
          return (
            <g key={s.id + i}>
              <path
                d={segmentPath(i, total)}
                fill={COLORS[i % COLORS.length]}
                stroke="var(--background)"
                strokeWidth={3}
              />
              <circle cx={dot.x} cy={dot.y} r={5} fill="rgba(255,255,255,0.85)" />
            </g>
          );
        })}
        <circle cx={R} cy={R} r={4} fill="var(--background)" />
      </svg>

      {/* Compteur central fixe */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <div className="flex aspect-square w-[34%] flex-col items-center justify-center rounded-full border-4 border-white/20 bg-surface/90 text-center shadow-2xl backdrop-blur">
          <span className="text-3xl font-extrabold leading-none gradient-text sm:text-4xl">
            {count}
          </span>
          <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-wider text-muted sm:text-xs">
            {count > 1 ? "activités" : "activité"}
          </span>
        </div>
      </div>
    </div>
  );
}
