import { useTheme } from "../../hooks/useTheme";

function ThemeDecorations() {
  const { decorationsEnabled, activeTheme } = useTheme();

  if (!decorationsEnabled) {
    return null;
  }

  const decorationMap = {
    "simple-light": [<div key="light-1" className="theme-decoration absolute left-6 top-6 h-16 w-16 rounded-full border border-[color:var(--border)] opacity-60" />],
    "simple-dark": [<div key="dark-1" className="theme-decoration absolute right-10 top-8 text-xl opacity-60">🌙</div>, <div key="dark-2" className="theme-decoration absolute right-24 top-20 text-sm opacity-50">✦</div>],
    "cozy-pastel": [<div key="pastel-1" className="theme-decoration absolute left-8 top-8 text-2xl opacity-70">🌸</div>, <div key="pastel-2" className="theme-decoration absolute right-10 top-12 text-xl opacity-70">☁️</div>, <div key="pastel-3" className="theme-decoration absolute bottom-8 left-8 text-lg opacity-60">✨</div>],
    "midnight-pro": [<div key="midnight-1" className="theme-decoration absolute right-10 top-8 h-3 w-3 rounded-full bg-[color:var(--accent)] opacity-80" />,
      <div key="midnight-2" className="theme-decoration absolute left-10 top-12 h-2 w-2 rounded-full bg-[color:var(--primary)] opacity-70" />],
    "comic-pop": [<div key="comic-1" className="theme-decoration absolute right-8 top-10 text-2xl opacity-75">⚡</div>, <div key="comic-2" className="theme-decoration absolute left-8 bottom-8 text-xl opacity-70">★</div>],
    "minimal-zen": [<div key="zen-1" className="theme-decoration absolute right-10 top-10 h-14 w-14 rounded-full border border-[color:var(--border)] opacity-70" />],
    "forest-focus": [<div key="forest-1" className="theme-decoration absolute left-6 top-10 text-2xl opacity-70">🍃</div>, <div key="forest-2" className="theme-decoration absolute bottom-8 right-10 text-lg opacity-70">🍄</div>],
    "pixel-retro": [<div key="pixel-1" className="theme-decoration absolute right-8 top-12 text-xl opacity-70">⭐</div>, <div key="pixel-2" className="theme-decoration absolute left-8 bottom-10 text-lg opacity-70">🪙</div>],
  };

  const decorations = decorationMap[activeTheme.id] ?? decorationMap["simple-light"];

  return <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">{decorations}</div>;
}

export default ThemeDecorations;
