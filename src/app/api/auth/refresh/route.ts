import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshService } from "@/services/auth/auth.service";
import { setAuthCookies } from "@/lib/cookies";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "No refresh token" },
        { status: 401 },
      );
    }

    const result = await refreshService(refreshToken);

    // reuse old refresh token
    setAuthCookies(result.accessToken, refreshToken);

    return NextResponse.json({
      success: true,
      message: "Token refreshed",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 },
    );
  }
}
