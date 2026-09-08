import Link from "next/link";
import { redirect } from "next/navigation";
import { homeContent } from "@/lib/content";
import { UnitsGrid } from "@/components/UnitsGrid";
import { DatabaseUnavailable } from "@/components/DatabaseUnavailable";
import { requireProfile } from "@/lib/session-profile";
import type { RoleId } from "@/lib/roles";

export default async function ReviewPage() {
  const result = await requireProfile();
  if ("error" in result) return <DatabaseUnavailable message={result.error} />;
  const profile = result.profile;
  if (!profile.roles.length) redirect("/onboarding");
  const { review } = homeContent(profile.roles as RoleId[], profile.scores || {}, profile.completedAt || {});

  return (
    <main className="app-shell">
      <Link className="back" href="/app">
        ← Meu dia
      </Link>
      <p className="eyebrow">Revisão</p>
      <h1>Cenas que você já concluiu.</h1>
      <p className="lead">Refaça fala ou escrita quando quiser. O progresso da jornada continua no Meu dia.</p>
      <UnitsGrid units={review} scores={profile.scores || {}} completed empty="Você ainda não concluiu nenhuma cena." />
    </main>
  );
}
