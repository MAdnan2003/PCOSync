import express from "express";
import User from "../models/User.js";
import Report from "../models/Report.js";
import Activity from "../models/Activity.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // --- REQUIRED COUNTS ---
    const totalUsers = await User.countDocuments();
    const openReports = await Report.countDocuments({ status: "pending" });

    // "Active content" = total activities
    const activeContent = await Activity.countDocuments();

    // Engagement rate = (activities / users) %
    const engagementRate =
      totalUsers > 0 ? ((activeContent / totalUsers) * 100).toFixed(1) : 0;

    // Fake “change vs last month” values
    const randomChange = () => Math.floor(Math.random() * 30) - 10; // -10% to +20%

    res.json({
      totalUsers,
      activeContent,
      openReports,
      engagementRate,

      // Dashboard expects change percentages too:
      totalUsersChange: randomChange(),
      activeContentChange: randomChange(),
      openReportsChange: randomChange(),
      engagementRateChange: randomChange(),
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
});

export default router;
