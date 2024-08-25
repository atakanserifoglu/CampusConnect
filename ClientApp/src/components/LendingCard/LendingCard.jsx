import React, { useState } from "react";
import "./LendingCard.css";
import imageSource from "../../assets/image_filler.png";
import { FaEnvelope, FaHandshake, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../utilities/axiosConfig.jsx";
import Popup from "../PopUpMessage/PopUpMessage";
import LentPopup from "../LentPopup/LentPopup";

export const LendingCard = ({
  id,
  owner,
  price,
  title,
  description,
  header,
  daysLeft,
  date,
  isDashboard,
  isLent,
  image,
}) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [contactPopup, setContactPopup] = useState(false);
  
  const [chats, setChats] = useState([]);

  const contact = "CONTACT";
  const lend = "LEND";
  const lent = "LENT";
  const isLentTo = "IS LENT";

  const toggleContact = () => {
    setIsContactOpen(!isContactOpen);
  };

  const user = localStorage.getItem("user");
  const userId = JSON.parse(user)?.id;

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const handleContactClick = () => {
    setContactPopup(true);
    console.log("Contact button clicked");
};

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const onPopupClose = () => {
    closePopup();
  };

  const onContactPopupClose = () => {
    setContactPopup(false); 
  };

  const togglePopup = () => {};

  const handleLenderSelection = async (event) => {
    closePopup();
  };

  const lendItem = async (id) => {
    setIsPopupOpen(true);
    try {
      console.log("userId", { id: userId });
      const response = await api.get(`/Chat/GetUserChatRooms?id=${userId}`);
      console.log("rooms got successfully", response.data.$values);
      console.log(
        "rooms got successfully",
        response.data.$values[0].users.$values[0].id
      );
      setChats(response.data.$values);
    } catch (error) {
      console.error("Error getting items", error);
    }

    

    // try {
    //   const response = await api.delete(`/LendItem/Delete?id=${id}`);
    //   // Handle the response here
    //   console.log(response);
    // } catch (error) {
    //   console.error("Error deleting item", error);
    // }
  };

  return (
    <div className="lending-card card-margin">
      <div className="lending-card-image">
        <span className="lending-tag">
          {/* <div className="lending-tag-text">{isLentTo `${}` }</div> */}
          <div className="lending-tag-text">{isLent ? isLentTo : lend}</div>
          <div className="lending-tag-icon">
            <FaHandshake />
          </div>
        </span>
        <span
          onClick={toggleContact}
          style={{ color: isContactOpen ? "red" : "white" }}
          className="lending-verified-icon"
        >
          <FaCheckCircle />
        </span>
         {userId != owner && !isLent &&(
          <button
            className="lending-contact-button"
            onClick={handleContactClick}
          >
            <div className="lending-contact-button-icon">
              <FaEnvelope />
            </div>
            <div className="lending-contact-button-text">{contact}</div>
          </button>
        )} 
         {isDashboard && !isLent &&( 
        <button className="lending-contact-button" onClick={() => lendItem(id)}>
          <div className="lending-contact-button-icon">
            <FaEnvelope />
          </div>
          <div className="lending-contact-button-text">{lent}</div>
        </button>
         )}
        <img src={image} alt="Product" className="lending-image" />
      </div>
      <Link to={`/borrow-product/${id}`} className="sales-card-link">
        <div className="lending-card-content">
          <div className="lending-price">{price}</div>
          <div className="lending-product-name">{title/*.length > 35 ? title.substring(0,30) + "..." : title*/}</div>  
          <div className="lending-description">{description/*.length > 40 ? description.substring(0,35) + "..." : description*/}</div>
          {/* <div className="lending-days-left">{date} days left</div> */}
        </div>
        <div className="lending-card-footer">
          <span className="lending-date">{date}</span>
        </div>
      </Link>

      {contactPopup && (
        <Popup onClose={onContactPopupClose} sendTo={owner} />
      )}

      {isPopupOpen && (
        <LentPopup onClose={handleLenderSelection} chats={chats} itemId={id} />
      )}
    </div>
  );
};
