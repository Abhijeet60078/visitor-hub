import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";
import { OAUTH_CONFIG } from "./config/oauth";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={OAUTH_CONFIG.GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
