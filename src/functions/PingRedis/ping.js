import axios from "axios";

export const pingServer = async (user_id) => {
  try {
    console.error("User is pinged",user_id)
    const response = await axios.post(`http://192.168.1.33/pingUser`, {
      user_id: user_id,
    });
    console.log("Ping response:", response.data);
  } catch (error) {
    console.error("Error pinging server:", error.message);
  }
};
