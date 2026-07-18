import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";

function Header() {
  const { user } = useAuth();
  const { activeTheme } = useTheme();
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const themeInitials = activeTheme.name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="theme-header sticky top-0 z-30 flex flex-col gap-3 border-b px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
          Workspace
        </p>
        <p className="text-sm font-semibold text-[color:var(--text-primary)]">
          Project Management
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-[color:var(--text-primary)]">
            {user?.name || "TaskFlow User"}
          </p>
          <p className="text-xs text-[color:var(--text-muted)]">
            {user?.email || "Ready to plan"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="theme-avatar flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm ring-4 ring-[color:color-mix(in_srgb,var(--primary)_18%,transparent)]">
            {initials}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-xs font-semibold text-[color:var(--text-primary)] shadow-sm">
            {themeInitials}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
