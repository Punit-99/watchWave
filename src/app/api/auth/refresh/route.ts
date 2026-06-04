// app/api/auth/refresh/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { verifyRefreshToken, generateAccessToken } from "@/lib/jwt";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      throw new Error();
    }

    const payload = verifyRefreshToken(refreshToken);

    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
      },
    });

    if (!storedToken) {
      throw new Error();
    }

    const accessToken = generateAccessToken(payload.userId, payload.role);

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 401,
      },
    );
  }
}
