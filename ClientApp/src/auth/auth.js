import { createContext, useContext, useState } from "react"



const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {



    console.log("in auth provider");
    // console.log(user);

    // Check if there's a user in localStorage when the component is mounted
    const initialUser = JSON.parse(localStorage.getItem("user")) || null;

    const [user, setUser] = useState(initialUser);

    const login = (user) => {
    
        setUser(user);
        // Save the user information to localStorage when logging in
        localStorage.setItem("user", JSON.stringify(user));
    };
    const logout = () => {

        setUser(null)
        // Remove the user information from localStorage when logging out
      ;
        localStorage.removeItem("user");
        localStorage.removeItem("yourAuthTokenKey");
    }


    return (

        <AuthContext.Provider value={{ user, login, logout }}>
            {children}

        </AuthContext.Provider>

    )

}