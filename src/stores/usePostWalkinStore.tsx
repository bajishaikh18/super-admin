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


export interface Walkin {
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
  interviewDate: string;
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


export type PostWalkinFormData =  {
  _id?:string;
  interviewId?:string;
  agency?: SelectOption;
  location?: string;
  country?: string;
  expiry?: string;
  state?: string;
  countryCode?:string;
  contactNumber?: string;
  altContactNumber?:string;
  altCountryCode?:string;
  email?: string;
  interviewDate?: string;
  interviewLocation?: string;
  interviewAddress?: string;
  latitude?:string;
  longitude?:string;
  description?: string;
  jobPositions?: JobPosition[];
  experienceRequired?: string;
}

interface PostWalkinStoreState {
  selectedFile: File | null;
  showPostWalkin: boolean,
  selectedFacilities: string[];
  newlyCreatedWalkin: Walkin | null;
  formData: PostWalkinFormData | null;
  refreshImage: boolean;
  setFormData: (formData: PostWalkinFormData | null) => void
  setShowPostWalkin: (val:boolean)=>void
  setNewlyCreatedWalkin: (job:Walkin)=>void;
  handleFileChange: (file:any) => void;
  resetData: ()=>void;
  handleFacilityClick: (facility: string) => void;
  setRefreshImage: (val:boolean) => void;
  setFacilities:(facilities:string[])=>void;
}

const usePostWalkinStore = create<PostWalkinStoreState>((set) => ({
  // Existing state initialization
  selectedFile: null,
  showPostWalkin: false,
  refreshImage:false,
  selectedFacilities: [],
  newlyCreatedWalkin: null,
  formData: null,
  setRefreshImage:(val:boolean)=>{
    set(() => ({ refreshImage:val}))
  },
  // New actions for setting state
  setFormData: (formData)=>{
    const newData = formData || {}
    set((state) => ({ formData:{...state.formData,...newData}}))
  },
  setNewlyCreatedWalkin:(job)=>set(() => ({ newlyCreatedWalkin:job})),
  setShowPostWalkin:(val)=>set(() => ({ showPostWalkin:val})),
  
  resetData:()=>{
    set(()=>({formData:null,selectedFacilities:[],selectedFile:null}))
  },
  
  // Existing actions
  handleFileChange: (file) => {
    set({ selectedFile: file });
  },
  setFacilities: (facilities) => set(() => ({
    selectedFacilities: facilities
  })),
  handleFacilityClick: (facility) => set((state) => ({
    selectedFacilities: state.selectedFacilities.includes(facility)
      ? state.selectedFacilities.filter((f) => f !== facility)
      : [...state.selectedFacilities, facility],
  }))
}));

export default usePostWalkinStore;


