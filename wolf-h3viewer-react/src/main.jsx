import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "@/components/App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "@/index.css";

import { AccountProvider } from "@/context/Account.jsx";
import { TopInfoDisplayProvider } from "@/context/TopInfoDisplay";

ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <BrowserRouter>
            <AccountProvider>
                <TopInfoDisplayProvider>
                    <App />
                </TopInfoDisplayProvider>
            </AccountProvider>
        </BrowserRouter>
    </GoogleOAuthProvider>
);
