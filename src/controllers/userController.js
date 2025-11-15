const User = require("../models/User");
const bcrypt = require("bcrypt");

// Admin - Get all users
exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Admin - Get single user by id
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Admin - Update any user
exports.updateUser = async (req, res) => {
  const { name, email, role, password } = req.body;

  const updateData = { name, email, role };
  if (password) updateData.password = await bcrypt.hash(password, 10);

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

// Admin - Delete user
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted successfully" });
};

// User - Update own profile
exports.updateMyProfile = async (req, res) => {
  const { name, email, password } = req.body;

  const updateData = { name, email };
  if (password) updateData.password = await bcrypt.hash(password, 10);

  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
  }).select("-password");
  res.json(user);
};
