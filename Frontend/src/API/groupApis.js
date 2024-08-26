// src/API/groupApis.js
import axios from 'axios';

// Create a new group
export async function createGroup(token, groupName, selectedMembers) {
  
  const groupData = {
    "name": groupName,
    "members": selectedMembers
  }
  
  try {
    const response = await axios.post(
      'http://localhost:4000/group/create',
      groupData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong! Please try again later.'
    );
  }
}

// Fetch groups for the current user
export async function getAllGroups(token) {
  try {
    const response = await axios.get(
      'http://localhost:4000/group/user-groups',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong! Please try again later.'
    );
  }
}

// Add a user to a group
export async function addUserToGroup(token, groupId, userId) {
  try {
    const response = await axios.post(
      'http://localhost:4000/group/add-user', // Adjust endpoint as necessary
      { groupId, userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      'Something went wrong! Please try again later.'
    );
  }
}
