const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./src/routes/productRoutes.js");

dotenv.config();

const dbConnect = require("./src/db/db.js");
dbConnect().catch((err) => {
  console.log("Error DB:", err.message);
});

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
