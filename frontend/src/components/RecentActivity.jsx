import { useEffect, useState } from "react";
import axios from "axios";

export default function RecentActivity() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/activity")
         .then(res => setActivity(res.data))
         .catch(err => console.log(err));
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return isNaN(d) ? "Unknown" : d.toLocaleString();
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
      <ul className="space-y-2">
        {activity.map((item) => (
          <li key={item._id} className="flex justify-between">
            <span>
              <strong>{item.actorName}</strong> – {item.action}
            </span>
            <span className="text-gray-500 text-sm">
              {formatDate(item.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
