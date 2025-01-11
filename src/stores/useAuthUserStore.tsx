import {create} from 'zustand';



export interface AuthUser {
    email: string;
    mobile: string;
    landline: string;
    _id: string;
    country: string;
    emailVerified:boolean;
    firstName: string;
    lastName: string;
    agencyId:string;
}


interface UserStore {
    authUser: AuthUser | null;
    role: number | null;
    setRole: (role:number) => void;
    setAuthUser: (user:AuthUser|null) => Promise<void>;
    shouldVisible:(roles:number[])=>boolean | 0 | null;
}


export const useAuthUserStore = create<UserStore>((set,get) => ({
    authUser: null,
    role:null,
    setRole:(role)=>{
        set({
            role: role,
        });
    },
    setAuthUser: async (user) => {
        set({
            authUser: user,
        });
    },
    shouldVisible:(allowedRoles: number[]) => {
        const { role } = get();
        console.log(role && allowedRoles.includes(role));
        return role && allowedRoles.includes(role);
    }  
}));