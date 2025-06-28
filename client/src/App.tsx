import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booth from "./pages/Booth";
import BottomNavbar from "./components/BottomNavbar";
import Profile from "./pages/Profile";

const App: React.FC = () => {
  return (
    <>
    <BottomNavbar />
    <Routes>
      
      
      <Route path="/" element={<Home />} />
      <Route path="/booth" element={<Booth />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
    </>
  );
};

export default App;
