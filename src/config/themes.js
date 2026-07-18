export const THEME_STORAGE_KEY = "taskflow-theme";
export const DECORATIONS_STORAGE_KEY = "taskflow-decorations";

export const themes = [
  {
    id: "simple-light",
    name: "Simple Light",
    group: "standard",
    accent: "#2563eb",
    companion: "plant",
    description: "Clean, bright, and professional.",
  },
  {
    id: "simple-dark",
    name: "Simple Dark",
    group: "standard",
    accent: "#8b5cf6",
    companion: "cat",
    description: "Calm dark mode for focused work.",
  },
  {
    id: "cozy-pastel",
    name: "Cozy Pastel",
    group: "creative",
    accent: "#ec4899",
    companion: "bunny",
    description: "Soft, cute, and gentle.",
  },
  {
    id: "midnight-pro",
    name: "Midnight Pro",
    group: "creative",
    accent: "#38bdf8",
    companion: "robot",
    description: "Premium dark with subtle glow.",
  },
  {
    id: "comic-pop",
    name: "Comic Pop",
    group: "creative",
    accent: "#ef4444",
    companion: "dog",
    description: "Bold comic-inspired energy.",
  },
  {
    id: "minimal-zen",
    name: "Minimal Zen",
    group: "creative",
    accent: "#6b8f71",
    companion: "bonsai",
    description: "Quiet neutral focus.",
  },
  {
    id: "forest-focus",
    name: "Forest Focus",
    group: "creative",
    accent: "#2f7d4c",
    companion: "fox",
    description: "Earthy and organic.",
  },
  {
    id: "pixel-retro",
    name: "Pixel Retro",
    group: "creative",
    accent: "#22d3ee",
    companion: "pixel",
    description: "Retro-inspired without losing readability.",
  },
];

export const defaultThemeId = "simple-light";

export const themeIds = themes.map((theme) => theme.id);

export function isValidThemeId(themeId) {
  return themeIds.includes(themeId);
}

export function getThemeById(themeId) {
  return themes.find((theme) => theme.id === themeId) ?? themes[0];
}
