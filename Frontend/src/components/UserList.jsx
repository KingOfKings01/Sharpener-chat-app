import { useEffect, useState } from "react";
import { getAllUsers } from "../API/userApis.js";
import PropTypes from 'prop-types';
import "../../public/css/list.css"

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const userList = await getAllUsers(token);
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectUser = (email) => {
    setSelectedUserEmail(email); // Update the selected user email
    onSelectUser(email); // Trigger the onSelectUser callback
  };

  return (
    <div className="user-list">
      <ul>
        {users.map((user, index) => (
          <li 
            key={index} 
            onClick={() => handleSelectUser(user.email)} 
            className={user.email === selectedUserEmail ? "select" : ""}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

UserList.propTypes = {
  onSelectUser: PropTypes.func.isRequired,
};
