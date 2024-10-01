import { BASE_URL } from "@/helpers/constants";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export const getSignedUrl = async (fileType: string,contentType:string,jobId?:string) => {
  try {
    const response = await apiClient.get("/file/getUploadUrl", {
      params: {
        fileType: fileType,
        contentType: contentType,
        jobId: jobId
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user details:", error);
    throw error;
  }
};

export const uploadFile = async (url: string, file:File|Blob) => {
  try {
    const response = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user details:", error);
    throw error;
  }
};
