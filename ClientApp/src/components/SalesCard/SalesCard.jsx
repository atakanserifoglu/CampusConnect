import React, { useState } from "react";
import "./SalesCard.css";
import Popup from "../PopUpMessage/PopUpMessage";
import api from "../../utilities/axiosConfig.jsx";


import { FaEnvelope, FaShoppingBag, FaHeart } from "react-icons/fa";

import { Link } from "react-router-dom";

var user = localStorage.getItem("user");
var userId = JSON.parse(user)?.id;

export const SalesCard = ({
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
}) => {
  const contact = "CONTACT";
  const deleteText = "SOLD";
  const sales = "SALES";

  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
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

    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.location.reload();
  };

  return (
    <div className="sales-card card-margin">
      <div className="sales-card-image">
        <span className="sales-tag">
          <div className="sales-tag-text">{sales}</div>
          <div className="sales-tag-icon">
            <FaShoppingBag />
          </div>
        </span>
        <span
          // onClick={togglePopup}
          style={{ color: isPopupOpen ? " #250E3D" : "white" }}
          className="sales-heart-icon"
        >
          <FaHeart />
        </span>
        {userId != owner && (
          <button className="sales-contact-button" onClick={handleContactClick}>
            <div className="sales-contact-button-icon">
              <FaEnvelope />
            </div>
            <div className="sales-contact-button-text">{contact}</div>
          </button>
        )}
        {isDashboard && (
        
            <button className="sales-contact-button" onClick={() => sellItem(id)}>
              <div className="sales-contact-button-icon">
                <FaEnvelope />
              </div>
              <div className="sales-contact-button-text">{deleteText}</div>
            </button>
            
          
        )}
        <img src={image} alt="Product" className="sales-image" />
      </div>
      <Link to={`/sales-product/${id}`} className="sales-card-link">
        <div className="sales-card-content">
          <div className="sales-price-text">
            {title.length > 35 ? title.substring(0, 30) + "..." : title}
          </div>
          <div className="sales-product-name">{price} TL</div>
          <div className="sales-description">
            {description.length > 40
              ? description.substring(0, 35) + "..."
              : description}
          </div>
        </div>

        <div className="sales-card-footer">
          <span className="sales-date">{date}</span>
        </div>
      </Link>
      {isPopupOpen && <Popup onClose={onPopupClose} sendTo={owner} />}
    </div>
  );
};
