import { useCookie } from "@/hooks/useCookie";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";


export const AccountContext = createContext({});

export function AccountProvider({ children }) {
    const [credentialCookie, credentialUpdateCookie, credentialDeleteCookie] =
        useCookie("credential");

    useEffect(() => {
        console.log("Checking if token is expired");
        if (credentialCookie) {
            const decoded = jwtDecode(credentialCookie);
            console.log(decoded);

            const { exp } = decoded;
            if (exp * 1000 < Date.now()) {
                logout();
            }
        }
        else {
            console.log("No token found");
            logout();
        }
    }, [credentialCookie, credentialDeleteCookie]);

    const [token, setToken] = useState(null);
    const [decoded, setDecoded] = useState(null);

    const login = (res) => {
        const decodedToken = jwtDecode(res.credential);
        credentialUpdateCookie(res.credential, decodedToken.exp);
        setToken(res.credential);
        setDecoded(decodedToken);
    };

    const logout = () => {
        credentialDeleteCookie();
        googleLogout();
        setToken(null);
        setDecoded(null);
    };

    const isLoggedIn = () => {
        return credentialCookie ? true : false;
    };

    return (
        <AccountContext.Provider
            value={{
                login,
                logout,
                isLoggedIn,
                getToken: () => token,
                getData: () => decoded,
            }}
        >
            {children}
        </AccountContext.Provider>
    );
}
