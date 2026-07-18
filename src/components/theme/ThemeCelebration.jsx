import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";

function ThemeCelebration() {
  const { celebration, decorationsEnabled } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!celebration || !decorationsEnabled) {
      return;
    }

    const timeout = window.setTimeout(() => setVisible(true), 0);
    const clearTimer = window.setTimeout(() => setVisible(false), 1100);
    return () => {
      window.clearTimeout(timeout);
      window.clearTimeout(clearTimer);
    };
  }, [celebration, decorationsEnabled]);

  if (!visible) {
    return null;
  }

  return (
    <div className="theme-celebration pointer-events-none fixed inset-x-0 top-24 z-30 flex justify-center">
      <div className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/90 px-4 py-2 text-sm font-semibold text-[color:var(--text-primary)] shadow-lg backdrop-blur">
        ✨ Task complete
      </div>
    </div>
  );
}

export default ThemeCelebration;
