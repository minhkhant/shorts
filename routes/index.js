const express = require("express");
const videoRoutes = require("./videoRoutes");
const videoController = require("../controllers/videoController");

const router = express.Router();

// API routes
router.use("/api/videos", videoRoutes);

// Direct video streaming routes
router.get("/videos/:videoId", videoController.streamVideo);

module.exports = router;
