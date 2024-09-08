import { useEffect, useState } from "react";
import UserList from "../components/UserList";
import GroupList from "../components/GroupList";
import MessageSection from "../components/MessageSection";
import "../../public/css/chat.css";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showUsers, setShowUsers] = useState(true); // Toggle between Users and Groups
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login page if token is not found
     return navigate("/login");
    }
  },[])

  return (
    <div className="chat-container">
      <div className="left-panel">
        {/* Toggle Buttons */}
        <div className="toggle-buttons">
          <button onClick={() => {
            setShowUsers(true)
            setSelectedGroup(null);
          }} className={showUsers ? "active" : ""}>
            Users
          </button>
          <button onClick={() => {
            setShowUsers(false)
            setSelectedUser(null);
          }} className={!showUsers ? "active" : ""}>
            Groups
          </button>
        </div>

        {/* Conditional Rendering */}
        {showUsers ? (
          <UserList onSelectUser={setSelectedUser} />
        ) : (
          <GroupList onSelectGroup={setSelectedGroup} />
        )}
      </div>

      <div className="right-panel">
        <MessageSection selectedUser={selectedUser} selectedGroup={selectedGroup} />
      </div>
    </div>
  );
}
