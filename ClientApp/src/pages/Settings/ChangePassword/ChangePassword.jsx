// ChangePasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './ChangePassword.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../auth/auth.js';
import { useNavigate } from 'react-router-dom';

const header = "Change Password";
const old =  "Current Password";
const newPass = "New Password";
const again = "Enter Password Again";


const ChangePassword = () => {

  const navigate = useNavigate();
  const auth = useAuth();


  const [changePasswordData, setChangePasswordData] = useState({
    token: localStorage.getItem('yourAuthTokenKey'),
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async () => {

    try {
      // Add validation logic if needed
      console.log('Changing password', changePasswordData);
      console.log('authtoken:', localStorage.getItem("yourAuthTokenKey"));
      console.log('refreshtoken: ', localStorage.getItem("yourRefreshTokenKey"));
      const response = await axios.post(
        'https://bilcampusconnect.azurewebsites.net/api/Auth/ChangePassword',
        changePasswordData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('yourAuthTokenKey')}`, // Replace with the actual token
          },
        }
      );

      console.log('Password changed successfully', response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Token is invalid or expired');
        // Token is invalid or expired, attempt to refresh
        try {
          console.log('Attempting to refresh token');
          console.log('authtoken:', localStorage.getItem("yourAuthTokenKey"));
          console.log('refreshtoken: ', localStorage.getItem("yourRefreshTokenKey"));
          const refreshResponse = await axios.post(
            'https://bilcampusconnect.azurewebsites.net/api/Auth/Refresh',
            {
              accessToken: localStorage.getItem('yourAuthTokenKey'),
              refreshToken:  localStorage.getItem("yourRefreshTokenKey"),
            },
          );

          console.log('Refresh successful', refreshResponse.data);
          console.log('new token: ', refreshResponse.data.jwtToken);
          var refreshedToken = refreshResponse.data.jwtToken;

          // Store the new token in local storage
          localStorage.setItem("yourAuthTokenKey", refreshedToken);
          changePasswordData.token = refreshedToken;

          // Retry the original request
          return await handleChangePassword(); 

        } catch (refreshError) {

          console.error('Error refreshing token', refreshError);
          // Logout the user and navigate to the login page
          logoutFunction();
        }
      } else {
        // Other error, handle accordingly
        console.error('Error changing password', error);
      }
    }
  };

  const logoutFunction = () => {
    console.log("Logout");
     auth.logout(); // Redirect to the dashboard
     navigate("/");
  };

  return (
    <div className="change-password-container">
    
         <Link to="/settings">
          <button>Go Back</button>
        </Link>
        
      <div className='header-font'>{header}</div>
      <form>
        <label>{old}</label>
        <input
          type="password"
          value={changePasswordData.currentPassword}
          onChange={(e) =>
            setChangePasswordData({
              ...changePasswordData,
              currentPassword: e.target.value,
            })
          }
        />
        
        <label>{newPass}</label>
        <input
          type="password"
          value={changePasswordData.newPassword}
          onChange={(e) =>
            setChangePasswordData({
              ...changePasswordData,
              newPassword: e.target.value,
            })
          }
        />

        <label className='form-identifier'>{again}</label>
        <input
          type="password"
          value={changePasswordData.confirmPassword}
          onChange={(e) =>
            setChangePasswordData({
              ...changePasswordData,
              confirmPassword: e.target.value,
            })
          }
        />

        <button type="button" onClick={handleChangePassword}>
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;


