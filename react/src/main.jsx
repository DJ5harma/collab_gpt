import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./providers/UserProvider.js";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <>
            <Toaster />
            <UserProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </UserProvider>
        </>
    </StrictMode>
);
