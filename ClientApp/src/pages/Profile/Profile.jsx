import React, { useState, useEffect } from "react";
import './Profile.css';
import axios from "axios";
import { SalesCard } from "../../components/SalesCard/SalesCard.jsx";
import fillerImage from '../../assets/profile-filler.png';
import api from "../../utilities/axiosConfig.jsx";

const header = "Your Profile";
//TODO: Change the description filler to a decent string.
const descriptionFiller = "The user doesn't have any description messages.";
const edit = "Edit Profile Information";
const cannotChange = "Your Bilkent mail address cannot be changed.";
const primary = "Primary Information";
const communication = "Communication Information";
const save = "Save Changes";
const discard = "Discard";
var user = localStorage.getItem('user');
var userId = JSON.parse(user)?.id;

const Profile = () => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState();

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  
  const handleSubmit = async (event, item) => {
    event.preventDefault();
    // Update name and description
    if (newName !== "" && newDescription !== "") {
      setUser({name: newName, email : user?.email, description: newDescription});      //çalışmıyor doğru mu bilmiyorum
      setNewName("");
      setNewDescription("")
    }
    else  if (newName !== "") {
      setUser({name: newName,email : user?.email, description: user?.description});
      setNewName("")
    }else if (newDescription !== "") {
      setUser({name: user?.name,email : user?.email, description: newDescription});
      setNewDescription("")
    }

    // Add other form data
    console.log("new info submitted=>", {
      prevName : user?.name,
      newName : newName,
      oldDescription : user?.description,
      newDescription: newDescription
    });
  };

  const handleDiscard = () =>{
    setNewDescription("");
    setNewName("")
  }

  useEffect(() => {
    // Fetch product details from your API using Axios
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(
          `/Auth/GetById?id=${userId}`
        );
        console.log("can I get the user", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error getting items", error);
      }

    };

    fetchProductDetails();
  }, []);

  return (
    <div className="profile-page">

      {/* Left Column */}
      <div className="profile-left-column">
        {/* Profile */}
        <div className='profile-header'>{header}</div>
        <div className="profile-avatar-container">
          <div className='profile-avatar'>
            <img src={fillerImage} alt="Profile Avatar" className='profile-avatar'/>
          </div>
        </div>
        <div className='profile-input-container'>
          <div className='profile-input-text'>
            {user?.name !== "" ? user?.name : "User Name (db!)"}
          </div>
        </div>
        <div className='profile-input-container'>
          <div className='profile-input-text'>
            {user?.email !== "" ? user?.email : "user.name@bilkent.edu.tr(db!)"}
          </div>
        </div>
        <div className='profile-input-container'>
          <div className='profile-input-description-text'>
          {user?.description !== "" ? user?.description : descriptionFiller}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="profile-right-column">
          <div className="profile-header-right">{edit}</div>
          <div className="profile-information-header">{primary}</div>
          <div className="profile-text-line"></div>
          <textarea
              type="text"
              className="edit-user-name"
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name Surname"
              value={newName}
              minLength={2}
              maxLength={50}
            ></textarea>
          <textarea
              value={newDescription}
              className="edit-user-description"
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Give information about yourself..."
              maxLength={300}
            ></textarea>
          <div className="profile-information-header">{communication}</div>
          <div className="profile-text-line"></div>
          <div className="mail-container"></div>
          <div className='profile-input-container'>
            <div className='profile-input-text'>
              {user?.email !== "" ? user?.email : "user.name@bilkent.edu.tr(db!)"}
            </div>
          </div>          
          <div className="cannot-change">{cannotChange}</div>
          <div className="profile-button-container">
            <button onClick={handleSubmit}  className="profile-save-changes-button">{save}</button>
            <button className="profile-discard-changes-button" onClick={handleDiscard}>{discard}</button>
          </div>
        </div>
    </div>
  );
};

//name, mail, description, items listed
export default Profile
