import { RolePicker } from "@/components/RolePicker";
import { DatabaseUnavailable } from "@/components/DatabaseUnavailable";
import { projectStarted, sprintContextFrom } from "@/lib/content";
import { requireProfile } from "@/lib/session-profile";
import type { RoleId } from "@/lib/roles";

export default async function OnboardingPage() {
  const result = await requireProfile();
  if ("error" in result) return <DatabaseUnavailable message={result.error} />;
  const profile = result.profile;
  const ctx = sprintContextFrom({
    roles: profile.roles as RoleId[],
    scores: profile.scores,
    completedAt: profile.completedAt,
    sprintCount: profile.sprintCount,
    sprintDays: profile.sprintDays,
    currentProject: profile.currentProject,
  });
  return (
    <main className="app-shell">
      <RolePicker
        initialRoles={profile.roles || []}
        sprintCount={profile.sprintCount}
        sprintDays={profile.sprintDays}
        projectConfigured={profile.projectConfigured}
        setupLocked={profile.projectConfigured && projectStarted(ctx)}
      />
    </main>
  );
}
