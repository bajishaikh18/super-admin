import create from 'zustand';


export interface AppUser {
    name: string;
    mobile: string;
    email: string;
    state: string;
    jobTitle: string;
    industry: string;
    experience: string;
    gulfExp: string;
    cv: string;
    video: string;
    regdDate: string;
    status: string;
}

export interface AdminUser {
    name: string;
    mobile: string;
    email: string;
}


interface UserStore {
    appUsers: AppUser[];
    adminUsers: AdminUser[];
    fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    appUsers: [],
    adminUsers: [],
    fetchUsers: async () => {
        const response = await fetch('/users.json');
        const data = await response.json();
        set({
            appUsers: data.appUsers,
            adminUsers: data.adminUsers
        });
    }
}));