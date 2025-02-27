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

async function imageUploadUtil(file) {
  if (!file.buffer) {
    throw new Error("❌ File buffer is missing");
  }

  console.log("📤 Uploading image...");

  try {
    const base64String = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(base64String, {
      resource_type: "image",
    });

    console.log("✅ Image upload successful:", result);
    return result;
  } catch (error) {
    console.error("❌ Image upload failed:", error);
    throw error;
  }
}

async function videoUploadUtil(file) {
  if (!file.buffer) {
    throw new Error("❌ File buffer is missing");
  }

  console.log("📤 Uploading video...");

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "video" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(file.buffer);
    });

    console.log("✅ Video upload successful:", result);
    return result;
  } catch (error) {
    console.error("❌ Video upload failed:", error);
    throw error;
  }
}

export { upload, videoUploadUtil, imageUploadUtil };
