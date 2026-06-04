// app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken,
      },
    });
  }

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set("accessToken", "", {
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("refreshToken", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}
