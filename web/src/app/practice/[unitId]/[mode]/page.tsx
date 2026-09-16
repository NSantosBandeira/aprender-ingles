import { notFound, redirect } from "next/navigation";
import { isUnitLocked, sprintContextFrom, unitById } from "@/lib/content";
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
  if (!profile.roles.length || !profile.projectConfigured) redirect("/onboarding");
  const ctx = sprintContextFrom({
    roles: profile.roles as RoleId[],
    scores: profile.scores,
    completedAt: profile.completedAt,
    sprintCount: profile.sprintCount,
    sprintDays: profile.sprintDays,
    currentProject: profile.currentProject,
  });
  if (isUnitLocked(unit, ctx)) redirect("/app");
  return (
    <main className="app-shell">
      <PracticeClient
        unit={unit}
        mode={mode}
        voiceRate={profile.voiceRate || "very-slow"}
        scores={profile.scores || {}}
        roles={(profile.roles || []) as RoleId[]}
        completedAt={profile.completedAt || {}}
        sprintCount={profile.sprintCount}
        sprintDays={profile.sprintDays}
        currentProject={profile.currentProject}
      />
    </main>
  );
}
