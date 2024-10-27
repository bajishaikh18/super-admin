import { apiClient } from "./common";

const basePath = "/interview";
export const createInterview = async (data: object) => {
  try {
    const response = await apiClient.post(basePath, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInterviewSummary = async () => {
  try {
    const response = await apiClient.get(`${basePath}/summary`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateInterview = async (id:string,data: object) => {
  try {
    const response = await apiClient.put(`${basePath}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInterviews = async (
  status: string,
  page: number,
  limit: number,
  filter: string,
  field: string
) => {
  try {
    const response = await apiClient.get(`${basePath}/interviews/admin/${status}`, {
      params: {
        page: page+1,
        limit: limit,
        field:field || '',
        filterTerm: filter,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInterviewDetails = async (id: string) => {
  try {
    const response = await apiClient.get(`${basePath}/admin/${id}`);
    console.log("API Response:", response.data);
    return response.data; 
  } catch (error) {
    throw error;
  }
};
