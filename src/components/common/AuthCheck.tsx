'use client'
import { isTokenValid } from '@/helpers/jwt';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const ALLOWEDPATH = ['/login','/reset-password']
export const AuthCheck = ({children}:{children:any})=>{
    const router = useRouter();
    const pathname = usePathname()
    const isAuthenticated = isTokenValid();
    useEffect(() => {
        if (!isAuthenticated && !ALLOWEDPATH.includes(pathname)) {
          router.push('/login');
        }
        if(isAuthenticated && ALLOWEDPATH.includes(pathname)) {
            router.push('/dashboard');
        }
      }, [router]);
    
    return(
       <>
       
       {(isAuthenticated || ALLOWEDPATH.includes(pathname)) && children}
       </>
    )
}


