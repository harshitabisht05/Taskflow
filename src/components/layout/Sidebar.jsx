import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

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
    <aside className="sticky top-0 flex h-screen w-20 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-3 py-5 text-white md:w-68 md:px-5">
      <div className="mb-8 flex items-center justify-center gap-3 md:justify-start">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500 text-sm font-black text-slate-950">
          TF
        </div>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold tracking-tight">
            TaskFlow
          </h1>
          <p className="text-xs font-medium text-slate-400">
            Plan, assign, ship
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center justify-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition md:justify-start ${
              isActive
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-current/10 text-sm">
            D
          </span>
          <span className="hidden md:inline">Dashboard</span>
        </NavLink>
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto flex items-center justify-center rounded-2xl border border-white/10 px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white md:justify-start"
      >
        <span className="md:hidden">Out</span>
        <span className="hidden md:inline">Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
