import axios from "axios";

export async function getMessages(
  token,
  lastMessageId = null,
  selectedUser,
  selectedGroup
) {
  try {
    const response = await axios.get("http://localhost:4000/user/get-messages", {
      params: {
        recipientEmail: selectedUser,
        groupId: selectedGroup,
        lastMessageId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      "Something went wrong! Please try again later."
    );
  }
}


export async function sendMessage(token, newMessage, selectedUser, selectedGroup) {
  try {
    const response = await axios.post(
      "http://localhost:4000/user/create-message",
      { message: newMessage, groupId: selectedGroup, recipientEmail: selectedUser},
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
        "Something went wrong! Please try again later."
    );
  }
}
