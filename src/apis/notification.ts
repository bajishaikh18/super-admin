

import { apiClient } from "./common";

const basePath = "/notification";

export const createNotification = async (data: {
    title: string;
    description: string;
    target: string[]
}) => {
    try {
        const response = await apiClient.post(`${basePath}`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error; 
    }
};
export const getUserNotifications = async () => {
      try {
          const response = await apiClient.get(`${basePath}`, {
          });
          return response.data;
      } catch (error) {
          console.error("Error fetching notifications:", error);
          throw error; 
      }
  };

export const updateNotification = async (id:string,data:any) => {
    try {
        const response = await apiClient.patch(`${basePath}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating notifications:", error);
        throw error; 
    }
};

export const markNotificationAsRead = async (data:any) => {
    try {
        const response = await apiClient.patch(`${basePath}/markAsRead`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating notifications:", error);
        throw error; 
    }
};


export const getNotifications = async (
  start: number,
  fetchSize: number,
  field: string,
  filterTerm: string
) => {
    try {
        const response = await apiClient.get(`${basePath}/notifications`, {
            params: {
                page: start + 1,
                limit: fetchSize,
                field: field || "",
                filterTerm: filterTerm || "",
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error; 
    }
};
