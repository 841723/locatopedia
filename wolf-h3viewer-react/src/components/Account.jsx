import { useState } from "react";
import { LogIn } from "@/components/LogIn";

export function Account() {
    const [user, setUser] = useState(null);

    return (
        <main>
            {user === null && <LogIn />}
            <h1>Account</h1>
            <h2>mail:</h2>
            <h3>alvarocebrian@gmail.com</h3>
        </main>
    );
}
