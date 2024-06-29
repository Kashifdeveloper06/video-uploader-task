const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");

const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/database");
const config = require("./config/environment");

// Route files
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");

// Connect to database
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Dev logging middleware
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);
app.use(cors());

// Mount routers
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.get("/", (req, res) => {
  res.send("Hello, world!");
})

// Error handler middleware
app.use(errorHandler);

module.exports = app;
