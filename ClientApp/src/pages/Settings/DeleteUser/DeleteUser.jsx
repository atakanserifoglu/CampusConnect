// DeleteUserPage.js
import React, { useState } from 'react';
import axios from 'axios';

import './DeleteUser.css';
import { Link } from 'react-router-dom';

const DeleteUser = () => {
  const [deleteUserData, setDeleteUserData] = useState({
    email: '',
    password: '',
  });

  const handleDeleteUser = async () => {
    try {
      // Add validation logic if needed

      const response = await axios.post(
        'https://bilcampusconnect.azurewebsites.net/api/Auth/DeleteUser',
        deleteUserData
      );

      console.log('User deleted successfully', response.data);
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  return (
    <div className="delete-user-container">
        
        <Link to="/settings">
          <button>Go Back</button>
        </Link>
      <h2>Delete User</h2>
      <form>
        <label>Email:</label>
        <input
          type="email"
          value={deleteUserData.email}
          onChange={(e) =>
            setDeleteUserData({
              ...deleteUserData,
              email: e.target.value,
            })
          }
        />

        <label>Password:</label>
        <input
          type="password"
          value={deleteUserData.password}
          onChange={(e) =>
            setDeleteUserData({
              ...deleteUserData,
              password: e.target.value,
            })
          }
        />

        <button type="button" onClick={handleDeleteUser}>
          Delete User
        </button>
      </form>
    </div>
  );
};

export default DeleteUser;
