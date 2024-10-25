

import { apiClient } from "./common";

const basePath = "/notifications";

// export const createNotification = async (data: {
//     title: string;
//     description: string;
// }) => {
//     try {
//         const response = await apiClient.post(`${basePath}`, data);
//         return response.data;
//     } catch (error) {
//         console.error("Error creating notification:", error);
//         throw error; 
//     }
// };

export const getNotifications = async (type: string, data: string) => {
    try {
        const response = await apiClient.get(`${basePath}`, {
            params: {
                type,
                data
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error; 
    }
};
