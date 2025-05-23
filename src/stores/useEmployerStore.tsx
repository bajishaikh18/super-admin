import {create} from 'zustand';


export interface Employer {
    _id: string
    adminUserId:string;
    userId:string
    email: string
    firstName: string
    lastName: string
    phone: number
    mobile?:string,
    landline?:string,
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
  

interface EmployerStore {
    active: Employer[];
    pending: Employer[];
    fetchUsers: () => Promise<void>;
}

export const useEmployerStore = create<EmployerStore>(() => ({
    active: [],
    pending: [],
    fetchUsers: async () => {
        try {
         
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    },
}));