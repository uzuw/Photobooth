import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        // This updates the context state globally
        login(data.token, data.user);
        navigate("/profile");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server connection failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border border-neutral-200 p-10 rounded-[2.5rem] shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">Welcome</h2>
        <p className="text-neutral-400 text-sm text-center mb-8">Sign in to your account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-black outline-none transition-all"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-black outline-none transition-all"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all active:scale-95">
            Log In
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400 mt-6">
          Don't have an account? <Link to="/register" className="text-black font-bold">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;