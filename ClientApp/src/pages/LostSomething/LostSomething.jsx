import React, { useState, useEffect } from "react";
import "./LostSomething.css";
import add from "../../assets/add.svg";
import api from "../../utilities/axiosConfig.jsx";
import { useNavigate } from "react-router-dom";
const header = "Lost/Found Item";
const categoryMes = "Choose the category";
const selectMes = "Choose whether you have found or lost someting.";
const lostMes = "Lost";
const foundMes = "Found";
const detailMes = "Details";
const detailsDesc = "Provide details about the item.";
const addMes = "Add Item";
const picMes = "Pictures";
const picDes = "Provide visuals for your item. You can add up to 5.";


function ItemForm() {
    const navigate = useNavigate();
  // TODO: Delete console statement
  console.log("ItemForm component is mounted");
  const [itemTitle, setItemTitle] = useState("");
  const [listDate, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("lost"); // default to 'lost'
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  var user = localStorage.getItem("user");
  var userId = JSON.parse(user)?.id;

  // Log the form state to the console whenever it changes
  useEffect(() => {
    console.log({ itemTitle, date: listDate, description, category });
  }, [itemTitle, listDate, description, category]);

  const handleSubmit = async (event, item) => {
    event.preventDefault();
    var lostOrFound = "LostItem";
    if (category != "lost") {
      lostOrFound = "FoundItem";
    }
    // Create FormData
    const formData = new FormData();

    // Add other form data
    formData.append("userId", userId);
    formData.append("title", itemTitle);
    formData.append("description", description);
    formData.append("itemType", 0);

    selectedPhotos.forEach((photo, index) => {
      formData.append("imageFile", photo);
    });

    try {
      const response = await api.post(
        `/${lostOrFound}/Add`, formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Handle the response here
      console.log(response);
    } catch (error) {
      console.error("Error adding item", error);
    }

    console.log("Form submitted:", {
      itemTitle,
      date: listDate,
      description,
      category,
    });

    navigate("/all-found-items");
  };

  const handleFileClick = () => {
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
    <>
      <div className="header-font">{header}</div>
      <form onSubmit={handleSubmit} className="item-form">
        <div className="item-form-title">{categoryMes}</div>
        <div className="select-row-message">
          <div className="item-form-description">{selectMes}</div>
          <div className="category-buttons">
            <button
              type="button"
              className={`category-button ${
                category === "lost" ? "active" : ""
              }`}
              onClick={() => setCategory("lost")}
            >
              <div
                className={`category-button-text ${
                  category === "lost" ? "active" : ""
                }`}
              >
                {lostMes}
                {category === "found" ? <span>&nbsp;&nbsp;</span> : null}
              </div>
            </button>
            <button
              type="button"
              className={`category-button ${
                category === "found" ? "active" : ""
              }`}
              onClick={() => setCategory("found")}
            >
              <div
                className={`category-button-text ${
                  category === "found" ? "active" : ""
                }`}
              >
                {foundMes}
              </div>
            </button>
          </div>
        </div>
        <div className="lost-horizontal-line"></div>
        <div className="input-group">
          <div className="item-form-title">{detailMes}</div>
          <div className="item-form-description">{detailsDesc}</div>
          <input
            type="text"
            className="input-title-text"
            value={itemTitle}
            onChange={(e) => setItemTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <input
            type="date"
            value={listDate}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <textarea
            value={description}
            className="input-title-text"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Give information about the condition, properties of the item..."
          ></textarea>
        </div>
        <div className="lost-horizontal-line"></div>
        <div className="item-form-title">{picMes}</div>
        <div className="item-form-description">{picDes}</div>
        <div className="lost-image-upload-container">
          {selectedPhotos.length < 5 &&
            [...Array(5 - selectedPhotos.length)].map((_, index) => (
              <div
                key={index}
                className="lost-image-upload-square"
                onClick={handleFileClick}
              >
                <img src={add} alt="Add Photo" className="add-photo-image" />
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
        <input
          type="file"
          id="fileInput" // Use id attribute here
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }} // Hide the file input
        />
        <button type="submit" className="submit-button">
          <div className="submit-button-text">{addMes}</div>
        </button>
      </form>
    </>
  );
}

export default ItemForm;
