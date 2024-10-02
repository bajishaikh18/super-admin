import { apiClient } from "./common";

export const getUsers = async (type:string,start: number,size:number,filter:string) => {
  try {
    const response = await apiClient.get(`/dashboard/${type}`,{
        params:{
            "page": start+1,
            "limit": size,
            "field":"email",
            "filterTerm": filter
        }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
