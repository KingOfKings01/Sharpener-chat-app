// AdminPopup.jsx
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
// import { getUsers, addUserToGroup, deleteUserFromGroup, updateUserToAdmin, getUsersInGroup } from "../API/groupApis.js";
import '../../public/css/AdminPopup.css';
import { addUserToGroup, getGroupMembers, getNonGroupMembers, removeUserFromGroup, updateUserToAdmin } from "../API/groupApis";

export default function AdminPopup({ groupId, onClose }) {
  const [users, setUsers] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const allUsers = await getNonGroupMembers(token, groupId);
        const groupUsers = await getGroupMembers(token, groupId);
        setUsers(allUsers);
        setGroupUsers(groupUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [groupId]);

  const handleAddUser = async (addUserId) => {
    try {
      const token = localStorage.getItem("token");
      const message = await addUserToGroup(token, addUserId, groupId);

      const updatedGroupUsers = await getGroupMembers(token, groupId);
      setGroupUsers(updatedGroupUsers);

      const allUsers = await getNonGroupMembers(token, groupId);
      setUsers(allUsers);

      alert(message);
    } catch (error) {
      console.error("Error adding user to group:", error);
    }
  };

  const handleDeleteUser = async (addUserId) => {
    try {
      const token = localStorage.getItem("token");
      const message = await removeUserFromGroup(token, addUserId, groupId);

      const updatedGroupUsers = await getGroupMembers(token, groupId);
      setGroupUsers(updatedGroupUsers);

      const allUsers = await getNonGroupMembers(token, groupId);
      setUsers(allUsers);

      alert(message)

    } catch (error) {
      console.error("Error deleting user from group:", error);
    }
  };

  const handleUpdateToAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const message = await updateUserToAdmin(token, userId, groupId);

      const updatedGroupUsers = await getGroupMembers(token, groupId);
      setGroupUsers(updatedGroupUsers);

      alert(message)
    } catch (error) {
      console.error("Error updating user to admin:", error);
    }
  };

  return (
    <div className="admin-popup">
      <div className="header">
        <h2>Manage Group Users</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <h3>Group Members</h3>
      <ul>
        {groupUsers.map(user => (
          <li key={user.id}>
            {user.name}
            <div>
              {user.role == 'admin' ? 
              <div className="role">Admin</div>
              : 
              <>
                <button onClick={() => handleDeleteUser(user.id)}>Remove</button>
                <button onClick={() => handleUpdateToAdmin(user.id)}>Make Admin</button>
              </>
              }
            </div>
          </li>
        ))}
      </ul>
      <h3>Add New Members</h3>
      <ul>
        {users
          .filter(user => !groupUsers.find(groupUser => groupUser.id === user.id))
          .map((user, index) => (
            <li key={index}>
              {user.name}
              <button onClick={() => handleAddUser(user.id)}>Add to Group</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

AdminPopup.propTypes = {
  groupId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};
