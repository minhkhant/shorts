const express = require("express");
const videoRoutes = require("./videoRoutes");

const router = express.Router();

// Video routes
router.use("/api/videos", videoRoutes);
router.use("/videos", videoRoutes);

module.exports = router;
