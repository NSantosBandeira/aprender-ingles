import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserByEmail, updateRoles, updateVoiceRate } from "@/lib/db";
import { ALL_ROLES, type RoleId } from "@/lib/roles";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const profile = await getUserByEmail(session.user.email);
  return NextResponse.json(profile);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const body = await request.json();
  if (Array.isArray(body.roles)) {
    const roles = body.roles.filter((role: string) => ALL_ROLES.includes(role as RoleId));
    const profile = await updateRoles(session.user.email, roles);
    return NextResponse.json(profile);
  }
  if (typeof body.voiceRate === "string") {
    const profile = await updateVoiceRate(session.user.email, body.voiceRate);
    return NextResponse.json(profile);
  }
  return NextResponse.json({ error: "invalid" }, { status: 400 });
}
