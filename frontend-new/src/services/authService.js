import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ApiUrls } from "../constants/api_urls";

export const fetchUserData = async (setUser) => {
  const token = localStorage.getItem("auth_token");
  if (!token) return;

  try {
    const response = await axios.get(ApiUrls.AUTH_USER, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (data.status === 1 && data.data) {
      setUser(data.data); // Set in state from caller
      localStorage.setItem("auth_user", JSON.stringify(data.data));
    } else {
      localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    }
  } catch (error) {
    console.error("User fetch error:", error.response?.data || error.message);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }
};
