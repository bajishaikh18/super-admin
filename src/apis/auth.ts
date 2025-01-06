import { BASE_URL } from "@/helpers/constants";
import axios from "axios";
import { apiClient } from "./common";

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


export const registerUser = async (data: object) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/adduser`, data);
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  } finally {
  }
};

export const verifyEmail = async (data: object) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/verifyEmail`, data);
    return response.data;
  } catch (error) {
    console.error("Verify failed:", error);
    throw error;
  } finally {
  }
};

export const resendOtp = async (data: object) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/resend-email-otp`, data);
    return response.data;
  } catch (error) {
    console.error("OTP resend failed:", error);
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



export const updateDetails = async (data: object) => {
  try {
    const response = await apiClient.patch(`${BASE_URL}/user/admin`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
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

