import React from "react";
import { motion } from "framer-motion";

const user = {
  name: "Uzuw",
  email: "uzuw@example.com",
  profilePic: "/images/profile.jpg", // You can replace with real src
};

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-gray-200"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex flex-col items-center">
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-28 h-28 rounded-full shadow object-cover mb-4"
          />

          <h2 className="text-2xl font-semibold text-gray-900 mb-1">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>

          {/* Optional edit button */}
          <button className="mt-6 px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
            Edit Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
