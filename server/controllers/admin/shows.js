import Show from "../../models/Shows.js";
import { imageUploadUtil } from "../../helper/cloudinary.js";

export const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUtil(url);

    res.json({ success: true, result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};

export const addShow = async (req, res) => {
  try {
    const {
      title,
      description,
      type, // Updated from category
      genre,
      releaseDate,
      posterUrl,
      trailerUrl,
      videoUrl,
      rating,
      episodes,
      thumbnailUrls, // Ensure thumbnails are included
    } = req.body;

    if (!title || !description || !type || !releaseDate || !posterUrl || !genre || !thumbnailUrls) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    const newShow = new Show({
      title,
      description,
      type,
      genre,
      releaseDate,
      posterUrl,
      trailerUrl,
      videoUrl: type === "movie" ? videoUrl : undefined, // Only for movies
      episodes: type === "webseries" ? episodes : undefined, // Only for webseries
      rating,
      thumbnailUrls,
    });

    await newShow.save();
    res.status(201).json({ success: true, data: newShow });
  } catch (error) {
    console.error(error);
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

export const editShow = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type, // Updated from category
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
      return res.status(404).json({ success: false, message: "Show not found" });
    }

    findShow.title = title || findShow.title;
    findShow.description = description || findShow.description;
    findShow.type = type || findShow.type;
    findShow.genre = genre || findShow.genre;
    findShow.releaseDate = releaseDate || findShow.releaseDate;
    findShow.posterUrl = posterUrl || findShow.posterUrl;
    findShow.trailerUrl = trailerUrl || findShow.trailerUrl;
    findShow.videoUrl = type === "movie" ? videoUrl || findShow.videoUrl : undefined;
    findShow.rating = rating || findShow.rating;
    findShow.thumbnailUrls = thumbnailUrls || findShow.thumbnailUrls;

    if (type === "webseries") {
      findShow.episodes = episodes || findShow.episodes;
    } else {
      findShow.episodes = undefined; // Ensure episodes are removed for movies
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
      return res.status(404).json({ success: false, message: "Show not found" });
    }

    res.status(200).json({ success: true, message: "Show deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error Occurred" });
  }
};
