import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { event } = location.state || { event: { name: "Event Chat" } };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { text: newMessage, sender: "You" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <button onClick={() => navigate(-1)} className="back-button">Back to Map</button>
        <h2>{event.name} - Chat</h2>
      </header>
      <div className="chat-content">
        <div className="message-list">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
