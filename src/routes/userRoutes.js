const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMyProfile,
} = require("../controllers/userController");

// Admin: Get all users
router.get("/", protect, authorize("admin"), getUsers);

// Admin: Get single user
router.get("/:id", protect, authorize("admin"), getUser);

// Admin: Update a user (role, name, etc.)
router.put("/:id", protect, authorize("admin"), updateUser);

// Admin: Delete a user
router.delete("/:id", protect, authorize("admin"), deleteUser);

// Logged-in user: Update own profile
router.put("/profile/me", protect, updateMyProfile);

module.exports = router;
