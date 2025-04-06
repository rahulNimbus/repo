const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:62478"],
    credentials: true,
  })
);

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });

const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

const PORT = process.env.PORT || 8180;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
