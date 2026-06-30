"use client";

import confetti from "canvas-confetti";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const COLORS = [
  "#8b5cf6",
  "#f472b6",
  "#22d3ee",
  "#fbbf24",
  "#34d399",
  "#fb7185",
];

/** Eclat de confettis multicolore, désactivé si l'utilisateur préfère moins d'animations. */
export function celebrate(): void {
  if (prefersReducedMotion()) return;
  confetti({
    particleCount: 120,
    spread: 80,
    startVelocity: 45,
    origin: { y: 0.55 },
    colors: COLORS,
    disableForReducedMotion: true,
  });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
  }, 180);
}
