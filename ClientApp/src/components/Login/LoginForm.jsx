import axios from "axios";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {useAuth} from "../../auth/auth.js";

const mailMes = "EMAIL";
const passMes = "PASSWORD";
const loginButton = "LOGIN";
const forgotMes = "Forgot Password?";

const BasicForm = (props) => {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const navigate = useNavigate();
  const auth = useAuth();
  const handleLogin = async (event) => {
    event.preventDefault();
    // Construct the user data
    const userData = {
      email: enteredEmail,
      password: enteredPassword,
    };

    try {
      // Make the API request
      const response = await axios.post(
        "https://bilcampusconnect.azurewebsites.net/api/Auth/Login",
        userData
      );

      if (response.status === 200) {
        const token = response.data.jwtToken;
        const refreshToken = response.data.refreshToken;
        const userID = response.data.id;
        console.log("Login successful:", token);
        console.log("Login successful:", refreshToken);

        // Store the token in local storage
        localStorage.setItem("yourAuthTokenKey", token);
        localStorage.setItem("yourRefreshTokenKey", refreshToken);

        userData.id = userID;
        auth.login(userData);
        // Redirect to the dashboard
        navigate("/dashboard");
      } else {
        // Handle other response status codes as needed
        console.error("Login failed:", response.status);
        window.alert(
          "Login failed. Please check your credentials and try again."
        );
      }
    } catch (error) {
      // Handle network errors or other issues
      console.error("Login failed:", error);
      window.alert("dbde yok.");
    }
  };

  return (
    <form className="login-form">
      <div className="login-form-control">
        <label htmlFor="password" className="login-form-identifier">
          {mailMes}
        </label>
        <input
          className="login-form-input"
          type="text"
          id="email"
          placeholder= "yourmail@bilkentdomain"
          onChange={emailChangeHandler}
          value={enteredEmail}
        />
      </div>
        <div className="login-form-control">
          <label htmlFor="password" className="login-form-identifier">
            {passMes}
          </label>
          <input
            className="login-form-input"
            type="password"
            id="name"
            placeholder= "password"
            onChange={passwordChangeHandler}
            value={enteredPassword}
          />
          <div className="forgot-password">{forgotMes}</div>
        </div>
      <div className="login-form-actions">
        <button onClick={handleLogin}>
          <div className="button-text">{loginButton}</div>
        </button>
      </div>
    </form>
  );
};

export default BasicForm;
