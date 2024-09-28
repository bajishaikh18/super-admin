import create from 'zustand';



export interface AuthUser {
    email: string;
    phone: string;
    _id: string;
    country: string;
}


interface UserStore {
    authUser: AuthUser | null;
    setAuthUser: (user:AuthUser) => Promise<void>;
}

export const useAuthUserStore = create<UserStore>((set) => ({
    authUser: null,
    setAuthUser: async (user) => {
        set({
            authUser: user,
        });
    }
}));