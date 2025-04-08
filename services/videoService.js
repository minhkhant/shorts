const path = require("path");
const fs = require("fs");
const { getVideoList } = require("../utils/fileUtils");
const config = require("../config");

/**
 * Get latest video with basic info
 */
function getLatestVideo() {
  const videoList = getVideoList();

  if (videoList.length === 0) {
    return null; // No videos available
  }

  // Sort videos by modification time (newest first)
  const sortedVideos = videoList
    .map((filename) => {
      const filePath = path.join(config.videoDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        mtime: stats.mtime,
      };
    })
    .sort((a, b) => b.mtime - a.mtime);

  const latestVideo = sortedVideos[0].filename;
  return getVideoWithPagination(latestVideo);
}

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

  // Sort videos by modification time (newest first)
  const sortedVideos = videoList
    .map((filename) => {
      const filePath = path.join(config.videoDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        mtime: stats.mtime,
      };
    })
    .sort((a, b) => b.mtime - a.mtime);

  // Map back to just filenames
  const sortedFilenames = sortedVideos.map((v) => v.filename);

  // Find the requested video's index in the sorted list
  const currentIndex = sortedFilenames.findIndex((video) => video === videoId);

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
      total: sortedFilenames.length,
      current: currentIndex + 1,
    },
  };

  // Add previous video if available
  if (currentIndex > 0) {
    response.pagination.previous = `/api/videos/${
      sortedFilenames[currentIndex - 1]
    }`;
  }

  // Add next video if available
  if (currentIndex < sortedFilenames.length - 1) {
    response.pagination.next = `/api/videos/${
      sortedFilenames[currentIndex + 1]
    }`;
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
  getLatestVideo,
  getAllVideos,
  getVideoWithPagination,
  getVideoStreamInfo,
};
