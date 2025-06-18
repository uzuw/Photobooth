import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booth from "./pages/Booth";
import BottomNavbar from "./components/BottomNavbar";

const App: React.FC = () => {
  return (
    <>
    <BottomNavbar />
    <Routes>
      
      
      <Route path="/" element={<Home />} />
      <Route path="/booth" element={<Booth />} />
    </Routes>
    </>
  );
};

export default App;
