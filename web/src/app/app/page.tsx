import { redirect } from "next/navigation";
import { HomeClient } from "@/components/HomeClient";
import { DatabaseUnavailable } from "@/components/DatabaseUnavailable";
import { requireProfile } from "@/lib/session-profile";

export default async function AppHomePage() {
  const result = await requireProfile();
  if ("error" in result) return <DatabaseUnavailable message={result.error} />;
  if (!result.profile.roles.length) redirect("/onboarding");
  return (
    <main className="app-shell">
      <HomeClient profile={result.profile} />
    </main>
  );
}
