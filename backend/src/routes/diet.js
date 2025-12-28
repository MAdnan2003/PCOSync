// backend/src/routes/diet.js
import express from "express";
import {
  generatePlan,
  getPlan,
  getDiet,
  addDiet,
} from "../controllers/dietController.js";

// const auth = require('../middleware/auth'); // keep disabled for demo if you want

const router = express.Router();

// @route   POST api/diet/generate
// @desc    Generate a 7-day plan
// @access  Public (for demo)
router.post("/generate", generatePlan);

// @route   GET api/diet/current
// @desc    Get the latest generated plan
// @access  Public (for demo)
router.get("/current", getPlan);

// Legacy routes
router.get("/", getDiet);
router.post("/", addDiet);

export default router;
