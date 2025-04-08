const multer = require("multer");
const path = require("path");
const config = require("../config");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.videoDir);
  },
  filename: function (req, file, cb) {
    // Keep original filename but ensure it's safe
    const originalName = file.originalname;
    // Create a safe filename by removing special characters
    const safeFilename = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, safeFilename);
  },
});

// File filter to only accept mp4 videos
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("Only MP4 video files are allowed"), false);
  }
};

// Configure upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.fileSize.max,
  },
});

module.exports = { upload };
