// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// function Signup({ setIsLoggedIn }) {

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const handleSignup = (e) => {
//     e.preventDefault();

//     if (!name || !email || !password) {
//       alert("Please fill all fields");
//       return;
//     }

//     // Simulate signup success
//     setIsLoggedIn(true);

//     // Redirect to profile
//     navigate("/profile");
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">

//       <form 
//         onSubmit={handleSignup}
//         className="bg-white p-8 rounded-xl shadow-lg w-96"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Create Account
//         </h2>

//         {/* Name */}
//         <div className="mb-4">
//           <label className="block mb-2 text-gray-600">Full Name</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-sky-400"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter your name"
//           />
//         </div>

//         {/* Email */}
//         <div className="mb-4">
//           <label className="block mb-2 text-gray-600">Email</label>
//           <input
//             type="email"
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-sky-400"
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
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-sky-400"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Create a password"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition"
//         >
//           Sign Up
//         </button>

//         <p className="mt-4 text-center text-sm">
//           Already have an account?{" "}
//           <Link to="/login" className="text-sky-500 hover:underline">
//             Login
//           </Link>
//         </p>

//       </form>
//     </div>
//   );
// }

// export default Signup;


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function Signup({ setIsLoggedIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsLoggedIn(true);
      navigate("/userprofile");
    } catch (error) {
      alert("Unable to connect to backend server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <form onSubmit={handleSignup} style={styles.card}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
          <p className="text-slate-400 text-sm">Start your CityMatch journey</p>
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-slate-300 text-sm font-medium">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-slate-500 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', boxSizing: 'border-box' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
          />
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
            placeholder="Create a password"
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
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Account"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 500 }}>Sign In</Link>
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

export default Signup;