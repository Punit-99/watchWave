import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  resource_type: { type: String, required: true },
  secure_url: { type: String, required: true },
});

const episodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  video: { type: mediaSchema, required: true }, // ✅ Updated video field
  releaseDate: { type: Date },
});

const showSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  genre: { type: [String], required: true },
  releaseDate: { type: Date, required: true },
  rating: { type: Number, min: 0, max: 10 },

  poster: { type: mediaSchema, required: true }, // ✅ Updated poster field
  thumbnail: { type: mediaSchema, required: true }, // ✅ Updated thumbnail field

  type: { type: String, enum: ["movie", "webseries"], required: true },

  video: {
    type: mediaSchema,
    required: function () {
      return this.type === "movie";
    },
  }, // ✅ Updated video field for movies

  episodes: {
    type: [episodeSchema],
    validate: {
      validator: function (v) {
        return this.type === "webseries" ? v.length > 0 : true;
      },
      message: "Web series must have at least one episode",
    },
  },

  createdAt: { type: Date, default: Date.now },
});

const Show = mongoose.model("Show", showSchema);
export default Show;
