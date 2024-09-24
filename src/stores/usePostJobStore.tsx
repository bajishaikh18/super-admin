import create from "zustand";

type JobPosition ={
  title:string;
}


type PostJobFormData =  {
  agency?: string;
  location?: string;
  expiryDate?: string;
  contactNumber?: string;
  email?: string;
  description?: string;
  jobPositions?: JobPosition[];
  experienceRequired?: string;
}

interface PostJobStoreState {
  // Existing state
  selectedFile: File | null;
  isCreateJobScreen: boolean;
  isSecondJobScreen: boolean;
  isThirdScreenVisible: boolean;
  selectedFacilities: string[];
  isFourthScreenVisible: boolean;
  formData: PostJobFormData | null;
  // New actions for state management
  setFormData: (formData: PostJobFormData | null) => void
  // Existing actions
  handleFileChange: (file:any) => void;
  handleCreateNowClick: () => void;
  handleBackToPostJobClick: () => void;
  handleFacilityClick: (facility: string) => void;
  handleContinueClick: () => void;
  handleCreateJobClick: () => void;
  handleCloseThirdScreen: () => void;
  handleCloseFourthScreen: () => void;
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
  
  // Existing actions
  handleFileChange: (file) => {
    set({ selectedFile: file });
  },
  handleCreateNowClick: () => set({ isCreateJobScreen: true }),
  handleBackToPostJobClick: () => set((state) => ({
    isSecondJobScreen: false,
    isCreateJobScreen: state.isCreateJobScreen ? false : state.isCreateJobScreen,
  })),
  handleFacilityClick: (facility) => set((state) => ({
    selectedFacilities: state.selectedFacilities.includes(facility)
      ? state.selectedFacilities.filter((f) => f !== facility)
      : [...state.selectedFacilities, facility],
  })),
  handleContinueClick: () => set({ isSecondJobScreen: true }),
  handleCreateJobClick: () => {
    set({ isThirdScreenVisible: true });
    setTimeout(() => {
      set({ isThirdScreenVisible: false, isFourthScreenVisible: true });
    }, 3000);
  },
  handleCloseThirdScreen: () => set({ isThirdScreenVisible: false }),
  handleCloseFourthScreen: () => set({
    isFourthScreenVisible: false,
    isCreateJobScreen: false,
  }),
}));

export default usePostJobStore;


