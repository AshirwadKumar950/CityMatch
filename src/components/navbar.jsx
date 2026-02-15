// import { Link } from "react-router-dom";
// function Navbar({ isLoggedIn, openLogin, openProfile }){
//     return(
//         <div className="flex items-center justify-between px-8 py-4 bg-gray-900">
      
//           <h1 className="text-3xl font-bold text-sky-400 drop-shadow-lg">
//             <Link to="/">CityMatch 🚀</Link>
//           </h1>

//           <div className="flex items-center gap-8">
//             <Link 
//               to="/about"
//               className="text-lg font-semibold text-sky-300 hover:text-white"
//             >
//               About
//             </Link>
//             {isLoggedIn ? (
//               <Link
//                 to="/userprofile"
//                 className="text-lg font-semibold text-green-400 hover:text-white"
//               >
//                 Profile
//               </Link>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="text-lg font-semibold text-sky-300 hover:text-white"
//                 >
//                   Login
//                 </Link>

//                 <Link
//                   to="/signup"
//                   className="text-lg font-semibold text-sky-300 hover:text-white"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//     );
// }

// export default Navbar


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
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition duration-200">

              <Link
                to="/userprofile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                View
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>

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
