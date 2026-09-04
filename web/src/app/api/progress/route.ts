import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveScore } from "@/lib/db";
import { itemKey } from "@/lib/content";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const body = await request.json();
  const { unitId, mode, index, stars } = body as {
    unitId: string;
    mode: string;
    index: number;
    stars: number;
  };
  const profile = await saveScore(session.user.email, itemKey(unitId, mode, index), Number(stars) || 0, unitId, mode);
  return NextResponse.json(profile);
}
