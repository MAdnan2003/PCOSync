import express from "express";
import {
  generateTryOn,
  getUserTryOns,
  getTryOnById,
  toggleFavorite,
  updateTryOn,
  deleteTryOn,
  getUserStats,
} from "../controllers/virtualTryOnController.js";
import protect from "../middleware/auth.js";

import {
  uploadTryOnImages,
  handleMulterError,
} from "../middleware/upload.js";
import {
  updateTryOnValidation,
  validate,
} from "../utils/validators.js";

const router = express.Router();

/* ----------------------------------
   Protect all routes
----------------------------------- */
router.use(protect);

/* ----------------------------------
   Create virtual try-on
----------------------------------- */
router.post(
  "/",
  uploadTryOnImages,
  handleMulterError,
  generateTryOn
);

/* ----------------------------------
   Read routes
----------------------------------- */
router.get("/", getUserTryOns);
router.get("/stats", getUserStats);
router.get("/:id", getTryOnById);

/* ----------------------------------
   Update routes
----------------------------------- */
router.patch("/:id/favorite", toggleFavorite);
router.put("/:id", updateTryOnValidation, validate, updateTryOn);

/* ----------------------------------
   Delete route
----------------------------------- */
router.delete("/:id", deleteTryOn);

export default router;
