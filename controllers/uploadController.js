/**
 * Handle video upload
 */
const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    const videoInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      url: `/videos/${req.file.filename}`,
      apiUrl: `/api/videos/${req.file.filename}`,
    };

    res.status(201).json({
      message: "Video uploaded successfully",
      video: videoInfo,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadVideo,
};
