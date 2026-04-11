import { useState } from "react";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import { Routes, Route, Navigate } from "react-router-dom";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import MapPage from "./pages/mapPage";
import UserProfile from "./pages/UserProfile";
import LandingSlider from "./components/Slider";
import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<LandingSlider isLoggedIn={isLoggedIn} />} />
          <Route path="/about" element={<About />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/userprofile" element={
            isLoggedIn ? (
              <UserProfile setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;