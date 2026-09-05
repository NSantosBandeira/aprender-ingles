import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data-source";

export async function GET() {
  try {
    const ds = await getDataSource();
    const rows = (await ds.query("select count(*)::int as n from users")) as { n: number }[];
    return NextResponse.json({ ok: true, users: rows[0]?.n ?? 0 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "falha no banco" },
      { status: 500 }
    );
  }
}
