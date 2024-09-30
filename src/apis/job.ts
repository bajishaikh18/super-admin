import { apiClient } from "./common";

export const createJob = async (data: object) => {
  try {
    const response = await apiClient.post(`/job`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
