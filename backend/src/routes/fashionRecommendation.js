import express from "express";
import {
  getRecommendations,
  saveRecommendation
} from "../controllers/fashionRecommendationController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

console.log("✅ Fashion routes file loaded"); // 👈 Add this

router.get("/recommendations", auth, getRecommendations);
router.post("/save", auth, saveRecommendation);
router.get("/test", (req, res) => {
  res.send("✅ Fashion test route is working");
});


export default router;

