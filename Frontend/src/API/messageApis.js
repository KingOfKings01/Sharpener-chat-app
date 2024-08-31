import axios from "axios";

export async function getMessages(
  token,
  lastMessageId = null,
  selectedUser,
  selectedGroup
) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API}/user/get-messages`,
      {
        params: {
          recipientEmail: selectedUser,
          groupId: selectedGroup,
          lastMessageId,
        },
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

export async function sendMessage(
  token,
  newMessage,
  selectedUser,
  selectedGroup
) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API}/user/create-message`,
      {
        message: newMessage,
        groupId: selectedGroup,
        recipientEmail: selectedUser,
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

export async function uploadFile(token, selectedFile) {
  try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    // console.log(contentType, filename);
    const response = await axios.post(
      `${import.meta.env.VITE_API}/user/uploadFile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Set this to multipart/form-data

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
