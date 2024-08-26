// UserList.jsx
import { useEffect, useState } from "react";
import { getAllUsers } from "../API/userApis.js";
import PropTypes from 'prop-types';

import "../../public/css/list.css"

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);

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

  return (
    <div className="user-list">
      <ul>
        {users.map((user, index) => (
          <li key={index} onClick={() => onSelectUser(user.email)}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}


UserList.propTypes = {
    onSelectUser : PropTypes.func.isRequired,
}