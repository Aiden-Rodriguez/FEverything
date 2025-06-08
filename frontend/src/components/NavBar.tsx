import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/NavBar.css";
import hoshido from "../assets/images/hoshido.webp";
import nohr from "../assets/images/nohr.webp";
import settings from "../assets/images/settings.png";

const NavBar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "hoshido";
  });
  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? "menu-item active" : "menu-item";
  };

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "hoshido" ? "nohr" : "hoshido"));
  };

  const toggleSettingsOverlay = () => {
    setIsSettingsOverlayOpen(!isSettingsOverlayOpen);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setUsername(null);
    toggleSettingsOverlay();
    navigate("/login");
  };

  const [username, setUsername] = useState<string | null>(null);
  const [isSettingsOverlayOpen, setIsSettingsOverlayOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const handleLogin = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.username || null);
      } catch (err) {
        console.error("Invalid token:", err);
        setUsername(null);
      }
    };

    handleLogin();

    window.addEventListener("login", handleLogin);
    return () => window.removeEventListener("login", handleLogin);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/">
          <motion.div
            className="title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            FEverything
          </motion.div>
        </Link>

        <ul className="menu">
          <motion.li whileHover={{ scale: 1.1 }}>
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
          </motion.li>
          <div>|</div>

          <motion.li whileHover={{ scale: 1.1 }}>
            <NavLink to="/Login" className={navLinkClass}>
              Login
            </NavLink>
          </motion.li>
          <div>|</div>

          <motion.li whileHover={{ scale: 1.1 }}>
            <NavLink to="/About" className={navLinkClass}>
              About
            </NavLink>
          </motion.li>

          <motion.img
            whileHover={{ scale: 1.1 }}
            src={settings}
            onClick={toggleSettingsOverlay}
            className="navbar-image"
            alt="Settings"
          />
        </ul>
      </div>

      {isSettingsOverlayOpen && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="overlay">
            <div className="overlay-content">
              <button
                className="close-button"
                onClick={toggleSettingsOverlay}
                aria-label="Close settings overlay"
              >
                ✕
              </button>
              <h2>Settings</h2>
              {username ? (
                <p>Logged in as: {username}</p>
              ) : (
                <p>Not logged in</p>
              )}
              <div className="inline-container">
                <p>Theme:</p>
                <label className="theme">
                  <span className="theme__toggle-wrap">
                    <input
                      id="theme"
                      className="theme__toggle"
                      type="checkbox"
                      role="switch"
                      name="theme"
                      checked={theme === "nohr"}
                      onChange={toggleTheme}
                      aria-label="Toggle theme"
                    />
                    <span className="theme__icon">
                      <img
                        src={hoshido}
                        alt="Hoshido theme"
                        className="theme__icon-part sun"
                      />
                      <img
                        src={nohr}
                        alt="Nohr theme"
                        className="theme__icon-part moon"
                      />
                    </span>
                  </span>
                </label>
              </div>
              {username && (
                <button className="overlay-button" onClick={logOut}>
                  Log Out
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default NavBar;
