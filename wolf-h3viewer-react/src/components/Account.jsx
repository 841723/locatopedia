import { useState } from "react";
import {jwtDecode} from "jwt-decode";
import { LogIn } from "@/components/LogIn";

export function Account() {
    // TODO: recuperar el estado de sessionStorage/cookie y si no hay definirle null
    const [profile, setProfile] = useState(null);

    const loggedIn = (res) => {
        const decoded = jwtDecode(res.credential);
        setProfile(decoded)
    };

    return (
        <main>
            {profile === null && <LogIn loggedIn={loggedIn}/>}
            <h1>Account</h1>
            <h2>mail:</h2>
            <h3>{profile?.email}</h3>
            <img src={profile?.picture} alt="" />
        </main>
    );
}
