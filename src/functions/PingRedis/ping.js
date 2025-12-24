import axios from "axios";
import Constants from "expo-constants";
export const pingServer = async (user_id) => {
  try {
    console.error("User is pinged",user_id)
    const response = await axios.post(`${Constants.expoConfig.extra.SERVER
        }/pingUser`, {
      user_id: user_id,
    });
    console.warn("Ping response:", response.data);
  } catch (error) {
    console.error("Error pinging server:", error.message);
  }
};
