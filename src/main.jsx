import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {  QueryClient,  QueryClientProvider,} from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import ThemeProvider from "./context/ThemeProvider";
import { DECORATIONS_STORAGE_KEY, THEME_STORAGE_KEY, defaultThemeId, isValidThemeId } from "./config/themes";

const queryClient = new QueryClient();

const storedTheme = typeof window !== "undefined" ? window.localStorage.getItem(THEME_STORAGE_KEY) : null;
const storedDecorations = typeof window !== "undefined" ? window.localStorage.getItem(DECORATIONS_STORAGE_KEY) : null;

if (typeof document !== "undefined") {
  const themeId = isValidThemeId(storedTheme) ? storedTheme : defaultThemeId;
  document.documentElement.dataset.theme = themeId;
  document.documentElement.dataset.decorations = storedDecorations === "off" ? "off" : "on";
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
