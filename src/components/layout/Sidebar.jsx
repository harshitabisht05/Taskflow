import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import ThemeSelector from "../theme/ThemeSelector";

function Sidebar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    queryClient.clear();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="theme-sidebar sticky top-0 flex h-screen w-20 shrink-0 flex-col border-r px-3 py-5 md:w-68 md:px-5">
      <div className="mb-8 flex items-center justify-center gap-3 md:justify-start">
        <div className="theme-avatar flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black">
          TF
        </div>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold tracking-tight">
            TaskFlow
          </h1>
          <p className="text-xs font-medium text-[color:var(--sidebar-muted)]">
            Plan, assign, ship
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `theme-sidebar-link flex items-center justify-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition md:justify-start ${
              isActive ? "theme-sidebar-active shadow-sm" : ""
            }`
          }
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-current/10 text-sm">
            D
          </span>
          <span className="hidden md:inline">Dashboard</span>
        </NavLink>
        <NavLink
          to="/themes"
          className={({ isActive }) =>
            `theme-sidebar-link flex items-center justify-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition md:justify-start ${
              isActive ? "theme-sidebar-active shadow-sm" : ""
            }`
          }
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-current/10 text-sm">
            T
          </span>
          <span className="hidden md:inline">Themes</span>
        </NavLink>
      </nav>

      <div className="mt-auto space-y-3">
        <div className="lg:hidden">
          <ThemeSelector />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center rounded-2xl border border-[color:var(--border)] px-3 py-3 text-sm font-semibold text-[color:var(--sidebar-text)] transition hover:bg-[color:color-mix(in_srgb,var(--sidebar-text)_12%,transparent)] md:justify-start"
        >
          <span className="md:hidden">Out</span>
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
