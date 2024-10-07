import create from "zustand";

type JobPosition ={
  title:{
    value:string,
    label:string
  };
  salary: string;
  experience:string;
}


export interface Job {
  agencyId: string
  location: string
  expiry: string
  positions: Position[]
  amenities: any[]
  contactNumbers: string[]
  email: string
  description: string
  viewed: any[]
  status: string
  _id: string
  __v: number
}

export interface Position {
  positionId: string
  experience: number
  salary: string
}


export type PostJobFormData =  {
  agency?: string;
  location?: string;
  targetCountry?: string;
  expiryDate?: string;
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
  setFormData: (formData: PostJobFormData | null) => void
  setShowPostJob: (val:boolean)=>void
  setNewlyCreatedJob: (job:Job)=>void;
  handleFileChange: (file:any) => void;
  resetData: ()=>void;
  handleFacilityClick: (facility: string) => void;
}

const usePostJobStore = create<PostJobStoreState>((set) => ({
  // Existing state initialization
  selectedFile: null,
  showPostJob: false,
  selectedFacilities: [],
  newlyCreatedJob: null,
  formData: null,
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
  handleFacilityClick: (facility) => set((state) => ({
    selectedFacilities: state.selectedFacilities.includes(facility)
      ? state.selectedFacilities.filter((f) => f !== facility)
      : [...state.selectedFacilities, facility],
  }))
}));

export default usePostJobStore;


