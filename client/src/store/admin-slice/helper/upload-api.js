import { uploadFile } from "../upload-slice";
import { toast } from "react-hot-toast";

// Helper function to upload multiple files
export const uploadMediaFiles = async (
  dispatch,
  showMediaFormData,
  showFormData,
  showVideoFormData
) => {
  try {
    let poster = {};
    let thumbnail = {};
    let videoFiles = [];

    // ✅ Poster upload
    if (showMediaFormData.poster) {
      const { public_id, resource_type, secure_url } = await dispatch(
        uploadFile(showMediaFormData.poster)
      ).unwrap();
      poster = { public_id, resource_type, secure_url };
    }

    // ✅ Thumbnail upload
    if (showMediaFormData.thumbnail) {
      const { public_id, resource_type, secure_url } = await dispatch(
        uploadFile(showMediaFormData.thumbnail)
      ).unwrap();
      thumbnail = { public_id, resource_type, secure_url };
    }

    if (showFormData?.category === "movie" && showVideoFormData.length > 0) {
      // ✅ Movie upload
      const { public_id, resource_type, secure_url } = await dispatch(
        uploadFile(showVideoFormData[0].videoFile)
      ).unwrap();
      videoFiles.push({ public_id, resource_type, secure_url });
      console.log(videoFiles);
    } else if (showFormData?.category === "webseries") {
      // ✅ Upload all episodes in parallel and store public_id, resource_type, secure_url
      const uploadPromises = showVideoFormData.map(async (episode) => {
        const { public_id, resource_type, secure_url } = await dispatch(
          uploadFile(episode.videoFile)
        ).unwrap();
        console.log("API WEB:", public_id, resource_type, secure_url);
        return { public_id, resource_type, secure_url };
      });

      videoFiles = await Promise.all(uploadPromises);
      console.log(videoFiles);
    }

    return { poster, thumbnail, videoFiles };
  } catch (error) {
    console.error("❌ Upload failed:", error);
    toast.error("Media upload failed!");
    return null;
  }
};
