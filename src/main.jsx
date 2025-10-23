import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProductsProvider } from "./context/ProductsContext.jsx"; // 👈 IMPORTARLO
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductsProvider>   {/* 👈 ENVOLVEMOS AQUÍ */}
          <App />
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
