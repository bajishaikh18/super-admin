import { apiClient } from "./common";


const pathUrl = '/agencies';

export const getAgencies = async () => {
    try {
        const response = await apiClient.get(`${pathUrl}/agencies`);
    return response.data;
        
    } catch (error) {
        throw error;
    }
}