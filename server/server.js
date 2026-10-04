require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing from .env");
  process.exit(1);
}

connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());

app.get("/", (req, res) => res.send("Welcome to Wanderly API!"));

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const adminTripRoutes = require('./routes/adminTripRoutes');
const requestRoutes = require('./routes/requestRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/admin/trips', adminTripRoutes);
app.use('/api/requests', requestRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));