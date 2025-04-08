const path = require("path");

module.exports = {
  port: process.env.PORT || 3000,
  videoDir: process.env.VIDEO_DIR || path.join(__dirname, "..", "videos"),
  fileSize: {
    max: 1024 * 1024 * 100, // 100MB limit
  },
};
