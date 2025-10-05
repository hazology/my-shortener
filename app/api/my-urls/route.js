import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

export async function GET(req) {
  const authHeader = req.headers.get("Authorization") || "";
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: userResp } = await supabase.auth.getUser(accessToken);
  const userId = userResp?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("urls")
    .select("code, url, created_at, expires_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data || [] });
}
