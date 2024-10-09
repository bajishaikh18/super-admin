import { create } from 'zustand';

 interface AgencyStore {
    filter: string;
    setFilter: (filter: string) => void;
    search: string;
    setSearch: (search: string) => void;
}

export const useAgencyStore = create<AgencyStore>((set) => ({
    filter: '',
    setFilter: (filter: string) => set ({ filter }),
    search: '',
    setSearch: (search: string) => set({ search }),
}))


