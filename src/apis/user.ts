import { apiClient } from "./common";

const basePath = "/user";

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  landlineNumber: string;
  address: string;
  state: string;
  country: string;
  mobileCountryCode: string;
  landlineCountryCode: string;
}

export const getUserDetails = async () => {
  try {
    const response = await apiClient.get(`${basePath}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const inviteUser = async (userDetails: UserDetails) => {
  try {
    const response = await apiClient.post(
      `${basePath}/inviteUser`,
      userDetails
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsersBasedOnType = async (
  pageType: string,
  id: string,
  type: string,
  page: number,
  limit: number,
  field: string,
  filterTerm: string
) => {
  try {
    const response = await apiClient.get(`${basePath}/${pageType}/${type}/${id}`, {
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
    console.error("Failed to fetch users:", error);
    throw error;
  }
};
