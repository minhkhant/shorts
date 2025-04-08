const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const VIDEO_DIR = process.env.VIDEO_DIR || path.join(__dirname, "videos"); // Directory where videos are stored

// Ensure video directory exists
try {
  if (!fs.existsSync(VIDEO_DIR)) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
    console.log(`Created video directory at ${VIDEO_DIR}`);
  }
} catch (err) {
  console.error(`Error creating video directory: ${err.message}`);
}

// Get list of videos in the directory
function getVideoList() {
  try {
    const files = fs.readdirSync(VIDEO_DIR);
    return files.filter((file) => path.extname(file).toLowerCase() === ".mp4");
  } catch (err) {
    console.error(`Error reading video directory: ${err.message}`);
    return [];
  }
}

// API endpoint to get information about a specific video with pagination
app.get("/api/videos/:videoId", (req, res) => {
  const videoId = req.params.videoId;
  const videoList = getVideoList();

  // Find the requested video's index
  const currentIndex = videoList.findIndex((video) => video === videoId);

  if (currentIndex === -1) {
    return res.status(404).json({ error: "Video not found" });
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

  res.json(response);
});

// API endpoint to get a list of all available videos
app.get("/api/videos", (req, res) => {
  const videoList = getVideoList();
  const videos = videoList.map((video) => ({
    id: video,
    title: path.parse(video).name,
    url: `/api/videos/${video}`,
  }));

  res.json({ videos });
});

// Stream video files
app.get("/videos/:videoId", (req, res) => {
  const videoPath = path.join(VIDEO_DIR, req.params.videoId);

  // Check if the video exists
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("Video not found");
  }

  // Get file stats
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  // Handle range requests (important for video streaming)
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    file.pipe(res);
  } else {
    // No range requested, send the entire file
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(videoPath).pipe(res);
  }
});

// Home route
app.get("/", (req, res) => {
  res.send("Video Catalog Backend is running. Access videos at /api/videos");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Video catalog server running on port ${PORT}`);
  console.log(`Video directory: ${VIDEO_DIR}`);
});
