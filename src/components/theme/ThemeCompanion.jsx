import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";

const companionMap = {
  "simple-light": { type: "plant", label: "Desk plant" },
  "simple-dark": { type: "cat", label: "Sleeping cat" },
  "cozy-pastel": { type: "bunny", label: "Cute bunny" },
  "midnight-pro": { type: "robot", label: "Futuristic robot" },
  "comic-pop": { type: "dog", label: "Cartoon dog" },
  "minimal-zen": { type: "bonsai", label: "Bonsai tree" },
  "forest-focus": { type: "fox", label: "Forest fox" },
  "pixel-retro": { type: "pixel", label: "Pixel pet" },
};

function ThemeCompanion() {
  const { activeTheme, decorationsEnabled, celebration } = useTheme();
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    if (!celebration) {
      return;
    }

    const timeout = window.setTimeout(() => setIsCelebrating(true), 0);
    return () => window.clearTimeout(timeout);
  }, [celebration]);

  if (!decorationsEnabled) {
    return null;
  }

  const companion = companionMap[activeTheme.id] ?? companionMap["simple-light"];

  return (
    <div className="theme-companion pointer-events-none fixed bottom-4 right-4 z-20 hidden w-28 sm:block lg:w-32">
      <div className={`relative flex items-end justify-center transition-transform ${isCelebrating ? "scale-105" : ""}`}>
        <div className="absolute bottom-0 left-1/2 h-8 w-20 -translate-x-1/2 rounded-full blur-2xl opacity-50" style={{ background: "color-mix(in srgb, var(--primary) 20%, transparent)" }} />
        <div className="relative rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/90 px-3 py-2 shadow-lg backdrop-blur">
          <div className="text-4xl sm:text-5xl" aria-label={companion.label} role="img">
            {companion.type === "plant" && "🪴"}
            {companion.type === "cat" && "🐈"}
            {companion.type === "bunny" && "🐰"}
            {companion.type === "robot" && "🤖"}
            {companion.type === "dog" && "🐶"}
            {companion.type === "bonsai" && "🌿"}
            {companion.type === "fox" && "🦊"}
            {companion.type === "pixel" && "👾"}
          </div>
          {isCelebrating && (
            <div className="theme-celebration-pop absolute -top-6 left-1/2 -translate-x-1/2 text-sm">
              {activeTheme.id === "comic-pop" ? "Nice!" : "✨"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThemeCompanion;
