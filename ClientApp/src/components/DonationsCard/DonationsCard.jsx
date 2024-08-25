import React, { useState } from "react";
import "./DonationsCard.css";
import imageSource from "../../assets/image_filler.png";
import { FaEnvelope, FaHandHoldingUsd, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../utilities/axiosConfig.jsx";
import Popup from "../PopUpMessage/PopUpMessage";

export const DonationsCard = ({
  id,
  owner,
  header,
  description,
  date,
  isDashboard,
  title,
  image
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const contact = "CONTACT";
  const donate = "DONATED";
  const donations = "DONATIONS";
  const user = localStorage.getItem("user");
  const userId = JSON.parse(user)?.id;

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

  const donateItem = async (id) => {
    try {
      const response = await api.delete(`/DonationItem/Delete?id=${id}`);
      // Handle the response here
      console.log(response);
    } catch (error) {
      console.error("Error deleting item", error);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.location.reload();
  };

  return (
    <div className="donations-card card-margin">
      <div className="donations-card-image">
        <span className="donations-tag">
          <div className="donations-tag-text">{donations}</div>
          <div className="donations-tag-icon">
            <FaHandHoldingUsd/>
          </div>
        </span>
        <span
          style={{ color: isPopupOpen ? " #250E3D" : "white" }}
          className="donations-heart-icon"
        >
          <FaHeart/>
        </span>
        {userId != owner && (
          <button
            className="donations-contact-button"
            onClick={handleContactClick}
          >
            <div className="donations-contact-button-icon">
              <FaEnvelope/>
            </div>
            <div className="donations-contact-button-text">{contact}</div>
          </button>
        )}
        {isDashboard && (
          <button
            className="donations-contact-button"
            onClick={() => donateItem(id)}
          >
            <div className="donations-contact-button-icon">
              <FaEnvelope/>
            </div>
            <div className="donations-contact-button-text">{donate}</div>
          </button>
        )}
        <img src={image} alt="Product" className="donations-image" />
      </div>
      <Link to={`/donation-product/${id}`} className="sales-card-link">
        <div className="donations-card-content">
          <div className="donations-product-name">{title.length > 35 ? title.substring(0,30) + "..." : title}</div>
          <div className="donations-description">{description.length > 40 ? description.substring(0,35)+"..." : description}</div>
        </div>
        <div className="donations-card-footer">
          <span className="donations-date">{date}</span>
        </div>
      </Link>
      {isPopupOpen && <Popup onClose={onPopupClose} sendTo={owner} />}
    </div>
  );
};
