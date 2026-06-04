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
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");

  const isUserPage =
    pathname === "/" ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/watch");

  // -------------------------
  // NO TOKENS AT ALL
  // -------------------------
  if (!accessToken && !refreshToken) {
    if (isAdminPage || isUserPage) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    return NextResponse.next();
  }

  // -------------------------
  // ACCESS TOKEN EXISTS
  // -------------------------
  if (accessToken) {
    const payload = await getPayload(accessToken);

    if (payload) {
      const role = payload.role as string;

      if (isAuthPage) {
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        return NextResponse.redirect(new URL("/", req.url));
      }

      if (role === "USER" && isAdminPage) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (role === "ADMIN" && isUserPage) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      return NextResponse.next();
    }
  }

  // -------------------------
  // ACCESS INVALID BUT REFRESH EXISTS
  // LET CLIENT REFRESH
  // -------------------------
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
