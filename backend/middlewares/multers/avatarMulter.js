const multer = require("multer");
const fs = require("fs");
const path = require("path");

const avatarMulter = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = "uploads/avatars";
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const filePath = path.join(
        "uploads/avatars",
        req?.body?.email || req?.user?.email || "file"
      );

      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true });
      }
      fs.mkdirSync(filePath, { recursive: true });
      cb(
        null,
        `${req?.body?.email || req?.user?.email || "file"}/${
          (req?.body?.username || req?.user?.username || "file") +
          path.extname(file.originalname)
        }`
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          "Only PNG and JPEG files are allowed"
        ),
        false
      );
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
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
        .json({ error: "Only PNG and JPEG files are allowed" });
    }
  }
  next(err);
};

module.exports = { avatarMulter, handleMulterErrors };
