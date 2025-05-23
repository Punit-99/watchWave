import Show from "../../models/Shows.js";
import { cloudinaryUpload } from "../../helper/cloudinary.js";
import cloudinary from "cloudinary";

// Upload Cloudinary
export const handleFileUpload = async (req, res) => {
  try {
    const { type = "auto" } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    console.log("Uploading with type:", type);

    console.log(req.file);
    const result = await cloudinaryUpload(req.file, type);

    res.json({ success: true, result });
    console.log("✅ Uplaoded Successfull");
  } catch (e) {
    console.error("❌ Upload Error:", e);
    res.status(500).json({ success: false, message: "Upload Failed" });
  }
};
//  Delete From Cloudinary
export const handleFileUploadDeleteUpload = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "Missing public_id" });
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "auto",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      return res.status(500).json({ message: "Failed to delete file" });
    }

    res.status(200).json({ message: "File deleted successfully", result });
  } catch (err) {
    console.error("Cloudinary deletion error:", err);
    res.status(500).json({ message: "Server error while deleting file" });
  }
};

export const addShow = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      genre,
      releaseDate,
      rating,
      poster, // { public_id, resource_type, secure_url }
      thumbnail, // { public_id, resource_type, secure_url }
      video, // { public_id, resource_type, secure_url } (only for movies)
      episodes, // Array of { title, video: { public_id, resource_type, secure_url } } (only for web series)
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !type ||
      !releaseDate ||
      !poster ||
      !genre ||
      !thumbnail
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }

    // Ensure `rating` is stored as a number
    const parsedRating = rating ? Number(rating) : undefined;
    if (parsedRating && (parsedRating < 0 || parsedRating > 10)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rating value (0-10 allowed)",
      });
    }

    const newShow = new Show({
      title,
      description,
      type,
      genre,
      releaseDate: new Date(releaseDate),
      rating: parsedRating,
      poster,
      thumbnail,
      video: type === "movie" ? video : undefined,
      episodes: type === "webseries" ? episodes : undefined,
    });

    await newShow.save();
    res.status(201).json({ success: true, data: newShow });
  } catch (error) {
    console.error("❌ Error in addShow:", error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

export const editShow = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      genre,
      releaseDate,
      posterUrl,
      trailerUrl,
      videoUrl,
      rating,
      episodes,
      thumbnailUrls,
    } = req.body;

    let findShow = await Show.findById(id);
    if (!findShow) {
      return res
        .status(404)
        .json({ success: false, message: "Show not found" });
    }

    findShow.title = title || findShow.title;
    findShow.description = description || findShow.description;
    findShow.type = type || findShow.type;
    findShow.genre = genre || findShow.genre;
    findShow.releaseDate = releaseDate || findShow.releaseDate;
    findShow.posterUrl = posterUrl || findShow.posterUrl;
    findShow.trailerUrl = trailerUrl || findShow.trailerUrl;
    findShow.videoUrl =
      type === "movie" ? videoUrl || findShow.videoUrl : undefined;
    findShow.rating = rating || findShow.rating;
    findShow.thumbnailUrls = thumbnailUrls || findShow.thumbnailUrls;

    if (type === "webseries") {
      findShow.episodes = episodes?.length ? episodes : findShow.episodes;
    } else {
      findShow.episodes = undefined; // Remove episodes if switching to movie
    }

    await findShow.save();
    res.status(200).json({ success: true, data: findShow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

export const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findByIdAndDelete(id);

    if (!show) {
      return res
        .status(404)
        .json({ success: false, message: "Show not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Show deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};
export const fetchAllShows = async (req, res) => {
  try {
    const listOfShows = await Show.find({});
    res.status(200).json({ success: true, data: listOfShows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};
