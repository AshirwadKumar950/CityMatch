import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Routes, Route } from "react-router-dom";
import About from "./pages/about";
import Login from "./pages/login";
import Signup from "./pages/signup";
import UserProfile from "./pages/userprofile";
import LandingSlider from "./components/slider"; 
import { Navigate } from "react-router-dom";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingSlider />} />
          <Route path="/about" element={<About />} />

          {/* login */}
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Signup */}
          <Route
            path="/signup"
            element={<Signup setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Protected Profile Route */}
          <Route
            path="/userprofile"
            element={
              isLoggedIn ? (
                <UserProfile setIsLoggedIn={setIsLoggedIn} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
