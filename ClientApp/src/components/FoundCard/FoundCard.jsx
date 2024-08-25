import React, { useState } from "react";
import "./FoundCard.css";
import Popup from "../PopUpMessage/PopUpMessage";

import { FaEnvelope, FaSearch, FaHeart } from "react-icons/fa";

import { Link } from "react-router-dom";

export const FoundCard = ({ id, title, description, date, image, owner }) => {

  const contact = "CONTACT";
  const tag = "FOUND";

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const onPopupClose = () => {
    closePopup(); 
  }

  const handleContactClick = () => {
      openPopup();
      console.log("Contact button clicked");
  };

  return (
    <div className="found-card card-margin">
        <div className="found-card-image">
          <span className="found-tag">
            <div className="found-tag-text">{tag}</div>
            <div className="found-tag-icon">
              <FaSearch/>
            </div>
          </span>
          <span
            style={{ color: isPopupOpen ? " #250E3D" : "white" }}
            className="found-heart-icon"
          >
            <FaHeart />
          </span>
          <button className="found-contact-button">
            <div className="found-contact-button-icon">
              <FaEnvelope />
            </div>
            <div className="found-contact-button-text" onClick={handleContactClick}>{contact}</div>
          </button>
          <img src={image} alt="Product" className="found-image" />
        </div>
        <Link to={`/found-product/${id}`} className="found-card-link">
        <div className="found-card-content">
          <div className="found-title">{title.length > 35 ? title.substring(0,30) + "..." : title}</div>
          <div className="found-description">{description.length > 40 ? description.substring(0,35) + "..." : description}</div>
        </div>

        <div className="found-card-footer">
          <span className="found-date">{date}</span>
        </div>
      </Link>
      {isPopupOpen && (
        <Popup onClose={onPopupClose} sendTo={owner} />
      )}
    </div>
  );
};
