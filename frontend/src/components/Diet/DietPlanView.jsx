// frontend/src/components/Diet/DietPlanView.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle,
  Download,
  RefreshCw,
  Coffee,
  Sun,
  Moon,
  Zap,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Diet.css";

const DietPlanView = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 = Mon, 6 = Sun
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/diet/current");
        if (res.data && res.data.weekMatches) {
          setPlan(res.data.weekMatches);
        } else {
          setError("No plan found. Please generate one first.");
        }
      } catch (err) {
        console.error("Error fetching plan:", err);
        setError("Failed to load diet plan.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  if (loading)
    return <div className="loading-state">Loading your personalized plan...</div>;

  if (error)
    return (
      <div className="error-state">
        {error}{" "}
        <Link to="/diet-plan/new" className="text-green-600 underline">
          Create New Plan
        </Link>
      </div>
    );

  if (!plan) return null;

  const currentDay = plan[activeTab];

  const getMealIcon = (type) => {
    switch (type) {
      case "Breakfast":
        return <Coffee size={18} />;
      case "Lunch":
        return <Sun size={18} />;
      case "Dinner":
        return <Moon size={18} />;
      default:
        return <Zap size={18} />;
    }
  };

  const fullDayName =
    currentDay.day === "Mon"
      ? "Monday"
      : currentDay.day === "Tue"
      ? "Tuesday"
      : currentDay.day === "Wed"
      ? "Wednesday"
      : currentDay.day === "Thu"
      ? "Thursday"
      : currentDay.day === "Fri"
      ? "Friday"
      : currentDay.day === "Sat"
      ? "Saturday"
      : "Sunday";

  return (
    <div className="diet-page fade-in">
      {/* Success Banner */}
      <div className="success-banner">
        <div className="banner-content">
          <h2>
            <CheckCircle size={20} color="#059669" /> Your Personalized
            PCOS-Friendly Diet Plan
          </h2>
          <p>A 7-day meal plan designed with low GI and anti-inflammatory foods</p>
        </div>
        <div
          className="banner-actions"
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
          >
            <Download size={16} /> Download
          </button>
          <Link
            to="/diet-plan/new"
            className="btn btn-outline"
            style={{
              fontSize: "0.875rem",
              padding: "0.5rem 1rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <RefreshCw size={16} /> New Plan
          </Link>
        </div>
      </div>

      {/* Week Tabs */}
      <div className="week-tabs">
        {plan.map((dayData, index) => (
          <button
            key={dayData.day}
            className={`week-tab ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {dayData.day}
          </button>
        ))}
      </div>

      {/* Day Content */}
      <div className="day-header">
        <h3>{fullDayName}'s Meal Plan</h3>
        <p className="day-meta">
          Total: {currentDay.totalCalories} calories • {currentDay.meals.length} meals
        </p>
      </div>

      <div className="meals-grid">
        {currentDay.meals.map((meal, idx) => (
          <div key={idx} className="meal-card">
            <div className="meal-header">
              <div>
                <div className="meal-type">
                  {getMealIcon(meal.type)}
                  {meal.type}
                </div>
                <h4 className="meal-title">{meal.name}</h4>
              </div>
              <div className="meal-badges">
                {meal.lowGI && <span className="badge low-gi">~ Low GI</span>}
                <span className="badge calories">{meal.calories} cal</span>
              </div>
            </div>

            <div className="ingredients-list">
              {meal.ingredients.map((ing, i) => (
                <span key={i} className="ingredient-pill">
                  {ing}
                </span>
              ))}
            </div>

            <div className="benefits">
              <h4>Health Benefits:</h4>
              <ul>
                {meal.benefits.map((benefit, i) => (
                  <li key={i}>
                    <Check size={14} /> {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietPlanView;
