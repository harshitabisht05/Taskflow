import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="min-h-screen w-20 bg-slate-900 px-3 py-6 text-white md:w-64 md:px-4">
      <div className="mb-10 px-2 md:px-3">
        <h1 className="text-center text-xl font-bold md:text-left md:text-2xl">
          <span className="md:hidden">TF</span>
          <span className="hidden md:inline">TaskFlow</span>
        </h1>

        <p className="mt-1 hidden text-sm text-slate-400 md:block">
          Project Management
        </p>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block rounded-lg px-2 py-2 text-center text-sm font-medium transition-colors md:px-3 md:text-left ${
              isActive
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <span className="md:hidden">D</span>
          <span className="hidden md:inline">Dashboard</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;