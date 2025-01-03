import { createContext, useState } from "react";

export const TopInfoDisplayContext = createContext({});

export function TopInfoDisplayProvider({ children }) {
    const [state, setState] = useState(0);
    const [text, setText] = useState("Article saved successfully");

    return (
        <TopInfoDisplayContext.Provider
            value={{
                state, setState,
                text, setText,
            }}
        >
            {children}
        </TopInfoDisplayContext.Provider>
    );
}
