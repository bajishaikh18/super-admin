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

export const getAgencyById = async (
    id: string
) => {
    try {
        const response = await apiClient.get(`${basePath}/${id}`);
        return response.data;
   }   catch (error) {
        throw error;
    }
};

export const getAgencyByAdminId = async (
    id: string
) => {
    try {
        const response = await apiClient.get(`${basePath}/admin/${id}`);
        return response.data;
   }   catch (error) {
        throw error;
    }
};