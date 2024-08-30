// GroupPopup.jsx
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { createGroup } from "../API/groupApis.js";
import { getAllUsers } from "../API/userApis.js";
import '../../public/css/GroupPopup.css';

export default function GroupPopup({ onClose }) {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // eslint-disable-next-line no-unused-vars
      const response = await createGroup(token, groupName, selectedMembers);
      // console.log("Group created:", response);
      onClose();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleMemberSelection = (email) => {
    setSelectedMembers(prev => prev.includes(email) ? prev.filter(member => member !== email) : [...prev, email]);
  };

  useEffect(() => {
    const fetchAvailableMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const members = await getAllUsers(token);
        setAvailableMembers(members);
      } catch (error) {
        console.error("Error fetching available members:", error);
      }
    };
    fetchAvailableMembers();
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Create Group</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="groupName">Group Name:</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Members:</label>
            <ul>
              {availableMembers.map(member => (
                <li
                  key={member.email}
                  className={selectedMembers.includes(member.email) ? 'selected' : ''}
                  onClick={() => handleMemberSelection(member.email)}
                >
                  {member.email}
                </li>
              ))}
            </ul>
          </div>
          <button type="submit">Create Group</button>
          <button type="button" className="cancel" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

GroupPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};