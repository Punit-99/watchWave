import {
  handleFileUpload,
  addShow,
  fetchAllShows,
  editShow,
  deleteShow,
  handleFileUploadDeleteUpload,
} from "../../controllers/admin/shows.js";
import { upload } from "../../helper/cloudinary.js";
import express from "express";

const router = express.Router();

router.post("/upload-file", upload.single("file"), handleFileUpload);
router.post("/delete/upload-file", handleFileUploadDeleteUpload);
router.post("/add-show", addShow);
router.put("/edit/:id", editShow);
router.delete("/delete-show/:id", deleteShow);
router.get("/get-show", fetchAllShows);

export default router;
