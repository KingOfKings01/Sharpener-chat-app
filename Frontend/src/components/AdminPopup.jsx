// AdminPopup.jsx
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
// import { getUsers, addUserToGroup, deleteUserFromGroup, updateUserToAdmin, getUsersInGroup } from "../API/groupApis.js";
import '../../public/css/AdminPopup.css';

export default function AdminPopup({ groupId, onClose }) {
  const [users, setUsers] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);

  useEffect(() => {
    // const fetchUsers = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     const allUsers = await getUsers(token);
    //     const groupUsers = await getUsersInGroup(groupId, token);
    //     setUsers(allUsers);
    //     setGroupUsers(groupUsers);
    //   } catch (error) {
    //     console.error("Error fetching users:", error);
    //   }
    // };
    // fetchUsers();
  }, [groupId]);

  const handleAddUser = async (userId) => {
    // try {
    //   const token = localStorage.getItem("token");
    //   await addUserToGroup(groupId, userId, token);
    //   const updatedGroupUsers = await getUsersInGroup(groupId, token);
    //   setGroupUsers(updatedGroupUsers);
    // } catch (error) {
    //   console.error("Error adding user to group:", error);
    // }
  };

  const handleDeleteUser = async (userId) => {
    // try {
    //   const token = localStorage.getItem("token");
    //   await deleteUserFromGroup(groupId, userId, token);
    //   const updatedGroupUsers = await getUsersInGroup(groupId, token);
    //   setGroupUsers(updatedGroupUsers);
    // } catch (error) {
    //   console.error("Error deleting user from group:", error);
    // }
  };

  const handleUpdateToAdmin = async (userId) => {
    // try {
    //   const token = localStorage.getItem("token");
    //   await updateUserToAdmin(groupId, userId, token);
    //   const updatedGroupUsers = await getUsersInGroup(groupId, token);
    //   setGroupUsers(updatedGroupUsers);
    // } catch (error) {
    //   console.error("Error updating user to admin:", error);
    // }
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
              <button onClick={() => handleDeleteUser(user.id)}>Remove</button>
              <button onClick={() => handleUpdateToAdmin(user.id)}>Make Admin</button>
            </div>
          </li>
        ))}
      </ul>
      <h3>Add New Members</h3>
      <ul>
        {users
          .filter(user => !groupUsers.find(groupUser => groupUser.id === user.id))
          .map(user => (
            <li key={user.id}>
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
