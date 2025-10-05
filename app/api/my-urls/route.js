import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { supabase } from "../../../lib/supabaseClient";

export async function GET(req) {
  // ✅ Authorization 헤더에서 토큰 꺼내기
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // ✅ 로그인한 사용자의 URL만 가져오기
  const { data, error: dbError } = await supabaseAdmin
    .from("urls")
    .select("*")
    .eq("user_id", user.id)  // 여기서 user_id로 필터링
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 400 });
  }

  return NextResponse.json({ urls: data });
}
