import { handleImageUpload, addShow, fetchAllShows, editShow, deleteShow } from "../../controllers/admin/shows.js";
import { upload } from "../../helper/cloudinary.js";
import express from "express";

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add-show", addShow);
router.put("/edit/:id", editShow);
router.delete("/delete-show/:id", deleteShow); // Added ":id" to match the deleteShow function
router.get("/get-show", fetchAllShows);

// Correct ES Modules export
export default router;
