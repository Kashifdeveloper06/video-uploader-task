const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  getUsers,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// router.route("/").get(authorize("admin"), getUsers);
router.route("/").get(getUsers);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
