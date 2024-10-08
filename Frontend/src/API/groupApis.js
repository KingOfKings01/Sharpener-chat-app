// src/API/groupApis.js
import axios from 'axios';

// Create a new group
export async function createGroup(token, groupName, selectedMembers) {
  const groupData = {
    name: groupName,
    members: selectedMembers,
  };
  
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API}/group/create`,
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
        `Something went wrong! Please try again later.`
    );
  }
}

// Fetch groups for the current user
export async function getAllGroups(token) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API}/group/user-groups`,
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
        `Something went wrong! Please try again later.`
    );
  }
}

export async function getGroupMembers(token, groupId) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API}/group/get-members`,
      {
        groupId,
      },
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
        `Something went wrong! Please try again later.`
    );
  }
}

export async function getNonGroupMembers(token, groupId) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API}/group/get-non-members`,
      {
        groupId,
      },
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
        `Something went wrong! Please try again later.`
    );
  }
}

// Add a user to a group
export async function addUserToGroup(token, addUserId, groupId) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API}/group/add-user`, 
      {
        addUserId,
        groupId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.message;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
        `Something went wrong! Please try again later.`
    );
  }
}

export async function removeUserFromGroup(token, addUserId, groupId) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API}/group/remove-user`,
      {
        addUserId,
        groupId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.message;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
        `Something went wrong! Please try again later.`
    );
  }
}

export async function updateUserToAdmin(token, addUserId, groupId) {

  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API}/group/user-to-admin`,
      {
        addUserId,
        groupId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.message;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
        `Something went wrong! Please try again later.`
    );
  }
}
