import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshService } from "@/services/auth/auth.service";

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

    const response = NextResponse.json({
      success: true,
      message: "Token refreshed",
    });

    response.cookies.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 },
    );
  }
}
