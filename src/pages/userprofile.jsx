// import { useNavigate } from "react-router-dom";
// import mypic from '../assets/mysnappic.jpeg'

// function UserProfile({ setIsLoggedIn }) {

//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center items-center">

//       <div className="bg-white shadow-xl rounded-2xl p-10 w-[600px] relative">

//         {/* Profile Section */}
//         <div className="flex items-center gap-8">

//           {/* Profile Image with Hover Logout */}
//           <div className="relative group">
//             <img
//               src={mypic}
//               alt="Profile"
//               className="w-32 h-32 rounded-full border-4 border-sky-400 object-cover shadow-lg"
//             />

//             {/* Logout button appears on hover */}
//             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition">
//               <button
//                 onClick={handleLogout}
//                 className="text-white font-semibold"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* User Details */}
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">
//               Ashirwad Kumar
//             </h2>

//             <p className="text-gray-600 mt-2">
//               🎓 Graphic Era University
//             </p>

//             <p className="text-gray-600">
//               📧 ashirwadsingh950@gmail.com
//             </p>

//             <p className="text-gray-600">
//               💻 B.Tech CSE (3rd Year)
//             </p>
//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default UserProfile;

import { useNavigate } from "react-router-dom";
import mypic from '../assets/mysnappic.jpeg';

function UserProfile({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div style={styles.page}>
      {/* Ambient background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        {/* Grain overlay */}
        <div style={styles.grain} />

        {/* Top accent line */}
        <div style={styles.accentLine} />

        {/* Header label */}
        <p style={styles.label}>STUDENT PROFILE</p>

        {/* Profile section */}
        <div style={styles.profileRow}>
          {/* Avatar with hover logout */}
          <div
            style={styles.avatarWrapper}
            className="avatar-wrapper"
            onMouseEnter={e => {
              e.currentTarget.querySelector('.overlay').style.opacity = '1';
            }}
            onMouseLeave={e => {
              e.currentTarget.querySelector('.overlay').style.opacity = '0';
            }}
          >
            <img src={mypic} alt="Profile" style={styles.avatar} />
            <div
              className="overlay"
              style={styles.avatarOverlay}
              onClick={handleLogout}
            >
              <span style={styles.logoutIcon}>⏻</span>
              <span style={styles.logoutText}>Log out</span>
            </div>
          </div>

          {/* Info */}
          <div style={styles.infoBlock}>
            <h1 style={styles.name}>Ashirwad<br />Kumar</h1>
            <div style={styles.divider} />
            <div style={styles.details}>
              <InfoRow icon="🎓" text="Graphic Era University" />
              <InfoRow icon="📧" text="ashirwadsingh950@gmail.com" />
              <InfoRow icon="💻" text="B.Tech CSE · 3rd Year" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerTag}>CSE</span>
          <span style={styles.footerTag}>2025 Batch</span>
          <span style={styles.footerTag}>Dehradun</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .avatar-wrapper .overlay {
          transition: opacity 0.3s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        [data-card] {
          animation: fadeUp 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoIcon}>{icon}</span>
      <span style={styles.infoText}>{text}</span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
    top: '-100px',
    left: '-100px',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
    bottom: '-80px',
    right: '-80px',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 24,
    padding: '40px 44px 32px',
    width: 560,
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
    animation: 'fadeUp 0.6s ease forwards',
    overflow: 'hidden',
  },
  grain: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '160px',
    pointerEvents: 'none',
    opacity: 0.6,
    borderRadius: 24,
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 44,
    right: 44,
    height: 2,
    background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(236,72,153,0.6), transparent)',
    borderRadius: 1,
  },
  label: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 28,
  },
  profileRow: {
    display: 'flex',
    gap: 36,
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
    cursor: 'pointer',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(255,255,255,0.12)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    display: 'block',
  },
  avatarOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'rgba(10,10,15,0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    gap: 4,
    backdropFilter: 'blur(4px)',
  },
  logoutIcon: {
    fontSize: 22,
    color: '#f472b6',
  },
  logoutText: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
  },
  infoBlock: {
    flex: 1,
  },
  name: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1.1,
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  divider: {
    width: 40,
    height: 2,
    background: 'linear-gradient(90deg, #6366f1, #ec4899)',
    borderRadius: 2,
    margin: '16px 0',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  infoIcon: {
    fontSize: 14,
    width: 20,
    textAlign: 'center',
    flexShrink: 0,
  },
  infoText: {
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: 400,
    letterSpacing: '0.01em',
  },
  footer: {
    display: 'flex',
    gap: 8,
    marginTop: 32,
    paddingTop: 20,
    borderTop: '1px solid rgba(255,255,255,0.07)',
  },
  footerTag: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '4px 12px',
    textTransform: 'uppercase',
  },
};

export default UserProfile;