import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="min-h-screen w-20 shrink-0 bg-[#96796E] px-3 py-7 text-[#FFF4E3] md:w-64 md:px-5">
      {/* Brand */}
      <div className="mb-20 px-1 md:px-3">
        <h1 className="text-center text-xl font-medium tracking-wide md:text-left md:text-4xl">
          <span className="md:hidden">TF</span>
          <span className="hidden md:inline">TaskFlow</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block rounded-2xl px-3 py-3 text-center text-sm font-medium transition-colors md:text-left md:text-xl ${
              isActive
                ? "bg-[#EDB7A6] text-[#4B302A]"
                : "text-[#FFF4E3] hover:bg-[#A98A7E]"
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