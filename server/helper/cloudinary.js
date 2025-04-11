import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SK,
});

const storage = new multer.memoryStorage();

const upload = multer({ storage });

async function cloudinaryUpload(file, type = "auto") {
  if (!file.buffer) {
    throw new Error("❌ File buffer is missing");
  }

  try {
    const base64String = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    if (type === "video" || type === "subtitle") {
      const resourceType = type === "subtitle" ? "raw" : "video";

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: resourceType },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });

      return result;
    }

    // Default to image
    const result = await cloudinary.uploader.upload(base64String, {
      resource_type: "image",
    });

    return result;
  } catch (error) {
    console.error(`❌ Upload failed for ${type}:`, error);
    throw error;
  }
}

export { upload, cloudinaryUpload };
