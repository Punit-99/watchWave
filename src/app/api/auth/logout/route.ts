import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/cookies";

export async function POST() {
  clearAuthCookies();

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
