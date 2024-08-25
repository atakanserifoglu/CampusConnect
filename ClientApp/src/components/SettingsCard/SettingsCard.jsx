import React from "react";
import "./SettingsCard.css";

const NotificationCard = ({cardTitle, cardDescription, children}) => {
  return (
    <div className="settings-card">
      <div className="card-title">{cardTitle}</div>
      <div className="card-description">{cardDescription}</div>
      <hr className="horizontal-line"/>
      {children}
    </div>
  );
};

export default NotificationCard;
