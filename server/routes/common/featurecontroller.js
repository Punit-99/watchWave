import express from "express";
import {
    addFeatureImage,
    getFeatureImages,
} from "../../controllers/common/feature.js"; // Ensure the correct file extension

const router = express.Router();

router.post("/add-feature-image", addFeatureImage);
router.get("/get-feature-images", getFeatureImages);

export default router;
