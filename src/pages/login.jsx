import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setIsLoggedIn }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple validation
    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter email and password");
      return;
    }

    // Simulate successful login
    setIsLoggedIn(true);

    // Redirect to profile page
    navigate("/userprofile");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <form 
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-600">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition"
        >
          Login
        </button>

        {/* Signup link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-sky-500 hover:underline">
            Sign Up
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Login;
