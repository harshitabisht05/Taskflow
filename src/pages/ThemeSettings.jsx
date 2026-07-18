import { useTheme } from "../hooks/useTheme";

function ThemeSettings() {
  const {
    themeId,
    activeTheme,
    themes,
    setThemeId,
    decorationsEnabled,
    setDecorationsEnabled,
  } = useTheme();

  return (
    <div className="app-page">
      <div className="page-shell">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
              Appearance
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
              Theme Settings
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)]">
              Choose the visual style for TaskFlow and toggle decorations for the whole app.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                Selected theme
              </p>
              <p className="mt-2 text-sm font-semibold text-[color:var(--text-primary)]">
                {activeTheme.name}
              </p>
              <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                {activeTheme.description}
              </p>
            </div>

            <label className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-hover)] px-3 py-2 text-sm text-[color:var(--text-secondary)]">
              <input
                type="checkbox"
                checked={decorationsEnabled}
                onChange={(event) => setDecorationsEnabled(event.target.checked)}
                className="h-4 w-4 rounded border-[color:var(--border)] accent-[color:var(--primary)]"
              />
              Enable decorations
            </label>
          </div>
        </div>

        <section className="mt-10 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                Theme collection
              </p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--text-primary)]">
                Pick a look that fits your workflow.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {themes.map((theme) => {
              const isActive = theme.id === themeId;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemeId(theme.id)}
                  className={`group flex flex-col items-start rounded-3xl border p-5 text-left transition hover:border-[color:var(--primary)] hover:shadow-lg ${
                    isActive
                      ? "border-[color:var(--primary)] bg-[color:var(--primary)]/10"
                      : "border-[color:var(--border)] bg-[color:var(--card)]"
                  }`}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--surface-hover)] text-lg font-bold text-[color:var(--text-primary)]">
                    {theme.name
                      .split(" ")
                      .map((part) => part.charAt(0))
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-[color:var(--text-primary)]">
                      {theme.name}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
                      {theme.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ThemeSettings;
