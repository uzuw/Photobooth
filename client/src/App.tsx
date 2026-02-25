import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booth from "./pages/Booth";
import BottomNavbar from "./components/BottomNavbar";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gallery from "./pages/Gallery";

import { UserProvider } from "./context/UserContext";

const App: React.FC = () => {
  return (
    <>
    <UserProvider>
    <BottomNavbar />
    <Routes>
      
      
      <Route path="/" element={<Home />} />
      <Route path="/booth" element={<Booth />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

    </Routes>
    </UserProvider>
    </>
  );
};

export default App;
