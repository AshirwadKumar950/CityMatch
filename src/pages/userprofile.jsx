// import { useNavigate } from "react-router-dom";

// function UserProfile({ setIsLoggedIn }) {

//   const navigate = useNavigate();

//     // It performs 2 actions when logout button is clicked:
//     //1. It sets the isLoggedIn state to false, which effectively logs the user out of the application.
//     //2. It uses the navigate function from react-router-dom to redirect the user back to the home page ("/") after logging out."/"→ Home Component
//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     navigate("/");
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="absolute top-20 right-8">
//         {/* Profile Pic - Top Left */}
//         <div className="absolute top-20 left-8">
//             <img
//                 src="https://via.placeholder.com/150"
//                 alt="Profile Pic"
//                 className="w-24 h-24 rounded-full border-4 border-sky-400 shadow-lg object-cover"
//             />
//             </div>

//             {/* Logout - Top Right */}
//             <div className="absolute top-20 right-8">
//             <button
//                 onClick={handleLogout}
//                 className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
//             >
//                 Logout
//             </button>
//         </div>

//         </div>
//         <div className="flex items-center justify-center min-h-screen">
//             <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
                
//             <h2 className="text-2xl font-bold mb-4 text-gray-700">
//                 Welcome to Your Profile 👋
//             </h2>

//             <p className="mb-6 text-gray-600">
//                 You are successfully logged in.
//             </p>

//             </div>
//         </div>
//     </div>
//   );
// }

// export default UserProfile;


import { useNavigate } from "react-router-dom";
import mypic from '../assets/mysnappic.jpeg'

function UserProfile({ setIsLoggedIn }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white shadow-xl rounded-2xl p-10 w-[600px] relative">

        {/* Profile Section */}
        <div className="flex items-center gap-8">

          {/* Profile Image with Hover Logout */}
          <div className="relative group">
            <img
              src={mypic}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-sky-400 object-cover shadow-lg"
            />

            {/* Logout button appears on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={handleLogout}
                className="text-white font-semibold"
              >
                Logout
              </button>
            </div>
          </div>

          {/* User Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Ashirwad Kumar
            </h2>

            <p className="text-gray-600 mt-2">
              🎓 Graphic Era University
            </p>

            <p className="text-gray-600">
              📧 ashirwadsingh950@gmail.com
            </p>

            <p className="text-gray-600">
              💻 B.Tech CSE (3rd Year)
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default UserProfile;
