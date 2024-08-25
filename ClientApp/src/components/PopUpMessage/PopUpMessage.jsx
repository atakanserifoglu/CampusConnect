// Messages.jsx
import React, { useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useEffect, useRef } from "react";

import "./PopUpMessage.css";

const Popup = ({onClose, sendTo }) => {


    const [newConnection, setConnection] = useState(null);
    const [newMessage, setNewMessage] = useState({
        senderUserId: "",
        receiverUserId: "",
        message: "",
      });
  
      const formRef = useRef(null);

      var user = localStorage.getItem('user');
      var userId = JSON.parse(user)?.id;
    
      const handleOutsideClick = (e) => {
        console.log("handleOutsideClick");
        if (formRef.current && !formRef.current.contains(e.target)) {
          console.log("INSIDE handleOutsideClick");
          onClose();
        }
      };
      useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
    
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
      }, []);
  
    useEffect(() => {
        console.log("userId", userId);
        const newConnection = new signalR.HubConnectionBuilder()
          .configureLogging(signalR.LogLevel.Debug)
          .withUrl(`wss://bilcampusconnect.azurewebsites.net/chatHub?userId=${userId}`, {
            accessTokenFactory: () => `${localStorage.getItem("yourAuthTokenKey")}`,
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
          })
          .build();
    
        // Start the connection
        newConnection
          .start()
          .then(() => {
            console.log("Connection started");
            // Enable the send button after the connection is established
          })
          .catch((err) => console.error("ZOROROROROROROT:", err));

          newConnection.on("ReceiveMessageBySpesificUser", (message) => {
            console.log("ReceiveMessageBySpesificUser");
            // Handle the received message
            console.log(message);
            
          });
    
        // Save the connection in state
        setConnection(newConnection);
    
        // Cleanup when component unmounts
        return () => {
          if (newConnection) {
            newConnection.stop();
          }
        };
      }, []); // Run this effect only once on component mount

      const sendMessage = (param) => {
        console.log("sending from", userId );
        console.log("sending to", sendTo );
        console.log(signalR.HubConnectionState.Connected);
        if (newConnection) {
          console.log("Sending message:  " + param.message);
          newConnection
            .invoke(
              "SendMessageToSpesificUser",
              `${userId}`,
              `${sendTo}`,
              param.message,
            )
            .then(() => console.log("Message sent!"))
            .catch((err) => console.error("Error while sending message:", err));
        } else {
          console.error("Connection is not ready yet.");
        }
      };

  const handleClose = async() => {
    sendMessage(newMessage);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    onClose();
  }
  return (
    <div className="popup">
      <div className="popup-content"  ref={formRef}>
        <h3>Send a Message</h3> {/* Title */}
        <p>Please write your message below and hit 'Send' when you're ready.</p> {/* Instruction */}
        <textarea 
          className="message-textarea"
          placeholder="Write your message here..." 
          value={newMessage.message}
          onChange={(e) =>
            setNewMessage((prevMessage) => ({
              ...prevMessage,
              message: e.target.value,
            }))
          }
        />
        <div className="popup-buttons">

          <button className="close-button" onClick={handleClose}>Send</button> {/* Close Button */}
        </div>
      </div>
    </div>
  );
  };


export default Popup;