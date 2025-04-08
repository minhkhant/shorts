const express = require("express");
const { upload } = require("../middlewares/upload");
const videoController = require("../controllers/videoController");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

// API Routes
router.get("/", videoController.getAllVideos);
router.get("/:videoId", videoController.getVideoById);
router.delete("/:videoId", videoController.deleteVideoById);
router.post("/upload", upload.single("video"), uploadController.uploadVideo);

// Video streaming route - only for the /videos prefix
if (router.name === "/videos") {
  router.get("/:videoId", videoController.streamVideo);
}

module.exports = router;
