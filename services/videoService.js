const path = require("path");
const fs = require("fs");
const { getVideoList } = require("../utils/fileUtils");
const config = require("../config");

/**
 * Get all videos with basic info
 */
function getAllVideos() {
  const videoList = getVideoList();
  return videoList.map((video) => ({
    id: video,
    title: path.parse(video).name,
    url: `/videos/${video}`,
  }));
}

/**
 * Get video details with pagination
 */
function getVideoWithPagination(videoId) {
  const videoList = getVideoList();

  // Find the requested video's index
  const currentIndex = videoList.findIndex((video) => video === videoId);

  if (currentIndex === -1) {
    throw new Error("Video not found");
  }

  // Build the response with pagination
  const response = {
    video: {
      id: videoId,
      title: path.parse(videoId).name,
      url: `/videos/${videoId}`,
    },
    pagination: {
      total: videoList.length,
      current: currentIndex + 1,
    },
  };

  // Add previous video if available
  if (currentIndex > 0) {
    response.pagination.previous = `/api/videos/${videoList[currentIndex - 1]}`;
  }

  // Add next video if available
  if (currentIndex < videoList.length - 1) {
    response.pagination.next = `/api/videos/${videoList[currentIndex + 1]}`;
  }

  return response;
}

/**
 * Get video file stream info
 */
function getVideoStreamInfo(videoId, range) {
  const videoPath = path.join(config.videoDir, videoId);

  // Check if the video exists
  if (!fs.existsSync(videoPath)) {
    throw new Error("Video not found");
  }

  // Get file stats
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    return {
      path: videoPath,
      stat,
      fileSize,
      range: { start, end, chunkSize },
    };
  }

  return {
    path: videoPath,
    stat,
    fileSize,
  };
}

module.exports = {
  getAllVideos,
  getVideoWithPagination,
  getVideoStreamInfo,
};
