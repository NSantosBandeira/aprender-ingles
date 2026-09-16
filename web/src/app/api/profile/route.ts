import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserByEmail, updateProjectSetup, updateRoles, updateVoiceRate } from "@/lib/db";
import { projectStarted, sprintContextFrom } from "@/lib/content";
import { clampDays, clampSprints } from "@/lib/projects";
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
  if (typeof body.voiceRate === "string") {
    const profile = await updateVoiceRate(session.user.email, body.voiceRate);
    return NextResponse.json(profile);
  }

  let profile = await getUserByEmail(session.user.email);
  if (!profile) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (Array.isArray(body.roles)) {
    const roles = body.roles.filter((role: string) => ALL_ROLES.includes(role as RoleId));
    if (!roles.length) return NextResponse.json({ error: "invalid" }, { status: 400 });
    profile = (await updateRoles(session.user.email, roles)) || profile;
  }

  if (body.sprintCount != null || body.sprintDays != null) {
    const ctx = sprintContextFrom(profile);
    const started = projectStarted(ctx);
    if (profile.projectConfigured && started) {
      return NextResponse.json({ error: "setup_locked" }, { status: 409 });
    }
    const sprintCount = clampSprints(body.sprintCount ?? profile.sprintCount);
    const sprintDays = clampDays(body.sprintDays ?? profile.sprintDays);
    const project = Number(body.project) || profile.currentProject;
    profile = (await updateProjectSetup(session.user.email, sprintCount, sprintDays, project)) || profile;
  }

  if (Array.isArray(body.roles) || body.sprintCount != null || body.sprintDays != null) {
    return NextResponse.json(profile);
  }

  return NextResponse.json({ error: "invalid" }, { status: 400 });
}
