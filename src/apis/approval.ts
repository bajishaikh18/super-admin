import { apiClient } from "./common";

const basePath = "/approval";


  export const getApprovals = async () => {
    try {
      const response = await apiClient.get(basePath);
      console.log("API Response:", response.data);
      return response.data; 
    } catch (error: any) {
      throw error; 
    }
  };


  export const updateApprovalStatus = async (id: string, action: string) => {
    try {
      const response = await apiClient.patch(`${basePath}/${id}/status`, { action });
      console.log("Status Updated Successfully:", response.data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  