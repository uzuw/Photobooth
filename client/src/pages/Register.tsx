import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server connection error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white border border-neutral-200 p-10 rounded-3xl shadow-sm"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Create Account</h2>
          <p className="text-neutral-500 text-sm mt-2">Join the photo booth gallery</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <button className="w-full py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-all active:scale-95">
            Register
          </button>
        </form>

        <p className="text-center text-neutral-500 text-xs mt-6">
          Already have an account? <Link to="/login" className="text-black font-semibold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;