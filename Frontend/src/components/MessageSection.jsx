import { useEffect, useState } from "react";
import { getMessages } from "../API/messageApis";
import PropTypes from 'prop-types';
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const token = localStorage.getItem("token");
const socket = io(import.meta.env.VITE_API, {
  auth: {
    token, // Send token during the handshake
  },
});

export default function MessageSection({ selectedUser, selectedGroup }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [lastMessageId, setLastMessageId] = useState(null);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username")
  
  useEffect(() => {
    socket.on('connect', () => {
      console.log("Connected");
    });

    return () => {
      socket.disconnect(); // Disconnect only when the component unmounts
    };
  }, []);

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

          localStorage.setItem(key, JSON.stringify(limitedMessages));

          setLastMessageId(newLastMessageId);
          return limitedMessages;
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Create a consistent room ID for direct messages
    const createRoomId = (user1, user2) => {
      return [user1, user2].sort().join('_');
    };

    // Leave the previous room (if any) and join the new room
    if (roomName) {
      socket.emit('leaveRoom', roomName);
    }

    const currentUserEmail = localStorage.getItem("email");
    const newRoomId = selectedUser ? createRoomId(selectedUser, currentUserEmail) : `group_${selectedGroup}`;
    setRoomName(newRoomId);
    socket.emit('joinRoom', newRoomId);

    // Listen for incoming messages
    const handleNewMessage = (newMessage) => {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, newMessage];
        const sortedMessages = updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const limitedMessages = sortedMessages.slice(-10);

        localStorage.setItem(key, JSON.stringify(limitedMessages));

        return limitedMessages;
      });
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage); // Clean up the listener
    };
  }, [selectedUser, selectedGroup]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageData = {
      messageText: newMessage,
      roomName: roomName,
      groupId: selectedGroup,
      recipientEmail: selectedUser,
      senderToken: token
    };

    socket.emit('newMessage', messageData);
    setNewMessage("");
  };

  const logout = () => {
    localStorage.clear()
    navigate("/login")
  }
  return (
    <div className="chat-box">
      <div className="title">
        <div>{username}</div>
        <button onClick={logout}>Logout</button>
      </div>
      {messages.length === 0 ? (
        <div className="messages center">
          <div className="empty">No messages yet</div>
        </div>
      ) : (
        <div className="messages">
          {messages.map((msg) => 
          {
            const name = msg.sender == username ? "You" : msg.sender
            return (
              <div className={name == "You" ? "right" : "left"} key={msg.id}>
                <span>{name}:</span>
                <p>{msg.message}</p>
              </div>
            )
          }
          )}
        </div>
      )}

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
