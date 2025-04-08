const multer = require("multer");

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  if (err instanceof multer.MulterError) {
    // A Multer error occurred during upload
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: "File size too large. Maximum size is 100MB.",
      });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err.message === "Video not found") {
    return res.status(404).json({ error: "Video not found" });
  }

  // Default to 500 server error
  return res.status(500).json({
    error: "Server error",
    details: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
};

module.exports = { errorHandler };
