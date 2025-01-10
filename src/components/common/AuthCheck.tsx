'use client'
import { isTokenValid } from '@/helpers/jwt';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthUser, useAuthUserStore } from '@/stores/useAuthUserStore';
import { getUserDetails } from '@/apis/user';
import { ROLE } from '@/helpers/constants';

const ALLOWEDPATH = ['/login','/register']
export const AuthCheck = ({children}:{children:any})=>{
    const router = useRouter();
    const pathname = usePathname()
    const {authUser,setAuthUser, role}=  useAuthUserStore();
    const isAuthenticated = isTokenValid();
    
    const getUser =async ()=>{
      const resp = await getUserDetails();
      setAuthUser(resp.userDetails as AuthUser)
    }

    useEffect(()=>{
      if(isTokenValid() && !authUser){
        getUser()
      }
    },[])

    useEffect(()=>{
      if(authUser){
        if(role === ROLE.employer && !authUser?.emailVerified){
          router.push("/verify");
          return;
        }
        if(role === ROLE.employer && !authUser?.agencyId){
          router.push("/create-agency");
          return;
        }
      }
    },[router,authUser])

    useEffect(() => {
        if (!isAuthenticated && !ALLOWEDPATH.includes(pathname)) {
          router.push('/login');
        }
        if(isAuthenticated && ALLOWEDPATH.includes(pathname)) {
            router.push('/');
        }
      }, [router]);
    
    return(
       <>
       {(isAuthenticated || ALLOWEDPATH.includes(pathname)) && children}
       </>
    )
}


