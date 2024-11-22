import { apiClient } from "./common";

const basePath = "/approval";

export const getApprovals = async () => {
  try {
    const response = await apiClient.get(basePath);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateApprovalStatus = async (id: string, action: string) => {
  try {
    const response = await apiClient.patch(`${basePath}/${id}/status`, {
      action,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createApproval = async (payload:  {
  reportType : string,
  quantity: number,
  filters:string[] | null,
  reason: string
}) => {
  try {
    const response = await apiClient.post(`${basePath}`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
