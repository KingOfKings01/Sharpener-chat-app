import axios from "axios";

// Corrected the function name to `signIn`
export async function getMessages(token, lastMessageId = null) {
    try {
      const response = await axios.get("http://localhost:4000/user/get-messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          lastMessageId, // Pass the lastMessageId as a query parameter
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
  

export async function sendMessage(token, newMessage) {
  try {
    const response = await axios.post(
        "http://localhost:4000/user/create-message",
        { message: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    )
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      "Something went wrong! Please try again later."
    );
  }
}
