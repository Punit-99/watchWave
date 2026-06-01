import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

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

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image", // default safe
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
