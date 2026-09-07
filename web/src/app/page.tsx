import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/db";
import { HomeClient } from "@/components/HomeClient";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const profile = await getUserByEmail(session.user.email);
  if (!profile) redirect("/login");
  if (!profile.roles.length) redirect("/onboarding");
  return (
    <main className="app-shell">
      <HomeClient profile={profile} />
    </main>
  );
}
