import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser]= useState(null);
    
    const [token,setToken]=useState(null);
    function login ({user,token}){
        setUser(user);
        setToken(token);
    }
    function logout(){
        setUser(null);
        setToken(null);
    }
     
    return(
        <AuthContext.Provider value={{user,token,login,logout}}>
          {children}
        </AuthContext.Provider>
    );
}
//null used because it is more clearer
export function useAuth() {
    return useContext(AuthContext);
}