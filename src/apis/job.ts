import { apiClient } from "./common";

const basePath = "/job";
export const createJob = async (data: object) => {
  try {
    const response = await apiClient.post(basePath, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobSummary = async () => {
  try {
    const response = await apiClient.get(`${basePath}/summary`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobs = async (
  type: string,
  status: string,
  page: number,
  limit: number,
  filter: string
) => {
  try {
    const response = await apiClient.get(`${basePath}/jobs`, {
      params: {
        type: type,
        data: status,
        page: page,
        limit: limit,
        field: "email",
        filterTerm: filter,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
