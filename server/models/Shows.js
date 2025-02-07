import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Movie", "TV Show", "Web Series"],
      required: true,
    },
    releaseDate: { type: Date, required: true },
    poster: { type: String, required: true }, // Store image URL
    videoUrl: { type: String, required: true },
    trailerUrl: { type: String },
    genres: { type: [String], required: true },
    rating: { type: Number, min: 0, max: 10 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
