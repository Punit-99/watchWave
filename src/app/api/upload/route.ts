import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "watchwave",
          resource_type: "auto", // image | video auto detect
        },
        (error, result) => {
          if (error || !result) {
            return resolve(
              NextResponse.json(
                { message: "Upload failed", error },
                { status: 500 },
              ),
            );
          }

          return resolve(
            NextResponse.json({
              url: result.secure_url,
              publicId: result.public_id,
            }),
          );
        },
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 },
    );
  }
}
