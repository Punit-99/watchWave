import Show from "../../models/Shows.js";
import { videoUploadUtil, imageUploadUtil } from "../../helper/cloudinary.js";

export const handleFileUpload = async (req, res) => {
  try {
    const { type } = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const uploadFunction = type === "video" ? videoUploadUtil : imageUploadUtil;
    const result = await uploadFunction(req.file);

    res.json({ success: true, result });
  } catch (e) {
    console.error("❌ Upload Error:", e);
    res.status(500).json({ success: false, message: "Upload Failed" });
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
