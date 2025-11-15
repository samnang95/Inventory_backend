const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    // read token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Not authorized, token missing" });

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Token invalid or expired" });
    }

    // attach user (optional: fetch from DB)
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ message: "User no longer exists" });

    req.user = user; // available to next handlers
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// optional role-checker
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
};
