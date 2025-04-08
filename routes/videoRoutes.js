const express = require("express");
const { upload } = require("../middlewares/upload");
const videoController = require("../controllers/videoController");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

// Main API route now returns latest video with pagination
router.get("/", videoController.getLatestVideo);

// Keep other routes the same
router.get("/all", videoController.getAllVideos); // Route for listing all videos
router.get("/:videoId", videoController.getVideoById);
router.delete("/:videoId", videoController.deleteVideoById);
router.post("/upload", upload.single("video"), uploadController.uploadVideo);

module.exports = router;
