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
    const token = localStorage.getItem("token");
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

export const getSignedUrl = async (fileType: string,contentType:string,type:string,id:string) => {
  try {
    const response = await apiClient.get("/file/getUploadUrl", {
      params: {
        fileType: fileType,
        contentType: contentType,
        [type]: id
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user details:", error);
    throw error;
  }
};

export const getDownloadUrl = async (keyName: string,type?:string) => {
  try {
    const response = await apiClient.get("/file/getDownloadUrl", {
      params: {
        keyName: keyName,
        type:type
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get download url", error);
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
    console.error("Failed to get upload url", error);
    throw error;
  }
};



export const getJobTitles = async (title?:string) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobTitle`,{
      params:{
        title:title
      }
    });
    return response.data.jobTitles;
  } catch (error) {
    console.error("Failed to get upload url", error);
    throw error;
  }
};


export const getAgenciesList = async (agencyName:string) => {
  try {
    const response = await axios.get(`${BASE_URL}/agency/agencies`,{
      params:{
        page: 1,
        limit: 100,
        filters:{
          status:'active',
          name: agencyName
        }
      }
    });
    return response.data.agencies;
  } catch (error) {
    console.error("Failed to get upload url", error);
    throw error;
  }
};


