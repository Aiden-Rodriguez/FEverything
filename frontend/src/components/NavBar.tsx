import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/NavBar.css";
import hoshido from "../assets/images/hoshido.webp";
import nohr from "../assets/images/nohr.webp";
const NavBar = () => {
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
            <NavLink to="/Signup" className={navLinkClass}>
              Sign Up
            </NavLink>
          </motion.li>
          <div>|</div>

          <motion.li whileHover={{ scale: 1.1 }}>
            <NavLink to="/About" className={navLinkClass}>
              About
            </NavLink>
          </motion.li>

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
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
