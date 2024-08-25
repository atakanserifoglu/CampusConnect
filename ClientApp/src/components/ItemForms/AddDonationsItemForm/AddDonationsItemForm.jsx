import React, { useState, useRef, useEffect } from "react";
import "./AddDonationsItemForm.css";
import ITEM_TYPES from "../../../utilities/ItemTypes";
import add from "../../../assets/add.svg";
 
const headerMes = "Add Donations Item";
const detailsMes = "Details";
const detailsDes = "Provide details about your item.";
const picMes = "Pictures";
const picDes = "Provide visuals for your item. You can add up to 5 photos.";
const addMes = "Add Item";
var user = localStorage.getItem('user');
var userId = JSON.parse(user)?.id;

function AddDonationsItemForm({ onClose, onAddItem }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [header, setHeader] = useState("");
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

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("user: " , user);
   
    // Create FormData
    const formData = new FormData();

    // Add other form data
    formData.append("owner", userId);
    formData.append("title", title);
    formData.append("header", header);
    formData.append("description", description);
    formData.append("userId", user.id);
    formData.append("itemType", ITEM_TYPES.SALES);

    // Add images to FormData
    selectedPhotos.forEach((photo, index) => {
      formData.append("imageFile", photo);
    });

    onAddItem(formData);
    onClose();
    console.log('Form submitted:', { title, description});
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
    <div className="popup">
      <div className="donations-popup-inner" ref={formRef}>
        <div className='donations-form-title'>{headerMes}</div>
        <div className='donations-form-lost-horizontal-line'></div>
          <form onSubmit={handleSubmit}>
            <div className='donations-form-mes'>{detailsMes}</div>
            <div className='donations-form-desc'>{detailsDes}</div>
            <div className='input-group'>
              <div className="donation-dropdown-item" onClick={toggleDropdown}>
                <div className="donation-dropdown-text-item">{header==="" ? "Select Type" : header}</div>
                {isDropdownOpen && (
                <div className="donation-dropdown-content-item">
                    <a href="#" onClick={() => handleSelect('Book')}>Book</a>
                    <a href="#" onClick={() => handleSelect('Technology')}>Technology</a>
                    <a href="#" onClick={() => handleSelect('Other')}>Other</a>
                </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
              />
              <textarea
                value={description}
                placeholder="Give information about the condition, properties of the item..."
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={500}
              ></textarea>
              <div className='donations-form-lost-horizontal-line'></div>
              <div className='donations-form-mes'>{picMes}</div>
              <div className='donations-form-desc'>{picDes}</div>
              <div className="image-upload-container">
                {selectedPhotos.length < 5 &&
                  [...Array(5 - selectedPhotos.length)].map((_, index) => (
                    <div
                      key={index}
                      className="image-upload-square"
                      onClick={handleFileClick}>
                        <img src={add} alt="Add Photo" className='add-photo-image' />
                    </div>
                  ))}
                {selectedPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(photo)}
                    alt={`Uploaded ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <input
            type="file"
            id="fileInput" // Use id attribute here
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the file input
          />
          <button type="submit" className="donations-form-submit-button">
            <div className='donations-form-submit-button-text'>{addMes}</div>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddDonationsItemForm;
