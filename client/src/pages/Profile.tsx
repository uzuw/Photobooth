import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "../context/UserContext";

const Profile: React.FC = () => {
  const { user, token, isLoggedIn, logout } = useUser();
  const [activity, setActivity] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://localhost:5000/api/users/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const map = data.reduce((acc: any, item: any) => {
            acc[item._id] = item.count;
            return acc;
          }, {});
          setActivity(map);
        });
    }
  }, [isLoggedIn, token]);

  // Generate last 28 days
  const gridDays = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (27 - i));
      return d.toISOString().split("T")[0];
    });
  }, []);

  const getIntensity = (date: string) => {
    const count = activity[date] || 0;
    if (count === 0) return "bg-neutral-100"; // No activity
    if (count <= 2) return "bg-neutral-300";  // Low
    if (count <= 5) return "bg-neutral-500";  // Medium
    if (count <= 8) return "bg-neutral-700";  // High
    return "bg-neutral-900";                  // Very High
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm bg-white p-10 rounded-[2.5rem] shadow-sm border border-neutral-200">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
            {user?.name?.charAt(0)}
          </div>
          <h2 className="text-xl font-bold">{user?.name}</h2>
        </div>

        {/* GitHub Style Streak Box */}
        <div className="mb-8">
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">
            Activity Streak
          </p>
          <div className="grid grid-cols-7 gap-2">
            {gridDays.map((day) => (
              <div
                key={day}
                title={`${day}: ${activity[day] || 0} captures`}
                className={`aspect-square w-full rounded-sm transition-colors duration-500 ${getIntensity(day)}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-neutral-400 font-bold uppercase">
            <span>Past 4 Weeks</span>
            <span>Intensity →</span>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-neutral-50 rounded-2xl p-4 flex justify-between items-center mb-8">
          <span className="text-sm font-medium text-neutral-500">Total Captures</span>
          <span className="text-xl font-black">{Object.values(activity).reduce((a, b) => a + b, 0)}</span>
        </div>

        <button onClick={logout} className="w-full py-4 text-neutral-400 font-bold text-xs hover:text-black transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;