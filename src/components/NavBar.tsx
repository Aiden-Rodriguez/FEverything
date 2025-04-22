import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/NavBar.css";

const NavBar = () => {
  const [isMobile, setIsMobile] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    let baseClass = isMobile ? "menu-item menu-item-mobile" : "menu-item";
    return isActive ? `${baseClass} active` : baseClass;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/">
          <motion.div
            className={isMobile ? "title-mobile" : "title"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            FEverything
          </motion.div>
        </Link>

        <ul className={isMobile ? "menu-mobile" : "menu"}>
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
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
