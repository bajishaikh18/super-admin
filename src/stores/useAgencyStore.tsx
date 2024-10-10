import { create } from 'zustand';


 export type AgencyType ={
    _id: string;
    agencyName: string;
    email: string;
    phone: string;
}


 export interface AgencyStore {
  "name": "test",
  "email": "test3@gmail.com",
  "phone": 123344566,
  "address": "xyz",
  "approved": true,
  "createdAt": "2024-09-10T23:59:59.000+00:00",
  "status": "active",
  "profilePic": "https://img.etimg.com/thumb/width-640,height-480,imgsize-94829,resizemode-75,msid-79521648/jobs/india-inc-warms-up-to-recruitment-theme-this-winter/hiring-agencies.jpg",
  "state": "Karnataka",
  "city": "Bengaluru"
    
}



  interface AgencyStoreState {
    

  }

export const useAgencyStore = create<AgencyStoreState>((set) => ({
    
}))

export default useAgencyStore;


