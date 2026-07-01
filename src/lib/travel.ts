import {
  Footprints,
  Bike,
  Car,
  TrainFront,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { TravelMode } from "@/db/schema";

export const TRAVEL_MODES: TravelMode[] = ["walk", "bike", "car", "transit"];

export const TRAVEL_MODE_META: Record<TravelMode, { label: string; Icon: LucideIcon }> = {
  walk: { label: "À pied", Icon: Footprints },
  bike: { label: "Vélo", Icon: Bike },
  car: { label: "Voiture", Icon: Car },
  transit: { label: "Transport en commun", Icon: TrainFront },
};

export function travelModeLabel(mode: TravelMode | null): string {
  return mode ? TRAVEL_MODE_META[mode].label : "Peu importe";
}

export function travelModeIcon(mode: TravelMode | null): LucideIcon {
  return mode ? TRAVEL_MODE_META[mode].Icon : Sparkles;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m.toString().padStart(2, "0")}`;
}
