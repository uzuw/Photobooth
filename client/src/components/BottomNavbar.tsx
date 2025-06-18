import React from "react";
import { HiHome, HiCamera, HiPhotograph, HiUserCircle } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", icon: HiHome, to: "/" },
  { label: "Booth", icon: HiCamera, to: "/booth" },
  { label: "Gallery", icon: HiPhotograph, to: "/gallery" },
  { label: "Profile", icon: HiUserCircle, to: "/profile" },
];

const BottomNavBar: React.FC = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-100 bg-white rounded-xl shadow-lg flex justify-between items-center px-6 py-3 z-50"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {navItems.map(({ label, icon: Icon, to }) => {
        const isActive = location.pathname === to;

        return (
          <Link key={label} to={to} className="flex flex-col items-center text-xs md:text-sm">
            <motion.div
              whileHover={{ scale: 1.2, color: "#FBBF24" /* Tailwind yellow-400 */ }}
              animate={{ color: isActive ? "#B45309" /* yellow-700 */ : "#6B7280" /* gray-500 */ }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center cursor-pointer"
            >
              <Icon size={26} />
              <span className="mt-1 font-semibold">{label}</span>
            </motion.div>
          </Link>
        );
      })}
    </motion.nav>
  );
};

export default BottomNavBar;
