import { useAuth } from "../../context/AuthContext";

function Header() {
  const { user } = useAuth();
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur md:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>
        <p className="text-sm font-semibold text-slate-900">
          Project Management
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">
            {user?.name || "TaskFlow User"}
          </p>
          <p className="text-xs text-slate-500">
            {user?.email || "Ready to plan"}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white shadow-sm ring-4 ring-teal-50">
          {initials}
        </div>
      </div>
    </header>
  );
}

export default Header;
