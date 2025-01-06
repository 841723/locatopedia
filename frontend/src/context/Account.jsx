import { useCookie } from "@/lib/useCookie";
import { jwtDecode } from "jwt-decode";
import { createContext, useState } from "react";

export const AccountContext = createContext({});

export function AccountProvider({ children }) {
    const [
        credentialCookie,
        credentialUpdateCookie,
        credentialDeleteCookie,
    ] = useCookie("credential");

    const [data, setData] = useState(
        credentialCookie ? jwtDecode(credentialCookie) : null
    );

    const login = (res) => {
        credentialUpdateCookie(res.credential, { expires: 1 });
        const newData = jwtDecode(res.credential);
        setData(newData);
    };

    const logout = () => {
        credentialDeleteCookie();
        setData(null);
    };

    const getData = () => {
        return data;
    };

    const isLoggedIn = () => {
        return credentialCookie ? true : false;
    };

    return (
        <AccountContext.Provider
            value={{
                login,
                logout,
                getData,
                isLoggedIn,
                data,
            }}
        >
            {children}
        </AccountContext.Provider>
    );
}
