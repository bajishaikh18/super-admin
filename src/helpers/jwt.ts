import { jwtDecode } from "jwt-decode";

export const isTokenValid = () => {
    try{
        const token = localStorage.getItem('token');
        if(!token)
         return false;
        const decodedToken = jwtDecode(token);
        if(!decodedToken)
            return false
        const currentTime = Date.now() / 1000;
        return (decodedToken.exp||0) > currentTime;
    }catch{
        return false;
    }  
  };

export const getTokenClaims = ()=>{
    try{
        const token = localStorage.getItem('token');
        if(!token)
            return null;
        const user = jwtDecode(token);
        return user;
    }catch{
        return null;
    }  
  };
