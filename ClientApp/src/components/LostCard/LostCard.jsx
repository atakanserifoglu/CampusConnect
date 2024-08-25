import React, { useState } from "react";
import "./LostCard.css";
import Popup from "../PopUpMessage/PopUpMessage";

import { FaEnvelope, FaQuestionCircle, FaHeart } from "react-icons/fa";

import { Link } from "react-router-dom";

export const LostCard = ({ id, title, description, date, image, owner }) => {

  const contact = "CONTACT";
  const tag = "LOST";

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
    <div className="lost-card card-margin">
        <div className="lost-card-image">
          <span className="lost-tag">
            <div className="lost-tag-text">{tag}</div>
            <div className="lost-tag-icon">
              <FaQuestionCircle/>
            </div>
          </span>
          <span
            style={{ color: isPopupOpen ? " #250E3D" : "white" }}
            className="lost-heart-icon"
          >
            <FaHeart />
          </span>
          <button className="lost-contact-button">
            <div className="lost-contact-button-icon">
              <FaEnvelope />
            </div>
            <div className="lost-contact-button-text" onClick={handleContactClick}>{contact}</div>
          </button>
          <img src={image} alt="Product" className="lost-image" />
        </div>
        <Link to={`/lost-product/${id}`} className="lost-card-link">
        <div className="lost-card-content">
          <div className="lost-title">{title.length > 35 ? title.substring(0,30) + "..." : title}</div>
          <div className="lost-description">{description.length > 40 ? description.substring(0,35) + "..." : description}</div>
        </div>

        <div className="lost-card-footer">
          <span className="lost-date">{date}</span>
        </div>
      </Link>
      {isPopupOpen && (
        <Popup onClose={onPopupClose} sendTo={owner} />
      )}
    </div>
  );
};
