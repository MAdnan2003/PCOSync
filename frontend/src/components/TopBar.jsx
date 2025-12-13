import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, HeartPulse } from "lucide-react";

const TopBar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleMedicalDetails = () => {
    navigate("/medical-details");
  };

  const handleLogout = () => {
    onLogout();
    navigate("/"); // safety redirect
  };

  return (
    <header className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* LEFT */}
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold text-purple-600">
          PCOSync
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center space-x-4">
        {/* DASHBOARD */}
        <button
          onClick={handleDashboard}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        {/* MEDICAL DETAILS */}
        <button
          onClick={handleMedicalDetails}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-pink-600 text-white hover:bg-pink-700 transition"
        >
          <HeartPulse size={16} />
          <span>Medical Details</span>
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
