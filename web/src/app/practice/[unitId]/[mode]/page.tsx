import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/db";
import { unitById } from "@/lib/content";
import { PracticeClient } from "@/components/PracticeClient";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ unitId: string; mode: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const { unitId, mode } = await params;
  if (mode !== "speak" && mode !== "write") notFound();
  const unit = unitById(unitId);
  if (!unit) notFound();
  const profile = await getUserByEmail(session.user.email);
  return (
    <main className="app-shell">
      <PracticeClient unit={unit} mode={mode} voiceRate={profile?.voiceRate || "very-slow"} />
    </main>
  );
}
