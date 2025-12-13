// ✅ ENV MUST LOAD FIRST
import "dotenv/config";

import express from "express";
import cors from "cors";
import cron from "node-cron";

import { connectDB, closeDB } from "./config/db.js";

// Routes
import routes from "./routes/index.js";
import statsRoutes from "./routes/statsRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import medicalDetailsRoutes from "./routes/medicalDetailsRoutes.js";

// Services & Models
import pcosImpactService from "./services/pcosImpactService.js";
import User from "./models/User.js";
import EnvironmentalData from "./models/EnvironmentalData.js";
import weatherService from "./services/weatherService.js";

const app = express();

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true
  })
);

/* =========================
   Parsers
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   Routes
========================= */
app.use("/api", routes);
app.use("/api/stats", statsRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medical-details", medicalDetailsRoutes);

/* =========================
   Health Check
========================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "PCOS Sync backend is running",
    timestamp: new Date().toISOString()
  });
});

/* =========================
   Environmental Monitoring
========================= */
const startEnvironmentalMonitoring = () => {
  cron.schedule(process.env.ALERT_CHECK_INTERVAL || "*/30 * * * *", async () => {
    console.log("🔄 Running environmental monitoring check...");

    try {
      const users = await User.find({
        "preferences.alertsEnabled": true,
        "location.latitude": { $exists: true },
        "location.longitude": { $exists: true }
      });

      console.log(`📊 Monitoring ${users.length} users...`);

      for (const user of users) {
        try {
          const { latitude, longitude } = user.location;

          const [weather, airQuality] = await Promise.all([
            weatherService.getCurrentWeather(latitude, longitude),
            weatherService.getAirQuality(latitude, longitude)
          ]);

          const pcosImpact = pcosImpactService.analyzeImpact(
            weather,
            airQuality,
            user.profile?.symptoms || []
          );

          await environmentalController.checkAndCreateAlerts(
            user,
            weather,
            airQuality,
            pcosImpact
          );

          const environmentalData = new EnvironmentalData({
            userId: user._id,
            location: {
              city: weather.city,
              country: weather.country,
              latitude,
              longitude
            },
            weather,
            airQuality,
            pollution: {
              overallLevel: weatherService.getPollutionLevel(
                airQuality.aqi,
                airQuality.pm25,
                airQuality.pm10
              ),
              sources:
                environmentalController.identifyPollutionSources(airQuality)
            },
            pcosImpact
          });

          await environmentalData.save();
        } catch (userError) {
          console.error(
            `❌ Error monitoring user ${user._id}:`,
            userError.message
          );
        }
      }

      console.log("✅ Environmental monitoring completed");
    } catch (error) {
      console.error("❌ Environmental monitoring error:", error);
    }
  });

  console.log("⏰ Environmental monitoring cron started");
};

/* =========================
   Error Handler
========================= */
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

/* =========================
   Server Start
========================= */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    startEnvironmentalMonitoring();

    const server = app.listen(PORT, () => {
      console.log(`🚀 PCOS Sync backend running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        "🔑 OpenWeather loaded:",
        Boolean(process.env.OPENWEATHER_API_KEY)
      );
    });

    const shutdown = async () => {
      console.log("⚠️  Shutting down server...");
      server.close(async () => {
        await closeDB();
        process.exit(0);
      });

      setTimeout(() => {
        console.error("❌ Force shutdown");
        process.exit(1);
      }, 10000).unref();
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
