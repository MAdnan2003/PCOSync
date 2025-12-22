import express from "express";
import { predictPCOS } from "../controllers/pcosPrediction.controller.js";

const router = express.Router();

router.post("/predict-pcos", predictPCOS);

export default router;
