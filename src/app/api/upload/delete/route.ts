import { NextResponse } from "next/server";
import cloudinary, { extractPublicId } from "@/lib/cloudinary";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json(
        { message: "publicId required" },
        { status: 400 },
      );
    }

    const actualPublicId = extractPublicId(publicId) || publicId;

    // Deduce resource type (image or video) from URL or extension
    const isVideo =
      publicId.includes("/video/") ||
      publicId.endsWith(".mp4") ||
      publicId.endsWith(".mkv") ||
      publicId.endsWith(".webm") ||
      publicId.endsWith(".mov");

    const resourceType = isVideo ? "video" : "image";

    const result = await cloudinary.uploader.destroy(actualPublicId, {
      resource_type: resourceType,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed", error },
      { status: 500 },
    );
  }
}
