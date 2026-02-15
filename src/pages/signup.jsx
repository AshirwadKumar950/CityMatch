import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup({ setIsLoggedIn }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    // Simulate signup success
    setIsLoggedIn(true);

    // Redirect to profile
    navigate("/profile");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form 
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-sky-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-sky-400"
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
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-sky-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-500 hover:underline">
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Signup;
