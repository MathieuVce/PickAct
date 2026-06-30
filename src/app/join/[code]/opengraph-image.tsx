import { ImageResponse } from "next/og";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { groups } from "@/db/schema";
import { normalizeCode } from "@/lib/codes";
import { BrandWheel } from "@/components/BrandMark";

export const alt = "Invitation à rejoindre un groupe sur PickAct";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function JoinOpengraphImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = normalizeCode(decodeURIComponent(rawCode));

  const [group] = await db
    .select({ name: groups.name })
    .from(groups)
    .where(eq(groups.inviteCode, code))
    .limit(1);

  const groupName = group?.name ?? "un groupe d'amis";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: 80,
          background:
            "linear-gradient(135deg, #1b1640 0%, #14122b 55%, #2a1648 100%)",
          color: "#f4f2ff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <BrandWheel size={84} />
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 800,
              letterSpacing: -1,
              backgroundImage: "linear-gradient(120deg, #8b5cf6, #f472b6, #22d3ee)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            PickAct
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#b0aada" }}>
          Tu es invité à rejoindre
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            textAlign: "center",
            maxWidth: 1000,
            lineHeight: 1.1,
          }}
        >
          {groupName}
        </div>
      </div>
    ),
    { ...size },
  );
}
