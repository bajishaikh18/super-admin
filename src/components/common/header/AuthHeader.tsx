'use client'
import { isTokenValid } from '@/helpers/jwt';
import styles from './AuthHeader.module.scss'; 
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export const AuthHeader = ()=>{
    const router = useRouter();
    const isAuthenticated = isTokenValid();
    useEffect(() => {
        if (!isAuthenticated) {
          router.push('/login');
        }
        if(isAuthenticated) {
            router.push('/');
        }
      }, [router]);
    return(
        <div className={styles.loginHeader}>
            <img src="./logo.png"/>
        </div>
    )
}


