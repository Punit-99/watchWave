// Home HeroSection Images

import mongoose from "mongoose";

const HomeFeatureSchema = new mongoose.Schema(
  {
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("HomeFeature", HomeFeatureSchema);
