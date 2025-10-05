import { NextResponse } from "next/server";
import { supabaseAdmin } from "./lib/supabaseAdmin";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // API나 정적 파일은 무시
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 코드 추출 (ex: /ulsan5)
  const code = pathname.slice(1);
  if (!code) return NextResponse.next();

  // Supabase에서 URL 찾기
  const { data, error } = await supabaseAdmin
    .from("urls")
    .select("original_url, expiry")
    .eq("code", code)
    .single();

  if (!data || error) {
    return NextResponse.next(); // 못 찾으면 그냥 404
  }

  // 만료 확인
  if (data.expiry && new Date(data.expiry) < new Date()) {
    return NextResponse.next();
  }

  // 원래 URL로 리다이렉트
  return NextResponse.redirect(data.original_url);
}
