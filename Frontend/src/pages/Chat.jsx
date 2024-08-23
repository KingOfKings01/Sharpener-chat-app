import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import { getMessages, sendMessage } from "../API/messageApis";
import "../../public/css/chat.css"

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if token is not found
    } else {
      fetchMessages(); // Fetch messages if token is found
    }
  }, []);

  // Fetch all messages from the server
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const messages = await getMessages(token)
      // console.table(messages);
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const receivedMessage = await sendMessage(token, newMessage)
      console.log(receivedMessage);
      setMessages([...messages, receivedMessage]); // Add new message to the messages array
      setNewMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-box">
      <h1 className="title">Chat App</h1>
      <div className="messages">

        {messages.map((msg, index) => (
          <div
            className={msg.name == "You" ? "right" : "left"}
            key={index}
          >
            <span>{msg.name}:</span>
            <p
            >
              {msg.message}
            </p>
          </div>
        ))}
      </div>
      <div className="send-message">
        <form className="message-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
