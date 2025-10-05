import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { supabase } from "../../../lib/supabaseClient";

function getExpiresAt(expiry) {
  if (expiry === "forever") return null;
  const days = expiry === "1d" ? 1 : expiry === "30d" ? 30 : 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export async function POST(req) {
  const { url, customCode, expiry } = await req.json();
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  // 요청한 사용자의 세션 토큰으로 유저 조회 (없으면 비회원)
  const authHeader = req.headers.get("Authorization") || "";
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  let userId = null;
  if (accessToken) {
    const sb = supabase; // anon 클라이언트 사용
    const { data: userResp } = await sb.auth.getUser(accessToken);
    userId = userResp?.user?.id ?? null;
  }

  // 비회원이 무제한 요청하면 막기
  if (!userId && expiry === "forever") {
    return NextResponse.json({ error: "무제한은 로그인 후 사용 가능합니다." }, { status: 400 });
  }

  let code = (customCode || "").trim() || Math.random().toString(36).slice(2, 8);

  // 코드 중복 체크
  const { data: exists } = await supabaseAdmin.from("urls").select("code").eq("code", code).maybeSingle();
  if (exists) return NextResponse.json({ error: "이미 사용중인 코드입니다." }, { status: 400 });

  const expires_at = getExpiresAt(expiry || "7d");
  const { error } = await supabaseAdmin.from("urls").insert({
    code, url, user_id: userId, expires_at
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ code });
}
