import { apiClient } from "./common";

const basePath = '/agency';
export const getAgencies = async (
    type: string,
    state: string,
    
) => {
    try {
        const response = await apiClient.get(`${basePath}/agencies`, {
            params: {
                type: type,
                data: state,
            }
        });
        return response.data;
   }   catch (error) {
        throw error;
    }
};