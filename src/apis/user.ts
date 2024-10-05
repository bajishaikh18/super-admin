import { apiClient } from "./common";

const basePath = '/user';

export const getUserDetails = async () => {
    try {
      const response = await apiClient.get(`${basePath}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };