import create from 'zustand';


export interface User {
    _id: string
    email: string
    firstName: string
    lastName: string
    phone: number
    industry: string,
    state: string,
    totalExperience: string,
    resume: {
        keyName:string
    },
    workVideo: {
        keyName:string
    },
    status: string,
    dob: string
    country: string
    currentJobTitle: string
    gulfExperience: boolean,
    createdAt: string;
    lastLoginDate:string;
  }
  

interface UserStore {
    appUsers: User[];
    adminUsers: User[];
    fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    appUsers: [],
    adminUsers: [],
    fetchUsers: async () => {
        try {
         
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    },
}));