import { BASE_URL } from "@/helpers/constants";
import axios from "axios";

export const login = async (data: object) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, data);
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  } finally {
  }
};

export const resetPassword = async (data: object) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/resetpassword`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  } finally {
  }
};

export const forgotPassword = async (data: object) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/forgotpassword`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  } finally {
  }
};

