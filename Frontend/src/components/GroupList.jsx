// GroupList.jsx
import { useEffect, useState } from "react";
import { getAllGroups } from "../API/groupApis.js";
import PropTypes from 'prop-types';
import GroupPopup from "./GroupPopup.jsx";

export default function GroupList({ onSelectGroup }) {
  const [groups, setGroups] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

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

  const handleOpenPopup = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="group-list">
      <button onClick={handleOpenPopup}>Create Group</button>
      {isPopupVisible && <GroupPopup onClose={handleClosePopup} />}
      <ul>
        {groups.map((group, index) => (
          <li key={index} onClick={() => onSelectGroup(group.id)}>
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

GroupList.propTypes = {
  onSelectGroup: PropTypes.func.isRequired,
};
