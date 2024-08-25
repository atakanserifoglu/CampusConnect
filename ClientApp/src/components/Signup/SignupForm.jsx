import "./SignupForm.css";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const nameMes = "NAME";
const surnameMes = "SURNAME";
const mailMes = "EMAIL";
const passMes = "PASSWORD";
const confirmMes = "CONFIRM PASSWORD";
const signupButton = "SIGN-UP";

const SignupForm = (props) => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredLastName, setEnteredLastName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredPConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const nameChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };
  const lastNameChangeHandler = (event) => {
    setEnteredLastName(event.target.value);
  };

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);

    // Validation for email
    const emailPattern = /bilkent\.edu\.tr$/;
    if (!emailPattern.test(event.target.value)) {
      setEmailError("Please use a valid Bilkent University email address.");
    } else {
      setEmailError("");
    }
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);

    // Validation for password
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordPattern.test(event.target.value)) {
      setPasswordError(
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 8 characters long."
      );
    } else {
      setPasswordError("");
    }
  };

  const passwordConfirmChangeHandler = (event) => {
    setEnteredPConfirmPassword(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault(); // prevents page reload, Delete after DB Connection

    // Password confirmation check
    if (enteredPassword !== enteredConfirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if(emailError !== "") {
      alert("You must use bilkent mail");
      return;

    }
    const userData = {
      firstname: enteredName,
      lastname: enteredLastName,
      email: enteredEmail,
      password: enteredPassword,
      confirmpassword: enteredConfirmPassword,
    };
    console.log(userData);

    const apiUrl = "https://bilcampusconnect.azurewebsites.net/api/Auth/Register";

    // Send a POST request to the API
    axios
      .post(apiUrl, userData)
      .then((response) => {
        if (response.status === 200) {
         
  
          // Redirect to the dashboard
          navigate("/");
        } else {
          // Handle other response status codes as needed
          console.error("signup failed:", response.status);
          window.alert(
            "signup failed. Please check your credentials and try again."
          );
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Signup failed:", error);
        // You can show an error message to the user or take appropriate action.
      });
  };

  return (
    <form className="signin-form" onSubmit={submitHandler}>
        <div className="singup-form-control">
          <label htmlFor="name" className="signup-form-identifier">
            {nameMes}
          </label>
          <input
            className="signup-form-input"
            type="text"
            id="name"
            placeholder="Name"
            onChange={nameChangeHandler}
            value={enteredName}
          />
        </div>
        <div className="singup-form-control">
          <label htmlFor="lastname" className="signup-form-identifier">
            {surnameMes}
          </label>
          <input
            className="signup-form-input"
            type="text"
            id="name"
            placeholder="Surname"
            onChange={lastNameChangeHandler}
            value={enteredLastName}
          />
        </div>
      <div className="singup-form-control">
        <label htmlFor="name" className="signup-form-identifier">
          {mailMes}
        </label>
        <input
          className="signup-form-input"
          type="text"
          id="email"
          placeholder="yourmail@bilkentdomain"
          onChange={emailChangeHandler}
          value={enteredEmail}
        />
        {/* {emailError && <p className="error">{emailError}</p>} */}
      </div>
      <div className="singup-form-control">
        <label htmlFor="name" className="signup-form-identifier">
          {passMes}
        </label>
        <input
        className="signup-form-input"
          type="password"
          id="password"
          placeholder="password"
          onChange={passwordChangeHandler}
          value={enteredPassword}
        />
        {passwordError && <p className="error">{passwordError}</p>}
      </div>
      <div className="singup-form-control">
        <label htmlFor="name" className="signup-form-identifier">
          {confirmMes}
        </label>
        <input
          className="signup-form-input"
          type="password"
          id="password_confirm"
          placeholder="password again"
          onChange={passwordConfirmChangeHandler}
          value={enteredConfirmPassword}
        />
      </div>
      <div className="signup-form-actions">
        <button>
          <div className="button-text">{signupButton}</div>
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
