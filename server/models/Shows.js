import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  releaseDate: { type: Date },
});

const showSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  genre: { type: [String], required: true },
  releaseDate: { type: Date, required: true },
  rating: { type: Number, min: 0, max: 10 },
  trailerUrl: { type: String },
  posterUrl: { type: String, required: true }, // Main face of movie/show
  thumbnailUrls: { type: [String], required: true }, // Multiple thumbnails
  type: { type: String, enum: ["movie", "webseries"], required: true },
  videoUrl: {
    type: String,
    required: function () {
      return this.type === "movie";
    },
  },
  episodes: {
    type: [episodeSchema],
    required: function () {
      return this.type === "webseries";
    },
  },
  createdAt: { type: Date, default: Date.now },
});

const Show = mongoose.model("Show", showSchema);
export default Show;
