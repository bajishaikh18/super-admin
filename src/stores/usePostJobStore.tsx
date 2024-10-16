import { SelectOption } from "@/helpers/types";
import {create} from "zustand";

type JobPosition ={
  title:{
    value:string,
    label:string
  };
  salary: string;
  experience:string;
}


export interface Job {
  agencyId: {
    _id:string,
    name:string
  }
  location: string
  expiry: string
  positions: Position[]
  amenities: any[]
  contactNumbers: string[]
  email: string,
  country: string,
  description: string
  viewed: any[]
  status: string
  _id: string
  __v: number
}

export interface Position {
  jobTitleId: string
  experience: number
  title:string;
  salary: string
}


export type PostJobFormData =  {
  _id?:string;
  jobId?:string;
  agency?: SelectOption;
  location?: string;
  country?: string;
  expiry?: string;
  countryCode?:string;
  contactNumber?: string;
  altContactNumber?:string;
  altCountryCode?:string;
  email?: string;
  description?: string;
  jobPositions?: JobPosition[];
  experienceRequired?: string;
}

interface PostJobStoreState {
  selectedFile: File | null;
  showPostJob: boolean,
  selectedFacilities: string[];
  newlyCreatedJob: Job | null;
  formData: PostJobFormData | null;
  refreshImage: boolean;
  setFormData: (formData: PostJobFormData | null) => void
  setShowPostJob: (val:boolean)=>void
  setNewlyCreatedJob: (job:Job)=>void;
  handleFileChange: (file:any) => void;
  resetData: ()=>void;
  handleFacilityClick: (facility: string) => void;
  setRefreshImage: (val:boolean) => void;
  setFacilities:(facilities:string[])=>void;
}

const usePostJobStore = create<PostJobStoreState>((set) => ({
  // Existing state initialization
  selectedFile: null,
  showPostJob: false,
  refreshImage:false,
  selectedFacilities: [],
  newlyCreatedJob: null,
  formData: null,
  setRefreshImage:(val:boolean)=>{
    set(() => ({ refreshImage:val}))
  },
  // New actions for setting state
  setFormData: (formData)=>{
    const newData = formData || {}
    set((state) => ({ formData:{...state.formData,...newData}}))
  },
  setNewlyCreatedJob:(job)=>set(() => ({ newlyCreatedJob:job})),
  setShowPostJob:(val)=>set(() => ({ showPostJob:val})),
  
  resetData:()=>{
    set(()=>({formData:null,selectedFacilities:[],selectedFile:null}))
  },
  
  // Existing actions
  handleFileChange: (file) => {
    set({ selectedFile: file });
  },
  setFacilities: (facilities) => set((state) => ({
    selectedFacilities: facilities
  })),
  handleFacilityClick: (facility) => set((state) => ({
    selectedFacilities: state.selectedFacilities.includes(facility)
      ? state.selectedFacilities.filter((f) => f !== facility)
      : [...state.selectedFacilities, facility],
  }))
}));

export default usePostJobStore;


