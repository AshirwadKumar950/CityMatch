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
    <div style={styles.bg}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <form onSubmit={handleLogin} style={styles.card}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-slate-400 text-sm">Sign in to your CityMatch account</p>
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-slate-300 text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-slate-500 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', boxSizing: 'border-box' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        <div className="mb-8">
          <label className="block mb-2 text-slate-300 text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-slate-500 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', boxSizing: 'border-box' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Sign In
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: '#818cf8', fontWeight: 500 }}>Sign Up</Link>
        </p>
      </form>

      <style>{bgStyles}</style>
    </div>
  );
}

const bgStyles = `
  @keyframes drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(40px, -40px) scale(1.1); }
  }
`;

const styles = {
  bg: {
    background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blob1: { position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', top: '-150px', left: '-150px', animation: 'drift 10s ease-in-out infinite', pointerEvents: 'none' },
  blob2: { position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)', bottom: '-100px', right: '-100px', animation: 'drift 12s ease-in-out infinite reverse', pointerEvents: 'none' },
  card: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(15,23,42,0.75)',
    border: '1px solid rgba(255,255,255,0.09)',
    backdropFilter: 'blur(28px)',
    borderRadius: 20,
    padding: '40px',
    width: 400,
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  },
};

export default Login;