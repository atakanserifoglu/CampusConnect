import React, { useState } from "react";

import Popup from "../PopUpMessage/PopUpMessage";
import api from "../../utilities/axiosConfig.jsx";

import { FaEnvelope, FaShoppingBag, FaHeart } from "react-icons/fa";

import { Link } from "react-router-dom";

var user = localStorage.getItem("user");
var userId = JSON.parse(user)?.id;

export const BorrowCard = ({
  id,
  title,
  price,
  description,
  date,
  image,
  owner,
  header,
  isDashboard,
  navLink,
  remainingDays
}) => {
  const contact = "CONTACT";
  const deleteText = "SOLD";
  const sales = "BORROWED";

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const dispayDate = () => {
    console.log(remainingDays);
  };

  const onPopupClose = () => {
    closePopup();
  };

  const handleContactClick = () => {
    openPopup();
    console.log("Contact button clicked");
  };

  const sellItem = async (id) => {
    try {
      const response = await api.delete(`SalesItem/Delete?id=${id}`);
      // Handle the response here
      console.log(response);
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  return (
    <div className="sales-card card-margin" onClick={dispayDate}>
      <div className="sales-card-image">
        <span className="sales-tag">
          <div className="sales-tag-text">{sales}</div>
        </span>
        <span
          // onClick={togglePopup}
          style={{ color: isPopupOpen ? " #250E3D" : "white" }}
          className="sales-heart-icon"
        >
          <FaHeart />
        </span>
        
        
        <img src={image} alt="Product" className="sales-image" />
      </div>
      <Link to={`/borrow-product/${id}`} className="sales-card-link">
        <div className="sales-card-content">
          <div className="sales-price-text">{title.length > 35 ? title.substring(0,30) + "..." : title}</div>
          <div className="sales-description">{description}</div>
        </div>

        <div className="lending-card-footer">
          {
            console.log(remainingDays)
          }  
          <span className="lending-date">{remainingDays} DAYS REMAINING</span>
        
        </div>
      </Link>
      
    </div>
  );
};

export default BorrowCard;
