import { apiClient } from "./common";

export const getUsers = async (start: number,size:number) => {
  try {
    const response = await apiClient.get(`/dashboard`,{
        params:{
            "page": start+1,
            "limit": size
        }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
