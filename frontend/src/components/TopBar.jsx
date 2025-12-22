import { useNavigate } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  HeartPulse,
  CalendarDays,
  Utensils,
  Smile,
  Users,
  Dumbbell,      // existing
  BarChart3,     // existing
  Activity,      // existing
  Salad,         // existing
  Sparkles       // ✅ ADDED FOR SKINCARE
} from "lucide-react";

const TopBar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  /* =========================
     NAVIGATION HANDLERS
  ========================= */

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleMedicalDetails = () => {
    navigate("/medical-details");
  };

  const handleCycleTracker = () => {
    navigate("/cycle-tracker");
  };

  const handleMealsWater = () => {
    navigate("/meals-water");
  };

  const handleMoodJournal = () => {
    navigate("/mood-journal");
  };

  const handleForum = () => {
    navigate("/forum");
  };

  const handleWorkoutPlan = () => {
    navigate("/workout-plan");
  };

  const handleWorkoutProgress = () => {
    navigate("/workout-progress");
  };

  const handlePCOSPrediction = () => {
    navigate("/pcos-prediction");
  };

  const handleDietPlan = () => {
    navigate("/diet-plan");
  };

  // ✅ ADDED — SKINCARE HANDLER (NOTHING REMOVED)
  const handleSkincare = () => {
    navigate("/skincare");
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <header className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">

      {/* LEFT SIDE */}
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold text-purple-600">
          PCOSync
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-3">

        {/* DASHBOARD */}
        <button
          onClick={handleDashboard}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          <LayoutDashboard size={16} />
          <span>Environmental Monitor</span>
        </button>

        {/* MEDICAL DETAILS */}
        <button
          onClick={handleMedicalDetails}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-pink-600 text-white hover:bg-pink-700 transition"
        >
          <HeartPulse size={16} />
          <span>Medical Details</span>
        </button>

        {/* CYCLE TRACKER */}
        <button
          onClick={handleCycleTracker}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <CalendarDays size={16} />
          <span>Cycle Tracker</span>
        </button>

        {/* WORKOUT PLAN */}
        <button
          onClick={handleWorkoutPlan}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          <Dumbbell size={16} />
          <span>Workout Plan</span>
        </button>

        {/* WORKOUT PROGRESS */}
        <button
          onClick={handleWorkoutProgress}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 transition"
        >
          <BarChart3 size={16} />
          <span>Progress</span>
        </button>

        {/* PCOS PREDICTION */}
        <button
          onClick={handlePCOSPrediction}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-fuchsia-600 text-white hover:bg-fuchsia-700 transition"
        >
          <Activity size={16} />
          <span>PCOS Prediction</span>
        </button>

        {/* DIET PLAN */}
        <button
          onClick={handleDietPlan}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition"
        >
          <Salad size={16} />
          <span>Diet Plan</span>
        </button>

        {/* ✅ SKINCARE (ADDED — NO DELETIONS) */}
        <button
          onClick={handleSkincare}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 transition"
        >
          <Sparkles size={16} />
          <span>Skincare</span>
        </button>

        {/* MEALS & WATER */}
        <button
          onClick={handleMealsWater}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <Utensils size={16} />
          <span>Meals & Water</span>
        </button>

        {/* MOOD & JOURNAL */}
        <button
          onClick={handleMoodJournal}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <Smile size={16} />
          <span>Mood & Journal</span>
        </button>

        {/* COMMUNITY */}
        <button
          onClick={handleForum}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <Users size={16} />
          <span>Community</span>
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>

      </div>
    </header>
  );
};

export default TopBar;
