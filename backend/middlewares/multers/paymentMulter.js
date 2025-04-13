const multer = require("multer");
const fs = require("fs");
const path = require("path");

const paymentMulter = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = "uploads/payment/" + req.user.email;
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        `${
          Math.random().toString(36).substring(2, 15) +
          path.extname(file.originalname)
        }`
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "video/mp4" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          "Only PNG, JPEG,MP4 and PDF files are allowed"
        ),
        false
      );
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5.05, // 5MB
  },
});

const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size exceeds 5MB limit" });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res
        .status(400)
        .json({ error: "Only PNG, JPEG,MP4 and PDF files are allowed" });
    }
  }
  next(err);
};

module.exports = { paymentMulter, handleMulterErrors };
