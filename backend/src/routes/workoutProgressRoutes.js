import express from "express";
import auth from "../middleware/auth.js";
import WorkoutLog from "../models/WorkoutLog.js";

const router = express.Router();

/* =========================
   ADD WORKOUT LOG
========================= */
router.post("/", auth, async (req, res) => {
  try {
    const { date, type, duration } = req.body;

    if (!date || !type || !duration) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const log = await WorkoutLog.findOneAndUpdate(
      { userId: req.userId, date, type },
      { userId: req.userId, date, type, duration },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   GET USER STATS
========================= */
router.get("/stats", auth, async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ userId: req.userId }).sort({
      date: -1,
    });

    const totalWorkouts = logs.length;
    const totalMinutes = logs.reduce((a, b) => a + b.duration, 0);

    // streak calculation
    let streak = 0;
    let currentDate = new Date();

    for (const log of logs) {
      const logDate = new Date(log.date);
      const diff =
        (currentDate - logDate) / (1000 * 60 * 60 * 24);

      if (diff <= 1) {
        streak++;
        currentDate = logDate;
      } else break;
    }

    let badge = "None";
    if (streak >= 30) badge = "🔥 30-Day Warrior";
    else if (streak >= 14) badge = "💪 2-Week Strong";
    else if (streak >= 7) badge = "🌟 7-Day Streak";

    res.json({
      success: true,
      data: {
        totalWorkouts,
        totalMinutes,
        streak,
        badge,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
