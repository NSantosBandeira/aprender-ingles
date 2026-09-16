import Link from "next/link";
import { redirect } from "next/navigation";
import { homeContent, sprintContextFrom } from "@/lib/content";
import { UnitsGrid } from "@/components/UnitsGrid";
import { DatabaseUnavailable } from "@/components/DatabaseUnavailable";
import { requireProfile } from "@/lib/session-profile";
import type { RoleId } from "@/lib/roles";

export default async function ReviewPage() {
  const result = await requireProfile();
  if ("error" in result) return <DatabaseUnavailable message={result.error} />;
  const profile = result.profile;
  if (!profile.roles.length || !profile.projectConfigured) redirect("/onboarding");
  const { review } = homeContent(
    sprintContextFrom({
      roles: profile.roles as RoleId[],
      scores: profile.scores,
      completedAt: profile.completedAt,
      sprintCount: profile.sprintCount,
      sprintDays: profile.sprintDays,
      currentProject: profile.currentProject,
    })
  );

  return (
    <main className="app-shell">
      <Link className="back" href="/app">
        ← Meu dia
      </Link>
      <p className="eyebrow">Revisão</p>
      <h1>Cenas que você já concluiu.</h1>
      <p className="lead">Refaça fala ou escrita quando quiser. O progresso da sprint continua no Meu dia.</p>
      <UnitsGrid units={review} scores={profile.scores || {}} completed empty="Você ainda não concluiu nenhuma cena." />
    </main>
  );
}
