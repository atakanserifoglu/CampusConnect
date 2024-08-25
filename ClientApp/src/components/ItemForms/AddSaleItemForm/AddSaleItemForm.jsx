import React, { useState, useRef, useEffect } from "react";

import Dropdown from "react-bootstrap/Dropdown";

import "./AddSaleItemForm.css";
import ITEM_TYPES from "../../../utilities/ItemTypes";
import add from "../../../assets/add.svg";

const headerMes = "Add Sales Item";
const detailsMes = "Details";
const detailsDes = "Provide details about your item.";
const priceMes = "Price";
const priceDes = "Enter the price of the item.";
const picMes = "Pictures";
const picDes = "Provide visuals for your item. You can add up to 5 photos.";
const addMes = "Add Item";

function AddSaleItemForm({ onClose, onAddItem }) {
  const [title, setTitle] = useState("");
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formRef = useRef(null);

  var user = localStorage.getItem("user");
  var userId = JSON.parse(user)?.id;

  const handleOutsideClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSelect = (eventKey) => {
    setHeader(eventKey);
    console.log(eventKey);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("user: ", user);

    // Create FormData
    const formData = new FormData();

    // Add other form data
    formData.append("owner", userId);
    formData.append("header", header);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("userId", user.id);
    formData.append("itemType", ITEM_TYPES.SALES);
    // formData.append(`imageFile`, selectedPhotos[0]);

    // Add images to FormData
    // selectedPhotos.forEach((photo, index) => {
    //   formData.append(`imageFile[${index}]`, photo);
    // });
    selectedPhotos.forEach((photo, index) => {
      formData.append("imageFile", photo);
    });

    onAddItem(formData);
    onClose();
    console.log("Form submitted:", { title, description, price });
  };

  const handleFileClick = () => {
    // When a square is clicked, open the file input dialog
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    if (selectedPhotos.length + filesArray.length > 5) {
      alert("You can upload up to 5 photos.");
    } else {
      setSelectedPhotos([...selectedPhotos, ...filesArray]);
    }
  };

  return (
    <div className="sales-popup">
      <div className="sales-popup-inner" ref={formRef}>
        <div className="sales-form-title">{headerMes}</div>
        <div className="sales-form-lost-horizontal-line"></div>

        <form onSubmit={handleSubmit} >
          
            <div className="sales-form-mes">{detailsMes}</div>
            <div className="sales-form-desc">{detailsDes}</div>
            <div className="sales-input-group">
              <div className="sales-center-container">
                <div className="sales-dropdown-item" onClick={toggleDropdown}>
                  <div className="sales-dropdown-text-item">{header==="" ? "Select Type" : header}</div>
                  {isDropdownOpen && (
                  <div className="sales-dropdown-content-item">
                      <a href="#" onClick={() => handleSelect('Book')}>Book</a>
                      <a href="#" onClick={() => handleSelect('Technology')}>Technology</a>
                      <a href="#" onClick={() => handleSelect('Other')}>Other</a>
                  </div>
                  )}
                </div>
              </div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
              <textarea
                value={description}
                placeholder="Give information about the condition, properties of the item..."
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                required
              ></textarea>
              {/* <div className="sales-form-lost-horizontal-line"></div> */}
            </div>
            <div className="sales-form-mes">{priceMes}</div>
            <div className="sales-form-desc">{priceDes}</div>
            <input
              type="text"
              placeholder="TL"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <div className="sales-form-lost-horizontal-line"></div>
            <div className="sales-form-mes">{picMes}</div>
            <div className="sales-form-desc">{picDes}</div>
            <div className="sales-center-container"></div>
            <div className="image-upload-container">
              {selectedPhotos.length < 5 &&
                [...Array(5 - selectedPhotos.length)].map((_, index) => (
                  <div
                    key={index}
                    className="image-upload-square"
                    onClick={handleFileClick}
                  >
                    <img
                      src={add}
                      alt="Add Photo"
                      className="add-photo-image"
                    />
                  </div>
                ))}
              {selectedPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(photo)}
                  alt={`Uploaded ${index + 1}`}
                />
              ))}
              <input
                type="file"
                id="fileInput" // Use id attribute here
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }} // Hide the file input
              />
            </div>
            <div className="sales-center-container">
              <button type="submit" className="sales-form-submit-button">
                <div className="sales-form-submit-button-text">{addMes}</div>
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default AddSaleItemForm;
