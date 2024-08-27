import { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../API/messageApis";
import PropTypes from 'prop-types';

export default function MessageSection({ selectedUser, selectedGroup }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [lastMessageId, setLastMessageId] = useState(null);

  useEffect(() => {
    if (!selectedUser && !selectedGroup) return; // Do nothing if no user or group is selected

    const key = selectedUser ? `messages_user_${selectedUser}` : `messages_group_${selectedGroup}`;
    const storedMessages = JSON.parse(localStorage.getItem(key)) || [];
    setMessages(storedMessages);

    // Set the last message ID based on stored messages
    const lastStoredMessage = storedMessages[storedMessages.length - 1];
    setLastMessageId(lastStoredMessage ? lastStoredMessage.id : null);

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const fetchedMessages = await getMessages(token, lastMessageId, selectedUser, selectedGroup);

        if (fetchedMessages.length === 0) return;

        setMessages(prevMessages => {
          const existingIds = new Set(prevMessages.map(msg => msg.id));
          const uniqueMessages = fetchedMessages.filter(msg => !existingIds.has(msg.id));

          const newLastMessageId = uniqueMessages.length > 0 
            ? uniqueMessages[uniqueMessages.length - 1].id 
            : lastMessageId;

          const updatedMessages = [...prevMessages, ...uniqueMessages];
          const sortedMessages = updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          const limitedMessages = sortedMessages.slice(-10);

          // Store the limited messages separately for each user or group
          localStorage.setItem(key, JSON.stringify(limitedMessages));

          setLastMessageId(newLastMessageId);
          return limitedMessages;
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1000 * 5000);
    return () => clearInterval(interval);
  }, [selectedUser, selectedGroup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const receivedMessage = await sendMessage(token, newMessage, selectedUser, selectedGroup);

      setMessages(prevMessages => {
        const newMessages = [...prevMessages, receivedMessage];
        const sortedMessages = newMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const limitedMessages = sortedMessages.slice(-10);

        // Store the limited messages separately for each user or group
        const key = selectedUser ? `messages_user_${selectedUser}` : `messages_group_${selectedGroup}`;
        localStorage.setItem(key, JSON.stringify(limitedMessages));

        return limitedMessages;
      });

      setNewMessage("");
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
            className={msg.sender == "You" ? "right" : "left"}
            key={msg.id}
          >
            <span>{msg.sender}:</span>
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

MessageSection.propTypes = {
    selectedUser: PropTypes.string,
    selectedGroup: PropTypes.number,
};
