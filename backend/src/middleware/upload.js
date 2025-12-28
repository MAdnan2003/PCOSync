import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/* ----------------------------------
   ES module __dirname fix
----------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ----------------------------------
   Upload directories
----------------------------------- */
const USER_PHOTO_DIR = path.join(__dirname, "../../uploads/user-photos");
const OUTFIT_PHOTO_DIR = path.join(__dirname, "../../uploads/outfits");

/* ----------------------------------
   Ensure directories exist
----------------------------------- */
[USER_PHOTO_DIR, OUTFIT_PHOTO_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

/* ----------------------------------
   Multer storage config
----------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "userPhoto") {
      cb(null, USER_PHOTO_DIR);
    } else if (file.fieldname === "outfitPhoto") {
      cb(null, OUTFIT_PHOTO_DIR);
    } else {
      cb(new Error("Invalid file field name"));
    }
  },

  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

/* ----------------------------------
   File type validation
----------------------------------- */
const fileFilter = (req, file, cb) => {
  const allowedTypes = (
    process.env.ALLOWED_FILE_TYPES ||
    "image/jpeg,image/jpg,image/png,image/webp"
  ).split(",");

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type (${file.mimetype}). Only JPEG, JPG, PNG, WEBP allowed.`
      ),
      false
    );
  }
};

/* ----------------------------------
   Multer instance
----------------------------------- */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    files: 2,
  },
});

/* ----------------------------------
   Upload middleware
----------------------------------- */
export const uploadTryOnImages = upload.fields([
  { name: "userPhoto", maxCount: 1 },
  { name: "outfitPhoto", maxCount: 1 },
]);

/* ----------------------------------
   Multer error handler
----------------------------------- */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Max size is 10MB.",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum 2 files allowed.",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Use "userPhoto" and "outfitPhoto".',
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed",
    });
  }

  next();
};

/* ----------------------------------
   Default export (optional use)
----------------------------------- */
export default upload;
