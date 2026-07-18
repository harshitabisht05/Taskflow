import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DECORATIONS_STORAGE_KEY,
  THEME_STORAGE_KEY,
  defaultThemeId,
  getThemeById,
  isValidThemeId,
  themes,
} from "../config/themes";
import { ThemeContext } from "./ThemeContext";

function getStoredTheme() {
  if (typeof window === "undefined") {
    return defaultThemeId;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  return isValidThemeId(storedTheme)
    ? storedTheme
    : defaultThemeId;
}

function getStoredDecorationsPreference() {
  if (typeof window === "undefined") {
    return true;
  }

  return window.localStorage.getItem(DECORATIONS_STORAGE_KEY) !== "off";
}

function applyThemeAttributes(themeId, decorationsEnabled) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = themeId;
  document.documentElement.dataset.decorations = decorationsEnabled
    ? "on"
    : "off";
}

function ThemeProvider({ children }) {
  const [themeId, setThemeIdState] = useState(getStoredTheme);
  const [decorationsEnabled, setDecorationsEnabled] =
    useState(getStoredDecorationsPreference);
  const [celebration, setCelebration] = useState(null);

  useEffect(() => {
    applyThemeAttributes(themeId, decorationsEnabled);
    window.localStorage.setItem(THEME_STORAGE_KEY, themeId);
    window.localStorage.setItem(
      DECORATIONS_STORAGE_KEY,
      decorationsEnabled ? "on" : "off"
    );
  }, [themeId, decorationsEnabled]);

  const setThemeId = useCallback((nextThemeId) => {
    setThemeIdState(
      isValidThemeId(nextThemeId)
        ? nextThemeId
        : defaultThemeId
    );
  }, []);

  const triggerCelebration = useCallback(
    (source = "task-complete") => {
      if (!decorationsEnabled) {
        return;
      }

      setCelebration({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        source,
      });
    },
    [decorationsEnabled]
  );

  const value = useMemo(
    () => ({
      themeId,
      activeTheme: getThemeById(themeId),
      themes,
      setThemeId,
      decorationsEnabled,
      setDecorationsEnabled,
      celebration,
      triggerCelebration,
    }),
    [themeId, decorationsEnabled, celebration, setThemeId, triggerCelebration]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
