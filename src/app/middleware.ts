import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  const isProtected =
    req.nextUrl.pathname.startsWith("/api/movies") ||
    req.nextUrl.pathname.startsWith("/api/series") ||
    req.nextUrl.pathname.startsWith("/api/upload");

  if (!isProtected) return NextResponse.next();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    verifyAccessToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/movies/:path*", "/api/series/:path*", "/api/upload/:path*"],
};
