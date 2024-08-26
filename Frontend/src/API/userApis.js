import axios from "axios";

// Corrected the function name to `signIn`
export async function signIn(data) {
  try {
    const response = await axios.post(
      "http://localhost:4000/user/sign-in", // Corrected endpoint
      data
    );
    return response.data.token;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
        "Something went wrong! Please try again later."
    );
  }
}

export async function login(data) {
  try {
    const response = await axios.post("http://localhost:4000/user/login", data);
    return response.data.token;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
        "Something went wrong! Please try again later."
    );
  }
}

export async function getAllUsers(token) {
  try {
    const response = await axios.get(
      "http://localhost:4000/user/get-Users",
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
