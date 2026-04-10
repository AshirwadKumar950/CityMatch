import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import mypic from '../assets/mysnappic.jpeg';
const mypic = "/mysnappic.jpeg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UserProfile({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        <div style={styles.grain} />
        <div style={styles.accentLine} />

        <p style={styles.label}>STUDENT PROFILE</p>

        <div style={styles.profileRow}>
          <div
            style={styles.avatarWrapper}
            onMouseEnter={e => {
              e.currentTarget.querySelector('.overlay').style.opacity = '1';
            }}
            onMouseLeave={e => {
              e.currentTarget.querySelector('.overlay').style.opacity = '0';
            }}
          >
            <img src={mypic} alt="Profile" style={styles.avatar} />
            <div className="overlay" style={styles.avatarOverlay} onClick={handleLogout}>
              <span style={styles.logoutIcon}>⏻</span>
              <span style={styles.logoutText}>Log out</span>
            </div>
          </div>

          <div style={styles.infoBlock}>
            <h1 style={styles.name}>
              {user ? user.name : "Loading..."}
            </h1>

            <div style={styles.divider} />

            <div style={styles.details}>
              <InfoRow icon="🎓" text="Graphic Era University" />
              <InfoRow icon="📧" text={user ? user.email : "Loading..."} />
              <InfoRow icon="💻" text="B.Tech CSE · 3rd Year" />
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <span style={styles.footerTag}>CSE</span>
          <span style={styles.footerTag}>2025 Batch</span>
          <span style={styles.footerTag}>Dehradun</span>
        </div>
      </div>
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
  },
  blob2: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
    bottom: '-80px',
    right: '-80px',
  },
  card: {
    position: 'relative',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 24,
    padding: '40px 44px 32px',
    width: 560,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: '50%',
  },
  name: {
    fontSize: 28,
    color: '#fff',
  },
  divider: {
    width: 40,
    height: 2,
    background: 'linear-gradient(90deg, #6366f1, #ec4899)',
    margin: '16px 0',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  infoRow: {
    display: 'flex',
    gap: 10,
  },
  infoText: {
    color: 'rgba(255,255,255,0.6)',
  },
};
export default UserProfile;