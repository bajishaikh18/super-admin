import { create } from "zustand";

export type AgencyType = {
  _id: string;
  name: string;
  regNo: string;
  agencyId: string;
  email: string;
  phone: string;
  address: string;
  approved: boolean;
  createdAt: string;
  status: string;
  profilePic: string;
  state: string;
  city: string;
  latitude:string,
  longitude:string,
  postedJobs: number;
  website: string;
  activeJobCount: number;
  expiredJobCount: number;
};

export interface Agency {
  _id: string;
  name: string;
  agencyId: string;
  email: string;
  phone: string;
  address: string;
  approved: boolean;
  createdAt: string;
  status: string;
  profilePic: string;
  state: string;
  city: string;
  jobposts: string;
}

export type CreateAgencyFormData = {
  _id?: string;
  name?: string;
  countryCode?: string;
  state?:string;
  city?:string;
  regNo?:string;
  website?:string;
  address?:string;
  contactNumber?: string;
  altContactNumber?: string;
  altCountryCode?: string;
  agencyId?:string;
  email?: string;
};

interface AgencyStoreState {
  agencies: AgencyType[];
  setAgencies: (agencies: AgencyType[]) => void;
  selectedFile: File | null;
  handleFileChange: (file: any) => void;
  resetData: () => void;
  showCreateAgency: boolean;
  setShowCreateAgency: (val: boolean) => void;
  formData: CreateAgencyFormData | null;
  setFormData: (formData: CreateAgencyFormData | null) => void;
}

export const useAgencyStore = create<AgencyStoreState>((set) => ({
  agencies: [],
  setAgencies: (agencies) => set({ agencies }),
  selectedFile: null,

  handleFileChange: (file) => {
    set({ selectedFile: file });
  },

  resetData: () => {
    set(() => ({ formData: null , selectedFile: null }));
  },

  showCreateAgency: false,

  setShowCreateAgency: (val) => set(() => ({ showCreateAgency: val })),
  formData: null,
  setFormData: (formData)=>{
    const newData = formData || {}
    set((state) => ({ formData:{...state.formData,...newData}}))
  },
}));

export default useAgencyStore;
