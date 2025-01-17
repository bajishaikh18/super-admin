'use client'

import styles from './AuthHeader.module.scss'; 
import { useAuthUserStore } from '@/stores/useAuthUserStore';
import { isTokenValid } from '@/helpers/jwt';
import Image from 'next/image';
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
            <Image
              src="/logo.png"
              className={styles.logo}
              alt="Logo"
              width={136}
              height={38}
            />
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


