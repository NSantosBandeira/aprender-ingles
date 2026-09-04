import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/db";
import { unitsForRoles } from "@/lib/content";
import { HomeClient } from "@/components/HomeClient";
import type { RoleId } from "@/lib/roles";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const profile = await getUserByEmail(session.user.email);
  if (!profile) redirect("/login");
  if (!profile.roles.length) redirect("/onboarding");
  const { work, fundamentals } = unitsForRoles(profile.roles as RoleId[]);
  return (
    <main className="app-shell">
      <HomeClient profile={profile} work={work} fundamentals={fundamentals} />
    </main>
  );
}
