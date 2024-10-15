import { create } from 'zustand';


 export type AgencyType ={
    _id: string;
    name: string,
    email: string,
    phone: string,
    address: string,
    approved: boolean,
    createdAt: string,
    status: string,
    profilePic: string,
    state: string,
    city: string,
    jobposts: string,
}


interface AgencyStoreState {
    agencies: AgencyType[];  
    addAgency: (agency: AgencyType) => void;  
    updateAgency: (id: string, updatedData: Partial<AgencyType>) => void;  
    removeAgency: (id: string) => void;  
    setAgencies: (agencies: AgencyType[]) => void;  
  }

  export const useAgencyStore = create<AgencyStoreState>((set) => ({
    agencies: [],
  
    addAgency: (agency) => set((state) => ({
      agencies: [...state.agencies, agency],
    })),
  
    updateAgency: (id, updatedData) => set((state) => ({
      agencies: state.agencies.map((agency) =>
        agency._id === id ? { ...agency, ...updatedData } : agency
      ),
    })),
  
    removeAgency: (id) => set((state) => ({
      agencies: state.agencies.filter((agency) => agency._id !== id),
    })),
  
    setAgencies: (agencies) => set(() => ({ agencies })),
  }));
  



export default useAgencyStore;

