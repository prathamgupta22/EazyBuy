import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth.jsx";
import "antd/dist/reset.css";
import { SearchProvider } from "./context/search.jsx";
import { CartProvider } from "./context/cart.jsx";
import axios from "axios";

axios.defaults.baseURL = "https://eazybuy-1.onrender.com/";
axios.defaults.withCredentials = true;

https: ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SearchProvider>
      <CartProvider>
        <BrowserRouter>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </BrowserRouter>
      </CartProvider>
    </SearchProvider>
  </AuthProvider>
);
