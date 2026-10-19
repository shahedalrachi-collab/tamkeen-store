import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "flag-icons/css/flag-icons.min.css";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { LanguageProvider } from "./Context/LanguageContext.jsx";
import { CartProvider } from "./Context/CartContext.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { FavoriteProvider } from "./Context/Favoritescontext.jsx";
import { AdminAuthProvider } from "./Context/Adminauthcontext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <AdminAuthProvider>
              <CartProvider>
                <FavoriteProvider>
                  <App />
                </FavoriteProvider>
              </CartProvider>
            </AdminAuthProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);