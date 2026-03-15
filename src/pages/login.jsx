// import { useState } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";

// function Login({ setIsLoggedIn }) {

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // Simple validation
//     if (email.trim() === "" || password.trim() === "") {
//       alert("Please enter email and password");
//       return;
//     }

//     // Simulate successful login
//     setIsLoggedIn(true);

//     // Redirect to profile page
//     const from = location.state?.from || "/userprofile";
//     navigate(from);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
//       <form 
//         onSubmit={handleLogin}
//         className="bg-white p-8 rounded-xl shadow-lg w-96"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//           Login
//         </h2>

//         {/* Email */}
//         <div className="mb-4">
//           <label className="block mb-2 text-gray-600">Email</label>
//           <input
//             type="email"
//             className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//           />
//         </div>

//         {/* Password */}
//         <div className="mb-6">
//           <label className="block mb-2 text-gray-600">Password</label>
//           <input
//             type="password"
//             className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//           />
//         </div>

//         {/* Button */}
//         <button
//           type="submit"
//           className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition"
//         >
//           Login
//         </button>

//         {/* Signup link */}
//         <p className="mt-4 text-center text-sm text-gray-600">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-sky-500 hover:underline">
//             Sign Up
//           </Link>
//         </p>

//       </form>
//     </div>
//   );
// }

// export default Login;

import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter email and password");
      return;
    }
    setIsLoggedIn(true);
    const from = location.state?.from || "/userprofile";
    navigate(from);
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={styles.bg}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96" style={{ position: 'relative', zIndex: 1 }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Email</label>
          <input type="email" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-600">Password</label>
          <input type="password" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
        </div>

        <button type="submit" className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition">Login</button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-sky-500 hover:underline">Sign Up</Link>
        </p>
      </form>

      <style>{bgStyles}</style>
    </div>
  );
}

const bgStyles = `
  @keyframes drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -30px) scale(1.08); }
  }
`;

const styles = {
  background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 50%, #e0e7ff 100%)',
  // bg: { background: 'linear-gradient(135deg, #e0f2fe 0%, #f0e6ff 50%, #fce7f3 100%)', position: 'relative', overflow: 'hidden' },
  blob1: { position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', top: '-100px', left: '-100px', animation: 'drift 8s ease-in-out infinite', pointerEvents: 'none' },
  blob2: { position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', bottom: '-80px', right: '-80px', animation: 'drift 10s ease-in-out infinite reverse', pointerEvents: 'none' },
};

export default Login;