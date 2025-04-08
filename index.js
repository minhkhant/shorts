const express = require("express");
const path = require("path");
const routes = require("./routes");
const { errorHandler } = require("./middlewares/errorHandler");
const { setupVideoDirectory } = require("./utils/fileUtils");
const config = require("./config");

// Initialize express app
const app = express();

// Ensure video directory exists
setupVideoDirectory();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", routes);

// Home route
app.get("/", (req, res) => {
  res.send("Video Catalog Backend is running. Access videos at /api/videos");
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(config.port, () => {
  console.log(`Video catalog server running on port ${config.port}`);
  console.log(`Video directory: ${config.videoDir}`);
});
