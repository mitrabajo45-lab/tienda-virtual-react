import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // 👈 Importamos el AuthProvider
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>       {/* 👈 Envolvemos toda la app aquí */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
