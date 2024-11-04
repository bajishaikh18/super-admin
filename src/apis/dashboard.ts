import { apiClient } from "./common";

const pathUrl = '/dashboard';

export const getSummary = async () => {
  try {
    const response = await apiClient.get(`${pathUrl}/summary`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobCount = async (date:string) => {
  try {
    const response = await apiClient.get(`${pathUrl}/getJobCount`,{
      params:{
        date:date
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSitePerformance = async (date:string) => {
  try {
    const response = await apiClient.get(`${pathUrl}/siteperformance`,{
      params:{
        date:date
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getUsers = async (type:string,start: number,size:number,filter:string,field:string) => {
  try {
    const response = await apiClient.get(`/dashboard/users/${type}`,{
        params:{
            "page": start+1,
            "limit": size,
            "field":field || '',
            "filterTerm": filter
        }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getEmployers = async (
  status: string, 
  page: number,    
  limit: number,  
  field: string,   
  filterTerm: string 
) => {
  try {
    const response = await apiClient.get(`/dashboard/employers/${status}`, {
      params: {
        page: page + 1,
        limit: limit,
        field: field || '',
        filterTerm: filterTerm || ''
      }
    });
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employers:", error);
    throw error;
  }
};
export const updateEmployers = async (id: string, action: 'approve' | 'reject') => {
  try {
    const response = await apiClient.patch(`/dashboard/employers/${id}/status`, {
      action: action 
    });
    console.log("API Response:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Failed to update employer:", error);
    throw error;
  }
};