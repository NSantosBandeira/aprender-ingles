import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/db";
import { RolePicker } from "@/components/RolePicker";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const profile = await getUserByEmail(session.user.email);
  return (
    <main className="app-shell">
      <RolePicker initialRoles={profile?.roles || []} />
    </main>
  );
}
