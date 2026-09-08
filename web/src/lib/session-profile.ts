import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail, type Profile } from "@/lib/db";
import { describeDbError } from "@/lib/db-error";

export async function requireProfile(): Promise<{ profile: Profile } | { error: string }> {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  try {
    const profile = await getUserByEmail(session.user.email);
    if (!profile) redirect("/login");
    return { profile };
  } catch (error) {
    return { error: describeDbError(error).message };
  }
}
