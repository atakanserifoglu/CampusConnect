import React from 'react';
import './Message.css';

const Message = ({ text, isCurrentUser }) => {
  return (
    <div className={`message ${isCurrentUser ? 'current-user' : 'other-user'}`}>
      {text}
    </div>
  );
};

export default Message;
