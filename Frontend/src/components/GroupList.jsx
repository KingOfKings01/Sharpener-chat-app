// GroupList.jsx
import { useEffect, useState } from "react";
import { getAllGroups } from "../API/groupApis.js";
import PropTypes from 'prop-types';
import GroupPopup from "./GroupPopup.jsx";
import AdminPopup from "./AdminPopup.jsx";

export default function GroupList({ onSelectGroup }) {
  const [groups, setGroups] = useState([]);
  const [isGroupPopupVisible, setIsGroupPopupVisible] = useState(false);
  const [isAdminPopupVisible, setIsAdminPopupVisible] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const groupList = await getAllGroups(token);
        setGroups(groupList);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, []);

  const handleOpenGroupPopup = () => {
    setIsGroupPopupVisible(true);
  };

  const handleCloseGroupPopup = () => {
    setIsGroupPopupVisible(false);
  };

  const handleOpenAdminPopup = (groupId) => {
    setSelectedGroupId(groupId);
    setIsAdminPopupVisible(true);
  };

  const handleCloseAdminPopup = () => {
    setIsAdminPopupVisible(false);
    setSelectedGroupId(null); // Clear the selected group ID
  };

  return (
    <div className="group-list">
      <button onClick={handleOpenGroupPopup}>Create Group</button>
      {isGroupPopupVisible && <GroupPopup onClose={handleCloseGroupPopup} />}
      {isAdminPopupVisible && selectedGroupId && (
        <AdminPopup groupId={selectedGroupId} onClose={handleCloseAdminPopup} />
      )}
      <ul>
        {groups.map((group, index) => (
          <li key={index} onClick={() => onSelectGroup(group.id)}>
            {group.name} {group.role}
            {/* Conditionally render button if the role is admin */}
            {group.role === "admin" && (
              <button onClick={() => handleOpenAdminPopup(group.id)}>
                Admin Options
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

GroupList.propTypes = {
  onSelectGroup: PropTypes.func.isRequired,
};
