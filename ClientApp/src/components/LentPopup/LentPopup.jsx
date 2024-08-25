// Messages.jsx
import React, { useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import api from "../../utilities/axiosConfig.jsx";

import "./LentPopup.css";

const LentPopup = ({ onClose, chats, itemId }) => {
  const formRef = useRef(null);

  var user = localStorage.getItem("user");
  var userId = JSON.parse(user)?.id;
  const [chosen, setChosen] = useState("");

  const handleClose = async () => {
    try {
        const response = await api.get(`/LendItem/LendItemToUser?lenderId=${userId}&lendeeId=${chosen}&itemId=${itemId}`);
        // Handle the response here
        console.log(response);
      } catch (error) {
        console.error('Error adding item', error);
      }
      
    onClose();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.location.reload();
  };

  const handleSelection = (event) => {
    console.log(event.target.value);
    setChosen(event.target.value);
    // onClose();
  };

  const handleOutsideClick = (e) => {
    console.log("handleOutsideClick");
    if (formRef.current && !formRef.current.contains(e.target)) {
      console.log("INSIDE handleOutsideClick");
      onClose();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="popup">
      <div className="popup-content" ref={formRef}>
        <h3>Lend your Item</h3> {/* Title */}
        <p>Please select who you lent the following item</p> {/* Instruction */}
        <select onChange={handleSelection}>
        <option value="" disabled selected>Select an option...</option>
          {chats.map((chat) => (
            <option key={chat.id} value={chat.users.$values[1].id}>
              {chat.users.$values[1].name}
            </option>
          ))}
        </select>
        <div className="popup-buttons">
          <button className="close-button" onClick={handleClose}>
            Lend
          </button>{" "}
          {/* Close Button */}
        </div>
      </div>
    </div>
  );
};

export default LentPopup;
