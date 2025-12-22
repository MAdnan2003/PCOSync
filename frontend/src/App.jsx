import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// COMPONENTS
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Login from "./components/Login";
import UserDashboard from "./components/Dashboard";
import MedicalDetailsForm from "./components/MedicalDetailsForm";

// PAGES
import Landing from "./pages/Landing";
import AdminDashboard from "./pages/AdminDashboard";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";

// USER FEATURE PAGES
import CycleTracker from "./pages/CycleTracker";
import MealsWaterPage from "./pages/MealsWaterPage";
import MoodJournalPage from "./pages/MoodJournalPage";
import CommunityForumPage from "./pages/CommunityForumPage";
import ForumPostPage from "./pages/ForumPostPage";

// WORKOUT FEATURES
import WorkoutPlan from "./pages/WorkoutPlan";
import WorkoutProgress from "./pages/WorkoutProgress";

// PCOS PREDICTION
import PCOSPrediction from "./pages/PCOSPrediction";

// DIET PLAN
import DietPlan from "./pages/DietPlan";

// ✅ ADDED: SKINCARE ROUTINE (NOTHING REMOVED)
import SkincareRoutine from "./pages/SkincareRoutine";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     AUTH CHECK ON LOAD
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  /* =========================
     LOGIN / LOGOUT HANDLERS
  ========================= */
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* =========================
     NOT LOGGED IN
  ========================= */
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  /* =========================
     LOGGED IN APP
  ========================= */
  return (
    <Router>
      <div className="flex min-h-screen">

        {/* ADMIN SIDEBAR */}
        {user.role === "admin" && (
          <Sidebar onLogout={handleLogout} user={user} />
        )}

        <div className="flex-1 flex flex-col bg-gray-50">

          {/* USER TOP BAR */}
          {user.role === "user" && (
            <TopBar user={user} onLogout={handleLogout} />
          )}

          <div className="flex-1 p-6">
            <Routes>

              {/* ROOT */}
              <Route
                path="/"
                element={
                  user.role === "admin"
                    ? <Navigate to="/dashboard" replace />
                    : <Landing user={user} />
                }
              />

              {/* DASHBOARD */}
              <Route
                path="/dashboard"
                element={
                  user.role === "admin"
                    ? <AdminDashboard />
                    : <UserDashboard />
                }
              />

              {/* MEDICAL DETAILS */}
              <Route
                path="/medical-details"
                element={
                  user.role === "user"
                    ? <MedicalDetailsForm />
                    : <Navigate to="/" replace />
                }
              />

              {/* CYCLE TRACKER */}
              <Route
                path="/cycle-tracker"
                element={
                  user.role === "user"
                    ? <CycleTracker />
                    : <Navigate to="/" replace />
                }
              />

              {/* WORKOUT PLAN */}
              <Route
                path="/workout-plan"
                element={
                  user.role === "user"
                    ? <WorkoutPlan />
                    : <Navigate to="/" replace />
                }
              />

              {/* WORKOUT PROGRESS */}
              <Route
                path="/workout-progress"
                element={
                  user.role === "user"
                    ? <WorkoutProgress />
                    : <Navigate to="/" replace />
                }
              />

              {/* PCOS PREDICTION */}
              <Route
                path="/pcos-prediction"
                element={
                  user.role === "user"
                    ? <PCOSPrediction />
                    : <Navigate to="/" replace />
                }
              />

              {/* DIET PLAN */}
              <Route
                path="/diet-plan"
                element={
                  user.role === "user"
                    ? <DietPlan />
                    : <Navigate to="/" replace />
                }
              />

              {/* ✅ SKINCARE ROUTINE (ADDED, NOTHING REMOVED) */}
              <Route
                path="/skincare"
                element={
                  user.role === "user"
                    ? <SkincareRoutine />
                    : <Navigate to="/" replace />
                }
              />

              {/* MEALS & WATER */}
              <Route
                path="/meals-water"
                element={
                  user.role === "user"
                    ? <MealsWaterPage />
                    : <Navigate to="/" replace />
                }
              />

              {/* MOOD JOURNAL */}
              <Route
                path="/mood-journal"
                element={
                  user.role === "user"
                    ? <MoodJournalPage />
                    : <Navigate to="/" replace />
                }
              />

              {/* COMMUNITY */}
              <Route
                path="/forum"
                element={
                  user.role === "user"
                    ? <CommunityForumPage />
                    : <Navigate to="/" replace />
                }
              />

              <Route
                path="/forum/:id"
                element={
                  user.role === "user"
                    ? <ForumPostPage />
                    : <Navigate to="/" replace />
                }
              />

              {/* ADMIN ROUTES */}
              {user.role === "admin" && (
                <>
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                </>
              )}

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
