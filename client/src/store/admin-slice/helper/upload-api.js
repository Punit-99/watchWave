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

    // ✅ Poster uplaod
    if (showMediaFormData.poster) {
      posterUrl = await dispatch(uploadFile(showMediaFormData.poster)).unwrap();
    }

    // ✅ Thumbnail upload
    if (showMediaFormData.thumbnail) {
      thumbnailUrl = await dispatch(
        uploadFile(showMediaFormData.thumbnail)
      ).unwrap();
    }

    console.log("🟢 Uploading Movie Video:", showVideoFormData[0].videoFile);
    if (
      showFormData?.category === "movie" &&
      Array.isArray(showVideoFormData) &&
      showVideoFormData.length > 0
    ) {
      console.log("🟢 Uploading Movie Video:", showVideoFormData[0].videoFile);
      videoUrls.push(
        await dispatch(uploadFile(showVideoFormData[0].videoFile)).unwrap()
      );
    } else if (showFormData?.category === "webseries") {
      console.log("WB");
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
