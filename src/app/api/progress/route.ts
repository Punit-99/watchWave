import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

// Helper to get authenticated user ID
async function getUserId() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return null;
    const payload = verifyAccessToken(token);
    return payload?.userId || null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: true, data: [] }); // Return empty array if not logged in
    }

    const progress = await prisma.watchProgress.findMany({
      where: { userId },
      include: {
        content: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch progress" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { contentId, episodeId, watchedTime, duration } = body;

    if (!contentId || watchedTime === undefined || duration === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // If remaining time is less than or equal to 30 seconds, or 95% complete, remove it
    const isCompleted =
      duration - watchedTime <= 30 ||
      (duration > 0 && watchedTime / duration > 0.95);

    if (isCompleted) {
      // Delete watch progress if it exists
      try {
        await prisma.watchProgress.delete({
          where: {
            userId_contentId: {
              userId,
              contentId,
            },
          },
        });
      } catch {
        // Ignore error if it didn't exist in the first place
      }

      return NextResponse.json({
        success: true,
        message: "Completed and removed from watch progress",
        deleted: true,
      });
    }

    // Upsert watch progress
    const progress = await prisma.watchProgress.upsert({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
      update: {
        episodeId,
        watchedTime: Math.floor(watchedTime),
        duration: Math.floor(duration),
      },
      create: {
        userId,
        contentId,
        episodeId,
        watchedTime: Math.floor(watchedTime),
        duration: Math.floor(duration),
      },
    });

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to save progress" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get("contentId");

    if (!contentId) {
      return NextResponse.json(
        { success: false, message: "Missing contentId" },
        { status: 400 },
      );
    }

    await prisma.watchProgress.delete({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Removed from watch progress",
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete progress" },
      { status: 500 },
    );
  }
}
