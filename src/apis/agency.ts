import { apiClient } from "./common";

const basePath = "/agency";
export const getAgencies = async (
  status: string,
  start: number,
  fetchSize: number,
  field: string,
  filterTerm: string
) => {
  try {
    const response = await apiClient.get(
      `${basePath}/agencies/admin/${status}`,
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

export const getAgencyById = async (id: string) => {
  try {
    const response = await apiClient.get(`${basePath}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAgencyByAdminId = async (id: string) => {
  try {
    const response = await apiClient.get(`${basePath}/admin/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAgency = async (data: object) => {
  try {
    const response = await apiClient.post(basePath, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const updateAgency = async (id:string,data: object) => {
    try {
      const response = await apiClient.put(`${basePath}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const deleteAgencyAPI = async (id: string, _p0: { isDeleted: boolean; }) => {
    try {
      const response = await apiClient.delete(`${basePath}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  