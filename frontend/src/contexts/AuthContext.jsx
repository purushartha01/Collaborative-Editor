import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem("accessToken")) || null);
    const [refreshToken, setRefreshToken] = useState(JSON.parse(localStorage.getItem("refreshToken")) || null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);


    const assignUser = (user) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    }

    const assignTokens = (accessToken, refreshToken) => {
        setAccessToken(accessToken);
        localStorage.setItem("accessToken", JSON.stringify(accessToken));
        setRefreshToken(refreshToken);
        localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
    }

    return <AuthContext.Provider value={{ user, accessToken, refreshToken, assignUser, assignTokens }}>
        {children}
    </AuthContext.Provider>;
};

export { AuthContext, AuthProvider };