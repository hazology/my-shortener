import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";   // ✅ 상대경로 유지
import { supabase } from "../../../lib/supabaseClient";       // ✅ 클라이언트 SDK도 상대경로
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  const { url, customCode, expiry } = await req.json();

  // ✅ Authorization 헤더에서 토큰 추출
  const authHeader = req.headers.get("authorization");
  let userId = null;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
      console.error("Auth error:", error.message);
    }
    userId = user?.id ?? null;
  }

  // 코드 결정
  const code =
    customCode && customCode.trim() !== ""
      ? customCode
      : uuidv4().slice(0, 6);

  // 만료일 계산
  let expiresAt = null;
  if (expiry === "1d") {
    expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  } else if (expiry === "7d") {
    expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (expiry === "30d") {
    expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  } else if (expiry === "forever") {
    expiresAt = null; // 무제한
  }

  // DB 저장
  const { data, error } = await supabaseAdmin
    .from("urls")
    .insert([{ code, url, expires_at: expiresAt, user_id: userId }]) // ✅ user_id는 여기서 자동 주입
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ code: data.code });
}
