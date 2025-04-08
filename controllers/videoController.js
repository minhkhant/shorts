const fs = require("fs");
const videoService = require("../services/videoService");
const { deleteVideo } = require("../utils/fileUtils");

/**
 * Get all videos
 */
const getAllVideos = async (req, res, next) => {
  try {
    const videos = videoService.getAllVideos();
    res.json({ videos });
  } catch (error) {
    next(error);
  }
};

/**
 * Get video with pagination info
 */
const getVideoById = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    const videoData = videoService.getVideoWithPagination(videoId);
    res.json(videoData);
  } catch (error) {
    next(error);
  }
};

/**
 * Stream video file
 */
const streamVideo = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    const range = req.headers.range;
    const videoInfo = videoService.getVideoStreamInfo(videoId, range);

    if (range) {
      const {
        path,
        range: { start, end, chunkSize },
      } = videoInfo;
      const file = fs.createReadStream(path, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${videoInfo.fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });

      file.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": videoInfo.fileSize,
        "Content-Type": "video/mp4",
      });

      fs.createReadStream(videoInfo.path).pipe(res);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete video
 */
const deleteVideoById = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    deleteVideo(videoId);
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVideos,
  getVideoById,
  streamVideo,
  deleteVideoById,
};
