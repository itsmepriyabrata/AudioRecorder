import React from "react";
import ReactDom from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDom.createRoot{document.getElementById("root")}.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="823697821061-9hgqgjh09vn5tk9ulcrvr9asras6cc8p.apps.googleusercontent.com">
            <App/>
        </GoogleOAuthProvider>
    </React.StrictMode>
)
