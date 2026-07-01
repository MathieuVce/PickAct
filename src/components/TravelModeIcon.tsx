import { Sparkles } from "lucide-react";
import type { TravelMode } from "@/db/schema";
import { TRAVEL_MODE_META } from "@/lib/travel";

/** Icône du mode de transport (ou Sparkles quand le mode est indéterminé). */
export default function TravelModeIcon({
  mode,
  className,
}: {
  mode: TravelMode | null;
  className?: string;
}) {
  const Icon = mode ? TRAVEL_MODE_META[mode].Icon : Sparkles;
  return <Icon className={className} />;
}
