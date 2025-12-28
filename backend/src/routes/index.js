import express from "express";
import auth from "../middleware/auth.js";

// Auth controllers
import {
  register,
  login,
  getCurrentUser,
  updateProfile
} from "../controllers/authController.js";

// Other controllers
import * as environmentalController from "../controllers/environmentalController.js";
import * as alertController from "../controllers/alertController.js";

// Route modules
import medicalDetailsRoutes from "./medicalDetailsRoutes.js";
//import symptomRoutes from "./symptoms.js";
//import fashionRoutes from "./fashionRecommendation.js";
//import bodyProfileRoutes from "./routes/bodyProfile.js";
// Add other route modules here as needed

const router = express.Router();

/* =========================
   AUTH ROUTES
========================= */
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", auth, getCurrentUser);
router.put("/auth/profile", auth, updateProfile);

/* =========================
   ENVIRONMENTAL ROUTES
========================= */
router.get("/environmental/current", auth, environmentalController.getCurrentEnvironmentalData);
router.get("/environmental/historical", auth, environmentalController.getHistoricalData);
router.get("/environmental/forecast", auth, environmentalController.getForecast);
router.get("/environmental/analytics", auth, environmentalController.getAnalytics);

/* =========================
   ALERT ROUTES
========================= */
router.get("/alerts", auth, alertController.getAlerts);
router.put("/alerts/:alertId/read", auth, alertController.markAsRead);
router.put("/alerts/read-all", auth, alertController.markAllAsRead);
router.delete("/alerts/:alertId", auth, alertController.dismissAlert);
router.get("/alerts/stats", auth, alertController.getAlertStats);

/* =========================
   MODULE ROUTES
========================= */
router.use("/medical-details", medicalDetailsRoutes);
//router.use("/symptoms", symptomRoutes);        // ✅ e.g. /api/symptoms/latest
//router.use("/fashion", fashionRoutes);         // ✅ e.g. /api/fashion/recommendations
//router.use("/body-profile", bodyProfileRoutes);

export default router;
