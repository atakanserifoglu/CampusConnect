// SettingsPage.js
import React from "react";
import { Link } from "react-router-dom";
import SettingsCard from "../../components/SettingsCard/SettingsCard.jsx";
import "./Settings.css";
import { useAuth } from "../../auth/auth.js";
import { useNavigate } from "react-router-dom"; 

const header = "Settings";
const titleNotification = "Notifications";
const descriptionNotification =
  "You will be notified by your Bilkent mail for important issues.";
const titlePassword = "Manage Your Password";
const descriptionPassword = "Review and modify your password.";
const titleAcc = "Settings About Your Account";
const descAcc = "Review details about your account";

const Settings = () => {
  const navigate = useNavigate();
  const auth = useAuth();


  const logoutFunction = () => {
    console.log("Logout");
     auth.logout(); // Redirect to the dashboard
     navigate("/");
  };

  
  return (
    <div className="settings-container">
      <div className="header-font">{header}</div>
      <div className="settings-page-card">
        <div>
          <SettingsCard
            cardTitle={titleNotification}>
            <div className="description-notification">{descriptionNotification}</div>
          </SettingsCard>
        </div>
        <div>
          <SettingsCard
            cardTitle={titlePassword}
            cardDescription={descriptionPassword}
          >
            <div className="options-container">
              <Link to="/settings/change-password">
                <button>Change Password</button>
              </Link>
            </div>
          </SettingsCard>
        </div>
        <div>
          <SettingsCard
            cardTitle={titleAcc}
            cardDescription={descAcc}
          >
            <div className="options-container">
              <Link to="/settings/delete-user">
                <button>Delete User</button>
              </Link>
            </div>
            <div>
              <button
                onClick={logoutFunction}>
                Logout
              </button>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
};

export default Settings;
