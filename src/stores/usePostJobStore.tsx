import create from "zustand";

type JobPosition ={
  title:string;
  salary: string;
  experience:string;
}


export type PostJobFormData =  {
  agency?: string;
  location?: string;
  expiryDate?: string;
  countryCode?:string;
  contactNumber?: string;
  email?: string;
  description?: string;
  jobPositions?: JobPosition[];
  experienceRequired?: string;
}

interface PostJobStoreState {
  selectedFile: File | null;
  selectedFacilities: string[];
  formData: PostJobFormData | null;
  setFormData: (formData: PostJobFormData | null) => void
  handleFileChange: (file:any) => void;
  resetData: ()=>void;
  handleFacilityClick: (facility: string) => void;
}

const usePostJobStore = create<PostJobStoreState>((set) => ({
  // Existing state initialization
  selectedFile: null,
  isCreateJobScreen: false,
  isSecondJobScreen: false,
  isThirdScreenVisible: false,
  isFourthScreenVisible: false,
  selectedFacilities: [],
  formData: null,
  // New actions for setting state
  setFormData: (formData)=>{
    const newData = formData || {}
    set((state) => ({ formData:{...state.formData,...newData}}))
  },
  resetData:()=>{
    set(()=>({formData:null,selectedFacilities:[]}))
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


