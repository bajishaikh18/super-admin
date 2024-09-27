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

export interface Active {
    postid: string;
    agencyname: string;
    jobtype: string;
    location: string;
    salary: string;
    benefits: string;
    noofpositions: string;
    media: string;
    posteddate: string;
    expiry: string;
}

export interface AdminUser {
    name: string;
    mobile: string;
    email: string;
}

export interface Pending {
    postid: string;
    agencyname: string;
}
export interface Expired {
    postid: string;
    agencyname: string;
}


interface UserStore {
    appUsers: AppUser[];
    adminUsers: AdminUser[];
    active: Active[];
    pending: Pending[];
    expired: Expired[];
    fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    appUsers: [],
    adminUsers: [],
    active: [],
    pending: [],
    expired: [],
    fetchUsers: async () => {
        try {
            const usersResponse = await fetch('/users.json');
            if (!usersResponse.ok) {
                throw new Error(`Error fetching users: ${usersResponse.statusText}`);
            }
            const usersData = await usersResponse.json();

            const dataResponse = await fetch('/data.json');
            if (!dataResponse.ok) {
                throw new Error(`Error fetching data: ${dataResponse.statusText}`);
            }
            const data = await dataResponse.json();

            set({
                appUsers: usersData.appUsers || [],
                adminUsers: usersData.adminUsers || [],
                active: data.active || [],
                pending: data.pending || [],
                expired: data.expired || [],
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    },
}));