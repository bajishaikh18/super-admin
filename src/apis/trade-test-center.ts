import { apiClient } from "./common";

const basePath = "/trade";
export const getTradeTestCenters = async (
  status: string,
  start: number,
  fetchSize: number,
  field: string,
  filterTerm: string
) => {
  try {
    const response = await apiClient.get(
      `${basePath}/trades/admin/${status}`,
      {
        params: {
          page: start + 1,
          limit: fetchSize,
          field: field || "",
          filterTerm: filterTerm || "",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTradeTestCenterById = async (id: string) => {
  try {
    const response = await apiClient.get(`${basePath}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTradeTestCenterByAdminId = async (id: string) => {
  try {
    const response = await apiClient.get(`${basePath}/admin/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTradeTestCenter = async (data: object) => {
  try {
    const response = await apiClient.post(basePath, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const updateTradeTestCenter = async (id:string,data: object) => {
    try {
      const response = await apiClient.put(`${basePath}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const deleteTradeTestCenterAPI = async (id: string) => {
    try {
      const response = await apiClient.delete(`${basePath}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  