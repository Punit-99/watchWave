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

const upload = multer({ storage }); // ✅ Store file on disk before upload

async function imageUploadUtil(file) {
  console.log(file);
  const base64String = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;
  return cloudinary.uploader.upload(base64String, { resource_type: "image" });
}

// cloudinary.v2.uploader
// .upload("dog.mp4",
//   { resource_type: "video",
//     public_id: "dog_closeup",
//     eager: [
//       { width: 300, height: 300, crop: "pad", audio_codec: "none" },
//       { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],
//     eager_async: true,
//     eager_notification_url: "https://mysite.example.com/notify_endpoint" })
// .then(result=>console.log(result));

async function videoUploadUtil(file) {
  console.log(file);
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload(
      file,
      {
        resource_type: "video",
        public_id: "dog_closeup",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(file.buffer); // ✅ Send file buffer correctly
  });
}
// const uploadMediaToCloudinary = async (filePath) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       resource_type: "auto", // ✅ Auto-detect image/video
//     });

//     return result;
//   } catch (error) {
//     console.log("❌ Cloudinary Upload Error:", error);
//     throw new Error("Error uploading to Cloudinary");
//   }
// };

export { upload, videoUploadUtil, imageUploadUtil };
