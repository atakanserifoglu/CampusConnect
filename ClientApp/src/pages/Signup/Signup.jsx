import SignupForm from "../../components/Signup/SignupForm";
import loginLogo from "../../assets/login-logo.png";
import bilkentLogo from "../../assets/bilkent-logo.png";
import "./Signup.css";

import { NavLink } from 'react-router-dom';

const signupText = "Let\'s sign you up to Bilkent University\'s social marketplace...";

const Signup = () => {
  return (
    <>
      <div className="pagecontainer">
        <div className="signup-leftpart">
          <div className="signup-logo-container">
            <img src={loginLogo} alt="login logo" className="loginlogo" />
          </div>
          <div className="container-left">
            <div className="signup-welcome-text">
              Welcome to
              <br />
              CampusConnect!
            </div>
            <div className="signup-bilkent-container">
              <img
                src={bilkentLogo}
                alt="bilkent logo"
                className="signup-bilkentlogo"
              />
              <div className="signup-bilkent-text">Bilkent University</div>
            </div>
          </div>
        </div>
        <div className="rightpart">
          <div className="signup-right-text">{signupText}</div>
          <SignupForm />
          <div className="signup-container">
            <div className="dont-have-account">Already have an account?</div>
            <NavLink to='/'>
            <div className="signup-text">Login.</div>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
