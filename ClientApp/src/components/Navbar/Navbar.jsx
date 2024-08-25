import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faBell,
  faUser,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useMobile } from "../../mobileContext/mobileContext.jsx";

const logoStr = "CampusConnect";
const Navbar = () => {
  const location = useLocation();
  const { isMobile, setMobile, showMenu, setMenu } = useMobile();
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth <= 768);

    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setMobile]);

  const toggleSidebar = () => {
    setMenu(isMobile && !showMenu);
  };
  

  return (
    <div className="navbar">
      <div className="campus-connect-header" onClick={toggleSidebar}>
        {isMobile ? <FontAwesomeIcon icon={faBars} /> : logoStr}
      </div>
      <nav className="navbar-items">
        <NavLink to="/settings" className="nav-button" title="Settings">
          <FontAwesomeIcon icon={faCog} />
        </NavLink>

        <NavLink to="/profile" className="nav-button" title="Profile">
          <FontAwesomeIcon icon={faUser} />
        </NavLink>
      </nav>
    </div>
  );

  // TODO: notification and profile links show the same color - will be resolved after they are implemented
  function NavLink({ to, title, children }) {
    const isActive = location.pathname === to;
    const className = `nav-button ${isActive ? "active" : ""}`;

    return (
      <Link to={to} className={className} title={title}>
        {children}
      </Link>
    );
  }
};

export default Navbar;
