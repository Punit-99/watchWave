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
    let posterUrl = "";
    let thumbnailUrl = "";
    let videoUrls = [];

    // ✅ Upload Poster
    if (showMediaFormData.poster) {
      posterUrl = await dispatch(uploadFile(showMediaFormData.poster)).unwrap();
    }

    // ✅ Upload Thumbnail
    if (showMediaFormData.thumbnail) {
      thumbnailUrl = await dispatch(
        uploadFile(showMediaFormData.thumbnail)
      ).unwrap();
    }
    console.log("🟢 UPLOAD-API::Uploading Video:", showVideoFormData);

    // ✅ Upload Video Files (Movie or Web Series)
    if (showFormData.type === "movie" && showVideoFormData.length > 0) {
      console.log("🟢 Uploading Movie Video:", showVideoFormData[0].videoFile);
      videoUrls.push(
        await dispatch(uploadFile(showVideoFormData[0].videoFile)).unwrap()
      );
    } else if (showFormData.type === "webseries") {
      const uploadPromises = showVideoFormData.map((episode) =>
        dispatch(uploadFile(episode.videoFile)).unwrap()
      );
      videoUrls = await Promise.all(uploadPromises);
    }

    return { posterUrl, thumbnailUrl, videoUrls };
  } catch (error) {
    console.error("❌ Upload failed:", error);
    toast.error("Media upload failed!");
    return null;
  }
};
