'use client'
import { isTokenValid } from '@/helpers/jwt';
import styles from './AuthHeader.module.scss'; 
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUserStore } from '@/stores/useAuthUserStore';
export const AuthHeader = ()=>{
  const { setAuthUser} = useAuthUserStore();
  const loggedIn = isTokenValid();

  const logout = () => {
    localStorage.clear();
    setAuthUser(null);
    window.location.href = "/login";
  };

    return(
        <div className={styles.loginHeader}>
            <img src="./logo.png"/>
            {
                loggedIn && <a
                className={`${styles.navListItem}`}
                href="javascript:;"
                onClick={logout}
              >
                Logout
              </a>
            }
           
        </div>
    )
}


