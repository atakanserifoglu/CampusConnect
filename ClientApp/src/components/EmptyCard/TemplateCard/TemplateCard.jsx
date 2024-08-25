import React, { useState, useEffect } from "react";
import "./TemplateCard.css";
import PropTypes from "prop-types";
import addImage from "../../../../src/assets/add.svg";
import api from "../../../utilities/axiosConfig.jsx";

const TemplateCard = ({FormComponent, AddFunction}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const addItem = async (item) => {

    for (const [key, value] of item.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    try {
      const response = await api.post(AddFunction, item, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      // Handle the response here
      console.log(response);
    } catch (error) {
      console.error('Error adding item', error);
    }
  }
  const [setItems] = useState([]);

  return (
    <div className="dynamic-card card-margin" onClick={openPopup}>
      {isPopupOpen && (
        <FormComponent onClose={closePopup} onAddItem={addItem} />
      )}
      <img className="dynamic-add-card" src={addImage} alt="Add placeholder."/>
    </div>
  );
};

// Prop type validation
TemplateCard.propTypes = {
  FormComponent: PropTypes.elementType.isRequired,
};

export default TemplateCard;