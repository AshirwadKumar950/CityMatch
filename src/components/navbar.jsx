// import { Link, useNavigate } from "react-router-dom";

// function Navbar({ isLoggedIn, setIsLoggedIn }) {

//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     navigate("/");
//   };

//   return (
//     <div className="flex items-center justify-between px-8 py-4 bg-gray-900">
      
//       <h1 className="text-3xl font-bold text-sky-400 drop-shadow-lg">
//         <Link to="/">CityMatch 🚀</Link>
//       </h1>

//       <div className="flex items-center gap-8">
//       {/* in place of <a></a> anchor tag here we use Link tag */}
//         <Link 
//           to="/about"
//           className="text-lg font-semibold text-sky-300 hover:text-white"
//         >
//           About
//         </Link>

//         {isLoggedIn ? (
//           <div className="relative group">

//             <span className="text-lg font-semibold text-green-400 hover:text-white cursor-pointer">
//               Profile
//             </span>

//             {/* Dropdown */}
//             <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 z-50">

//               <Link
//                 to="/userprofile"
//                 className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//               >
//                 View
//               </Link>

//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
//               >
//                 Logout
//               </button>
//             </div>

//           </div>
//         ) : (
//           <>
//             <Link
//               to="/login"
//               className="text-lg font-semibold text-sky-300 hover:text-white"
//             >
//               Login
//             </Link>

//             <Link
//               to="/signup"
//               className="text-lg font-semibold text-sky-300 hover:text-white"
//             >
//               Sign Up
//             </Link>
//           </>
//         )}

//       </div>
//     </div>
//   );
// }

// export default Navbar;


import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-gray-900">
      <h1 className="text-3xl font-bold text-sky-400 drop-shadow-lg">
        <Link to="/">CityMatch 🚀</Link>
      </h1>

      <div className="flex items-center gap-8">
        <Link
          to="/about"
          className="text-lg font-semibold text-sky-300 hover:text-white"
        >
          About
        </Link>

        {isLoggedIn ? (
          <div className="relative group">
            <span className="text-lg font-semibold text-green-400 hover:text-white cursor-pointer">
              Profile
            </span>

            {/* Dropdown */}
            <div
              className="absolute right-0 mt-3 w-44 rounded-2xl overflow-hidden z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl border border-white/10"
              style={{ background: "linear-gradient(145deg, #1e293b, #0f172a)" }}
            >
              {/* Account badge */}
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
                  Account
                </p>
              </div>

              <div className="p-1.5 flex flex-col gap-0.5">
                <Link
                  to="/userprofile"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-150 text-sm font-medium"
                >
                  <span className="text-base">👤</span>
                  View Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 text-sm font-medium w-full text-left"
                >
                  <span className="text-base">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-lg font-semibold text-sky-300 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-lg font-semibold text-sky-300 hover:text-white"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;