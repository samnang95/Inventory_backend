const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const saltRounds = 10;

exports.register = async (req, res) => {
  try {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    // check existing
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    // hash
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ name, email, password: hashed });

    // create token
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    // respond (omit password)
    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.status(201).json({ user: userSafe, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.json({ user: userSafe, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
