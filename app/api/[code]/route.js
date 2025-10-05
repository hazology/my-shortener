import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function GET(_req, { params }) {
  const code = params.code;

  const { data: row } = await supabaseAdmin
    .from("urls")
    .select("url, expires_at")
    .eq("code", code)
    .maybeSingle();

  if (!row) return new NextResponse("Not found", { status: 404 });

  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    return new NextResponse("This link has expired.", { status: 410 });
  }

  return NextResponse.redirect(row.url);
}
