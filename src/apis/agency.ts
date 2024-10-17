import { apiClient } from "./common";

const basePath = '/agency';
export const getAgencies = async (
    status: string,
    field:string,
    filterTerm:string
) => {
    try {
        const response = await apiClient.get(`${basePath}/agencies/admin/${status}`, {
            params: {
                field: field || "",
                filterTerm: filterTerm || "",
            }
        });
        return response.data;
   }   catch (error) {
        throw error;
    }
};

// export const createAgency = async (data: object) => {
//     try {
//         const response = await apiClient.post(basePath, data);
//         return response.data;
//     } catch (error) {
//         throw error;
        
//     }
// }