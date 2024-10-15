import { apiClient } from "./common";

const basePath = '/agency';



export const getAgencies = async (

    type: string,
    status: string,
    page: number,
    limit: number,
    filter: string,
    field: string
) => {
    try {
        const response = await apiClient.get(`${basePath}/agencies`, {
            params: {
                type: type, 
                data: status,
                page: page + 1,
                limit: limit,
                field:field || '',
                filterTerm: filter,
            }
        });
        return response.data;
    } catch (error) {

        throw error;
        
    }
};