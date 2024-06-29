const express = require("express");
const {
  getAllVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  getUserVideos,
} = require("../controllers/videoController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getAllVideos).post(protect, createVideo);

router
  .route("/:id")
  .get(getVideo)
  .put(protect, updateVideo)
  .delete(protect, deleteVideo);

router.route("/user/:userId").get(getUserVideos);

module.exports = router;
