import { useTheme } from "../../hooks/useTheme";

function ThemeSelector() {
  const { themeId, activeTheme, themes, setThemeId, decorationsEnabled, setDecorationsEnabled } = useTheme();

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/90 p-3 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
            Appearance
          </p>
          <p className="text-sm font-semibold text-[color:var(--text-primary)]">
            {activeTheme.name}
          </p>
        </div>

        <label className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-hover)] px-3 py-1.5 text-xs font-semibold text-[color:var(--text-secondary)]">
          <input
            type="checkbox"
            checked={decorationsEnabled}
            onChange={(event) => setDecorationsEnabled(event.target.checked)}
            className="h-3.5 w-3.5 rounded border-[color:var(--border)] accent-[color:var(--primary)]"
          />
          Decorations
        </label>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
          {themes.filter((theme) => theme.group === "standard").map((theme) => {
            const isActive = theme.id === themeId;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setThemeId(theme.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--text-inverse)]"
                    : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-hover)]"
                }`}
                aria-pressed={isActive}
              >
                {theme.name}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {themes.filter((theme) => theme.group === "creative").map((theme) => {
            const isActive = theme.id === themeId;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setThemeId(theme.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--text-inverse)]"
                    : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-hover)]"
                }`}
                aria-pressed={isActive}
              >
                {theme.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ThemeSelector;
