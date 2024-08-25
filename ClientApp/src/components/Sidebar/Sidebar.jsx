import React, { useState } from "react";
import { useMobile } from "../../mobileContext/mobileContext.jsx";
import {
  FaTh,
  FaRegChartBar,
  FaCommentAlt,
  FaShoppingBag,
  FaExclamationCircle,
  FaHandHoldingHeart,
  FaShoppingBasket,
} from "react-icons/fa";

import { IoIosGitNetwork } from "react-icons/io";

import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const dashboard = "Dashboard";
const messages = "Messages";
const items = "ITEMS";
const allItems = "All Items";
const sales = "Sales";
const lending = "Lending";
const donations = "Donations";
const landf = "LOST & FOUND";
const lostSth = "Lost/Found Item";
const allFound = "All  Lost/Found Items";

const Sidebar = ({ children }) => {
  const [isOpen] = useState(true);
  const { isMobile, showMenu, setMenu } = useMobile();

  const menuItem = [
    {
      path: "/dashboard",
      name: dashboard,
      icon: <FaTh />,
    },
    {
      path: "/messages",
      name: messages,
      icon: <FaCommentAlt />,
    },
    {
      path: "/allitems",
      name: allItems,
      icon: <FaRegChartBar />,
    },
    {
      path: "/sales",
      name: sales,
      icon: <FaShoppingBag />,
    },
    {
      path: "/borrowing",
      name: lending,
      icon: <IoIosGitNetwork />,
    },
    {
      path: "/donations",
      name: donations,
      icon: <FaHandHoldingHeart />,
    },
    {
      path: "/lost-something",
      name: lostSth,
      icon: <FaExclamationCircle />,
    },
    {
      path: "/all-found-items",
      name: allFound,
      icon: <FaShoppingBasket />,
    },
  ];

const togglePopup = () => {
    setMenu(!showMenu);
  }

  return (
    <div className="container">
      <div className={`sidebar ${isMobile ? "close" : ""}`} style={{ display: (isMobile && showMenu) || (!isMobile) ? "block" : "none" }} >
        <div className="top-space" />
        {menuItem.map((item, index) => (
          <div key={index} onClick={togglePopup}>
            <NavLink
              to={item.path}
              className={isOpen ? "link" : "open-link"}
              activeClassName="active"
              exact
            >
              <div className={isOpen ? "icon" : "icon-closed"}>{item.icon}</div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className="link_text"
              >
                {item.name}
              </div>
            </NavLink>
            {item.name === messages && (
              <div
                className="items-container"
                style={{ display: isOpen ? "block" : "none" }}
              >
                {items}
              </div>
            )}
            {item.name === donations && (
              <div
                className="lf-container"
                style={{ display: isOpen ? "block" : "none" }}
              >
                {landf}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* <main>{children}</main> */}
      <div className="main">{children}</div>
    </div>
  );
};

export default Sidebar;
