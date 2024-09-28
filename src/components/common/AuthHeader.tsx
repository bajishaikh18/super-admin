'use client'
import { isTokenValid } from '@/helpers/jwt';
import styles from './AuthHeader.module.scss'; 
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export const AuthHeader = ()=>{
    const router = useRouter();
    useEffect(() => {
        if (isTokenValid()) {
          router.push('/dashboard');
        }
      }, [router]);
    
    return(
        <div className={styles.loginHeader}>
            <img src="./logo.png"/>
        </div>
    )
}


