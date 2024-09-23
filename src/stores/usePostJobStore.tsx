import create from "zustand";

type JobPosition ={
  title:string;
}

interface PostJobStoreState {
  // Existing state
  selectedFile: File | null;
  isCreateJobScreen: boolean;
  isSecondJobScreen: boolean;
  isThirdScreenVisible: boolean;
  isFourthScreenVisible: boolean;
  selectedFacilities: string[];
  experienceRequired: string;
  contactNumber: string;
  email: string;
  description: string;
  agency: string;
  location: string;
  type: string;
  salaryFrom: string;
  salaryTo: string;
  expiryDate: string;
  jobPositions: JobPosition[];

  // New actions for state management
  setAgency: (agency: string) => void;
  setLocation: (location: string) => void;
  setType: (type: string) => void;
  setSalaryFrom: (salary: string) => void;
  setSalaryTo: (salary: string) => void;
  setExpiryDate: (date: string) => void;
  setExperienceRequired: (experience: string) => void;

  // New actions
  setContactNumber: (number: string) => void;
  setEmail: (email: string) => void;
  setDescription: (description: string) => void;
  setJobPositions: (positions: JobPosition[]) => void

  // Existing actions
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  experienceRequired: "0",
  contactNumber: "",
  email: "",
  description: "",
  agency: "",
  location: "",
  type: "",
  salaryFrom: "",
  salaryTo: "",
  expiryDate: "",
  jobPositions: [],

  // New actions for setting state
  setAgency: (agency) => set({ agency }),
  setLocation: (location) => set({ location }),
  setType: (type) => set({ type }),
  setSalaryFrom: (salary) => set({ salaryFrom: salary }),
  setSalaryTo: (salary) => set({ salaryTo: salary }),
  setExpiryDate: (date) => set({ expiryDate: date }),
  setExperienceRequired: (experience) => set({ experienceRequired: experience }),

  // New actions
  setContactNumber: (number) => set({ contactNumber: number }),
  setEmail: (email) => set({ email }),
  setDescription: (description) => set({ description }),
  setJobPositions: (positions) => set({ jobPositions: positions }),

  // Existing actions
  handleFileChange: (event) => {
    const file = event.target.files ? event.target.files[0] : null;
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


