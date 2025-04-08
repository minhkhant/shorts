const fs = require("fs");
const path = require("path");
const config = require("../config");

/**
 * Create video directory if it doesn't exist
 */
function setupVideoDirectory() {
  try {
    if (!fs.existsSync(config.videoDir)) {
      fs.mkdirSync(config.videoDir, { recursive: true });
      console.log(`Created video directory at ${config.videoDir}`);
    }
  } catch (err) {
    console.error(`Error creating video directory: ${err.message}`);
  }
}

/**
 * Get list of videos in the directory
 */
function getVideoList() {
  try {
    const files = fs.readdirSync(config.videoDir);
    return files.filter((file) => path.extname(file).toLowerCase() === ".mp4");
  } catch (err) {
    console.error(`Error reading video directory: ${err.message}`);
    return [];
  }
}

/**
 * Delete a video file
 */
function deleteVideo(filename) {
  const videoPath = path.join(config.videoDir, filename);
  if (!fs.existsSync(videoPath)) {
    throw new Error("Video not found");
  }
  fs.unlinkSync(videoPath);
  return true;
}

module.exports = {
  setupVideoDirectory,
  getVideoList,
  deleteVideo,
};
