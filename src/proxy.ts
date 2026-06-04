import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function getPayload(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

    const { payload } = await jwtVerify(token, secret);

    return payload;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  console.log("Middleware running for:", req.nextUrl.pathname);
  const token = req.cookies.get("accessToken")?.value;

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");

  const isUserPage =
    pathname === "/" ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/watch");

  // -------------------------
  // NOT LOGGED IN
  // -------------------------
  if (!token) {
    if (isAdminPage || isUserPage) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    return NextResponse.next();
  }

  // -------------------------
  // VERIFY TOKEN
  // -------------------------
  const payload = await getPayload(token);

  if (!payload) {
    const response = NextResponse.redirect(new URL("/auth", req.url));

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  }

  const role = payload.role as string;

  // -------------------------
  // LOGGED IN → BLOCK AUTH
  // -------------------------
  if (isAuthPage) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.redirect(new URL("/", req.url));
  }

  // -------------------------
  // USER → BLOCK ADMIN
  // -------------------------
  if (role === "USER" && isAdminPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // -------------------------
  // ADMIN → BLOCK USER AREA
  // -------------------------
  if (role === "ADMIN" && isUserPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/watch/:path*",
  ],
};
