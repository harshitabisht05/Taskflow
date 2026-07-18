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
    planning: "theme-status-planning",
    active: "theme-status-active",
    completed: "theme-status-completed",
  };

  return (
    <Link
      to={`/projects/${id}/board`}
      className="group block h-full"
    >
      <article className="panel flex h-full flex-col p-5 transition duration-200 group-hover:-translate-y-1 group-hover:border-[color:var(--primary)] group-hover:shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-[color:var(--text-primary)]">
              {name}
            </h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
              {role}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${
              statusStyles[status] ??
              "theme-status-chip"
            }`}
          >
            {status}
          </span>
        </div>

        <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-[color:var(--text-secondary)]">
          {description || "No description provided yet."}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[color:var(--text-muted)]">
              Progress
            </span>
            <span className="font-bold text-[color:var(--text-primary)]">
              {progress}%
            </span>
          </div>

          <div className="theme-progress-track mt-2 h-2 overflow-hidden rounded-full">
            <div
              className="theme-progress-fill h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[color:var(--border)] pt-4 text-xs text-[color:var(--text-muted)]">
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
