// Messages.jsx
import React, { useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useEffect } from "react";
import api from "../../utilities/axiosConfig.jsx";
import "./Messages.css";
import Message from "../../components/MessageComponent/Message.jsx";
import notificationImage from "../../assets/notifications.png";
import { FaPaperPlane } from "react-icons/fa";

const noNotificationMessage = "No Notifications Found :(";
const noNotificationsDescription = "You have currently no notifications.";

const Messages = (params) => {
  const [newConnection, setConnection] = useState(null);
  const [chats, setChats] = useState([]);
  const [messagesOfChat, setMessagesOfChat] = useState([]);
  const [selectedChat, setSelectedChat] = useState({});
  const [sendTo, setSendTo] = useState("");
  const [shouldReload, setShouldReload] = useState(true);
  const [newMessage, setNewMessage] = useState({
    senderUserId: "",
    receiverUserId: "",
    message: "",
  });

  var user = localStorage.getItem("user");
  var userId = JSON.parse(user).id;

  const handleChatSelection = async (chat) => {
    console.log("chat id", chat.id);
    setSelectedChat(chat);

    try {
      console.log("chatroomID", { id: userId });
      const response = await api.get(
        `/Chat/GetChatRoomWithUsers?id=${chat.id}`
      );
      console.log("users got successfully");
      if (userId != response.data.data.users.$values[0].id) {
        setSendTo(response.data.data.users.$values[0].id);
      } else {
        setSendTo(response.data.data.users.$values[1].id);
      }
    } catch (error) {
      console.error("Error getting items", error);
    }

    console.log("chat", chat);
  };

  //STARTING CONNECTION TO THE WEB SOCKER
  useEffect(() => {
    console.log("userId", userId);
    const newConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(
        `wss://bilcampusconnect.azurewebsites.net/chatHub?userId=${userId}`,
        {
          accessTokenFactory: () =>
            `${localStorage.getItem("yourAuthTokenKey")}`,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        }
      )
      .build();

    // Start the connection
    newConnection
      .start()
      .then(() => {
        console.log("Connection started");
        // Enable the send button after the connection is established

        newConnection.on("ReceiveMessageBySpesificUser", (message) => {
          console.log("ReceiveMessageBySpesificUser");
          // Handle the received message
          console.log(message);
          // setShouldReload(!shouldReload);
          setMessagesOfChat((prevMessages) => [...prevMessages, message]);
          // console.log("selectedChat", selectedChat);
          // getMessagesOfRoom(selectedChat.id);

          // // Add the received message to the state
          // setMessages((prevMessages) => [...prevMessages, { id: Date.now(), sender: "Friend", text: message }]);
        });
        newConnection.on("ReceiveMessageAll", (message) => {
          console.log("ReceiveMessageAll");
          // Handle the received message
          console.log(message);
          setMessagesOfChat((prevMessages) => [...prevMessages, message]);

          // // Add the received message to the state
          // setMessages((prevMessages) => [
          //   ...prevMessages,
          //   { id: Date.now(), sender: "Friend", text: message },
          // ]);
        });
      })
      .catch((err) => console.error("ZOROROROROROROT:", err));

    // Save the connection in state
    setConnection(newConnection);

    // Cleanup when component unmounts
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []); // Run this effect only once on component mount

  // Time of the user
  const formatTime = (sentDate) => {
    const date = sentDate instanceof Date ? sentDate : new Date(sentDate);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Show the time or not
  const shouldShowTime = (currentIndex) => {
    if (currentIndex === messagesOfChat.length - 1) {
      // Always show for the last message in the list
      return true;
    }
    return (
      messagesOfChat[currentIndex].userId !==
      messagesOfChat[currentIndex + 1].userId
    );
  };

  //GET CHATROOMS OF THE USER
  const getChatrooms = async () => {
    try {
      console.log("userId", userId);
      const response = await api.get(`/Chat/GetUserChatRooms?id=${userId}`);
      console.log("rooms got successfully", response.data.$values);
      console.log(
        "rooms got successfully",
        response.data.$values[0].users.$values[0].id
      );
      setChats(response.data.$values);
    } catch (error) {
      console.error("Error getting items", error);
    }
  };

  useEffect(() => {
    getChatrooms();
  }, []);

  //GET MESSAGES OF A CHAT ROOM
  const getMessagesOfRoom = async (roomID) => {
    try {
      // Wait for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("roomID", selectedChat.id);
      const response = await api.get(
        `/Chat/GetChatRoomComplete?id=${selectedChat.id}`
      );
      // const response = await api.get(`/Chat/GetChatRoomComplete?id=6`);
      console.log(
        "mesages got successfully",
        response.data.data.messages.$values
      );
      setMessagesOfChat(response.data.data.messages.$values);
    } catch (error) {
      console.error("Error getting itemsPATLIYOPATLIYO", error);
    }
  };

  useEffect(() => {
    console.log("CHANGING SELECTED CHAT");

    getMessagesOfRoom(selectedChat.id);
  }, [selectedChat]);

  const sendMessage = (param) => {
    const receiverUserId = "someUserId"; // Replace with the actual user ID
    const message = "Hello, world!"; // Replace with the actual message
    console.log("selectedchat", selectedChat);
    console.log(signalR.HubConnectionState.Connected);
    if (newConnection) {
      console.log("Sending message:  " + param.message);
      newConnection
        .invoke(
          "SendMessageToSpesificUser",
          `${userId}`,
          `${sendTo}`,
          param.message
        )
        .then(() => {
          console.log("Message sent!");
          setShouldReload(!shouldReload);
          const sentMessage = {
            ...param,
            sentDate: new Date().toISOString(),
            userId: userId,
          };
          setMessagesOfChat((prevMessages) => [...prevMessages, sentMessage]);
        })
        .catch((err) => console.error("Error while sending message:", err));
    } else {
      console.error("Connection is not ready yet.");
    }

    setNewMessage({ senderUserId: "", receiverUserId: "", message: "" });
  };

  return (
    <div className="messages-container">
      <div className="chat-list">
        <div className="chat-list-title">CHATS</div>
        {chats?.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${
              chat.id === selectedChat?.id ? "selected" : ""
            }`}
            onClick={() => handleChatSelection(chat)}
          >
            {chat.users.$values[1].id == userId
              ? chat.users.$values[0].name
              : chat.users.$values[1].name}
            {/* {chat.users.$values[0].id == userId} */}
          </div>
        ))}
      </div>
      {!selectedChat.id ? (
        <div className="no-chat-container">
          <img
            src={notificationImage}
            alt="Notification"
            className="chat-image"
          />
          <div className="bigger-chat-text">{noNotificationMessage}</div>
          <div className="chat-text">{noNotificationsDescription}</div>
        </div>
      ) : (
        <div className="chat-messages">
          {selectedChat?.id && (
            <div className="chat-header">
              {selectedChat.users.$values[1].id === userId
                ? selectedChat.users.$values[0].name
                : selectedChat.users.$values[1].name}
            </div>
          )}
          <div className="message-list">
            {selectedChat &&
              messagesOfChat &&
              messagesOfChat.map(
                (message, index) =>
                  message.text !== undefined ? ( // Adding condition here
                  console.log("message", message.text),
                    <>
                      <div
                        key={index}
                        className={`message-item ${
                          message.userId === userId ? "current-user" : ""
                        }`}
                      >
                        <Message
                          text={message.text}
                          isCurrentUser={message.userId === userId}
                        />
                      </div>
                      <div
                        className={`message-item-time ${
                          message.userId === userId
                            ? "current-user-time"
                            : "other-user-time"
                        }`}
                      >
                        {shouldShowTime(index) && (
                          <div className="message-time">
                            {formatTime(message.sentDate)}
                          </div>
                        )}
                      </div>
                    </>
                  ) :
                  (
                    // Alternative content for undefined message.text
                    <div key={index} className={`message-item-empty ${
                      message.userId === userId
                        ? "current-user-time"
                        : "other-user-time"
                    }`}>
                      {shouldShowTime(index) && (
                          <div className="message-time">
                            {formatTime(message.sentDate)}
                          </div>
                        )}
                    </div>
                  )
                

              )}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage.message}
              onChange={(e) =>
                setNewMessage((prevMessage) => ({
                  ...prevMessage,
                  message: e.target.value,
                }))
              }
            />
            <button
              onClick={() => {
                console.log("newMessage", newMessage);
                if (newMessage.message != "") {
                  sendMessage(newMessage);
                } else return;
              }}
            >
              <div className="send-icon">
                <FaPaperPlane />
              </div>{" "}
              {/* Replace with your desired icon */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
