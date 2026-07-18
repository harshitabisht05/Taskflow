import { Link } from "react-router-dom";

function ProjectCard({
  id,
  name,
  description,
  status,
  dueDate,
  role,
  totalTasks = 0,
  completedTasks = 0,
}) {
  const progress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const statusStyles = {
    planning: "bg-amber-50 text-amber-700 ring-amber-200",
    active: "bg-teal-50 text-teal-700 ring-teal-200",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  return (
    <Link
      to={`/projects/${id}/board`}
      className="group block h-full"
    >
      <article className="panel flex h-full flex-col p-5 transition duration-200 group-hover:-translate-y-1 group-hover:border-teal-200 group-hover:shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-slate-950">
              {name}
            </h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {role}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${
              statusStyles[status] ??
              "bg-slate-100 text-slate-600 ring-slate-200"
            }`}
          >
            {status}
          </span>
        </div>

        <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
          {description || "No description provided yet."}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">
              Progress
            </span>
            <span className="font-bold text-slate-900">
              {progress}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span>
              {completedTasks} of {totalTasks} tasks
            </span>
            <span className="text-right">
              {dueDate
                ? `Due ${new Date(dueDate).toLocaleDateString()}`
                : "No due date"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ProjectCard;
