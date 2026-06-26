import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function extractPublicId(url: string | null | undefined): string | null {
  if (!url) return null;
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;

  let path = parts[1];

  // Remove version prefix if present, e.g. "v12345678/"
  path = path.replace(/^v\d+\//, "");

  // Strip the file extension
  const lastDotIndex = path.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    path = path.substring(0, lastDotIndex);
  }

  return path;
}

export async function deleteFromCloudinary(
  url: string | null | undefined,
  resourceType: "image" | "video" = "image",
): Promise<any> {
  const publicId = extractPublicId(url);
  if (!publicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error(`Failed to delete asset from Cloudinary: ${url}`, error);
    return null;
  }
}

export default cloudinary;