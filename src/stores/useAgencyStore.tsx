import { create } from 'zustand';


 export type AgencyType ={
    _id: string;
    name: string,
    regNo: string,
    agencyId:string,
    email: string,
    phone: string,
    address: string,
    approved: boolean,
    createdAt: string,
    status: string,
    profilePic: string,
    state: string,
    city: string,
    postedJobs: number,
    website:string,
    activeJobCount: number;
    expiredJobCount: number;
}


interface AgencyStoreState {
    state: string;
    setState: (state: string) => void;
    city: string;
    setCity: (city: string) => void;
    agencies: AgencyType[];
    setAgencies: (agencies: AgencyType[])=> void
  }

  export const useAgencyStore = create<AgencyStoreState>((set) => ({
    state: '',
    setState: (state) => set ({ state: state}),
    city: '',
    setCity: (city) => set ({ city: city}),
    agencies: [],
    setAgencies: (agencies) => set({ agencies})
  
  }));
  



export default useAgencyStore;

