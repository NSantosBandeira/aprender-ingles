import { notFound } from "next/navigation";
import { unitById } from "@/lib/content";
import type { RoleId } from "@/lib/roles";
import { PracticeClient } from "@/components/PracticeClient";
import { DatabaseUnavailable } from "@/components/DatabaseUnavailable";
import { requireProfile } from "@/lib/session-profile";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ unitId: string; mode: string }>;
}) {
  const result = await requireProfile();
  if ("error" in result) return <DatabaseUnavailable message={result.error} />;
  const { unitId, mode } = await params;
  if (mode !== "speak" && mode !== "write") notFound();
  const unit = unitById(unitId);
  if (!unit) notFound();
  const profile = result.profile;
  return (
    <main className="app-shell">
      <PracticeClient
        unit={unit}
        mode={mode}
        voiceRate={profile.voiceRate || "very-slow"}
        scores={profile.scores || {}}
        roles={(profile.roles || []) as RoleId[]}
        completedAt={profile.completedAt || {}}
      />
    </main>
  );
}
