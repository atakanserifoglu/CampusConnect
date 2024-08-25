import React from "react";
import LoginForm from "../../components/Login/LoginForm";
import loginLogo from "../../assets/login-logo.png"
import bilkentLogo from "../../assets/bilkent-logo.png";
import "./Login.css";
import { NavLink } from 'react-router-dom';

const loginHeader = "Login to Bilkent University\'s social marketplace...";

const Login = () => {
  return (
    <>
      <div className="pagecontainer">
        <div className="login-leftpart">
          <div className="login-logo-container">
            <img src={loginLogo} alt="login logo" className="loginlogo" />
          </div>
          <div className="container-left">
            <div className="login-welcome-text">
              Welcome to
              <br />
              CampusConnect!
            </div>
            <div className="login-bilkent-container">
              <img
                src={bilkentLogo}
                alt="bilkent logo"
                className="login-bilkentlogo"
              />
              <div className="login-bilkent-text">Bilkent University</div>
            </div>
          </div>
        </div>
        <div className="rightpart">
          <div className="login-text">{loginHeader}</div>
          <LoginForm />
          <div className="signup-container">
            <div className="dont-have-account">Don’t have an account?</div>
            <NavLink to='/signup'>
            <div className="signup-text">Sign up.</div>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
