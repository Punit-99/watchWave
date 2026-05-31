import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { UserRole } from "../generated/prisma/enums";

export function proxy(req: NextRequest) {
  console.log("🔥 PROXY HIT");

  const token = req.cookies.get("accessToken")?.value;

  const pathname = req.nextUrl.pathname;
  const method = req.method;

  const isProtectedRoute =
    pathname.startsWith("/api/movies") ||
    pathname.startsWith("/api/series") ||
    pathname.startsWith("/api/upload");

  if (!isProtectedRoute) return NextResponse.next();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyAccessToken(token);

    const role = decoded?.role as UserRole;

    // 👤 USER ROLE (READ ONLY)
    if (role === UserRole.USER) {
      if (method !== "GET") {
        return NextResponse.json(
          { message: "Forbidden: Users can only read content" },
          { status: 403 },
        );
      }

      return NextResponse.next();
    }

    // 🛠 ADMIN ROLE (FULL ACCESS)
    if (role === UserRole.ADMIN) {
      return NextResponse.next();
    }

    // 🚫 INVALID ROLE
    return NextResponse.json(
      { message: "Forbidden: Invalid role" },
      { status: 403 },
    );
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
