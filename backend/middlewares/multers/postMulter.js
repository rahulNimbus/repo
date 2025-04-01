const multer = require("multer");
const fs = require("fs");
const path = require("path");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 30 * 1024 * 1024; // 30MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/posts/" + req.user.username;
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/png"];
  const videoTypes = ["video/mp4"];

  if (![...imageTypes, ...videoTypes].includes(file.mimetype)) {
    return cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only PNG, JPEG, and MP4 files are allowed"
      ),
      false
    );
  }

  cb(null, true);
};

const postMulter = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

const checkFileSizes = (req, res, next) => {
  const file = req.file;
  if (req.file) {
    const imageTypes = ["image/jpeg", "image/png"];
    const videoTypes = ["video/mp4"];
    const filePath = file.path;

    if ([...videoTypes].includes(file.mimetype)) {
      if (file.size > MAX_VIDEO_SIZE) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return res.status(400).json({ error: "File size exceeds 30MB limit" });
      }
    } else if ([...imageTypes].includes(file.mimetype)) {
      if (file.size > MAX_IMAGE_SIZE) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return res.status(400).json({ error: "File size exceeds 5MB limit" });
      }
    }
  }
  next();
};

const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: err.field });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ error: err.field });
    }
  }
  next(err);
};

module.exports = { postMulter, handleMulterErrors, checkFileSizes };
