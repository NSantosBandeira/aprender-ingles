import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/db";
import { homeContent } from "@/lib/content";
import { UnitsGrid } from "@/components/UnitsGrid";
import type { RoleId } from "@/lib/roles";

export default async function ReviewPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const profile = await getUserByEmail(session.user.email);
  if (!profile) redirect("/login");
  if (!profile.roles.length) redirect("/onboarding");
  const { review } = homeContent(profile.roles as RoleId[], profile.scores || {}, profile.completedAt || {});

  return (
    <main className="app-shell">
      <Link className="back" href="/">
        ← Meu dia
      </Link>
      <p className="eyebrow">Revisão</p>
      <h1>Cenas que você já concluiu.</h1>
      <p className="lead">Refaça fala ou escrita quando quiser. O progresso da jornada continua no Meu dia.</p>
      <UnitsGrid units={review} scores={profile.scores || {}} completed empty="Você ainda não concluiu nenhuma cena." />
    </main>
  );
}
