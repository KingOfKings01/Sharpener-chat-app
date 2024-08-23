import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMessages, sendMessage } from "../API/messageApis";
import "../../public/css/chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [lastMessageId, setLastMessageId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if token is not found
    } else {
      // Load messages from local storage on component mount
      const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];
      // Sort stored messages by createdAt
      const sortedMessages = storedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(sortedMessages);

      // Fetch messages every 1 second
      const interval = setInterval(() => {
        fetchMessages();
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, []);

  // Fetch all messages from the server
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const fetchedMessages = await getMessages(token, lastMessageId);
  
      if (fetchedMessages.length === 0) return;
  
      setMessages(prevMessages => {
        // Create a set of existing message IDs for quick lookup
        const existingIds = new Set(prevMessages.map(msg => msg.id));
        // Filter out messages with IDs that already exist in the state
        const uniqueMessages = fetchedMessages.filter(msg => !existingIds.has(msg.id));
  
        // Update lastMessageId based on the new messages
        const newLastMessageId = uniqueMessages.length > 0 
          ? uniqueMessages[uniqueMessages.length - 1].id 
          : lastMessageId;
  
        const updatedMessages = [...prevMessages, ...uniqueMessages];
        // Sort messages by createdAt
        const sortedMessages = updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
        // Enforce local storage limit of 10 messages
        const limitedMessages = sortedMessages.slice(-10);
  
        // Store updated messages in local storage
        localStorage.setItem("messages", JSON.stringify(limitedMessages));
  
        setLastMessageId(newLastMessageId);
        return limitedMessages;
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const receivedMessage = await sendMessage(token, newMessage);
  
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, receivedMessage];
        // Sort messages by createdAt
        const sortedMessages = newMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
        // Enforce local storage limit of 10 messages
        const limitedMessages = sortedMessages.slice(-10);
  
        // Store updated messages in local storage
        localStorage.setItem("messages", JSON.stringify(limitedMessages));
        return limitedMessages;
      });
  
      setNewMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  return (
    <div className="chat-box">
      <h1 className="title">Chat App</h1>
      <div className="messages">
        {messages.map((msg) => (
          <div
            className={msg.name === "You" ? "right" : "left"}
            key={msg.id} // Use message id as key
          >
            <span>{msg.name}:</span>
            <p>{msg.message}</p>
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
