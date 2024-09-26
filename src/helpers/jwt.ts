import { jwtDecode } from "jwt-decode";

export const isTokenValid = () => {
    try{
        const token = localStorage.getItem('token');
        if(!token)
         return false;
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
    }catch(e){
        return false;
    }  
  };

export const getTokenClaims = (token:string)=>{
    try{
        if(!token)
            return null;
        const user = jwtDecode(token);
        console.log(user);
        return user;
    }catch(e){
        return null;
    }  
  };
