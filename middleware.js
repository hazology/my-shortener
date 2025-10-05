import { NextResponse } from "next/server";
import { supabaseAdmin } from "./lib/supabaseAdmin";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // API, 정적 리소스 제외
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  const code = pathname.slice(1); // /ulsan5 → ulsan5
  const { data } = await supabaseAdmin
    .from("urls")
    .select("url, expires_at")
    .eq("code", code)
    .single();

  if (data && (!data.expires_at || new Date(data.expires_at) > new Date())) {
    return NextResponse.redirect(data.url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
