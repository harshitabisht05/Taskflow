import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({
  id,
  title,
  description,
  priority,
  dueDate,
  status,
  assignedTo,
  disabled = false,
  onClick,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityStyles = {
    High: "theme-priority-high",
    Medium: "theme-priority-medium",
    Low: "theme-priority-low",
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDueDate = dueDate
    ? new Date(dueDate)
    : null;

  const isOverdue =
    taskDueDate &&
    taskDueDate < today &&
    status !== "done";

  return (
    <article
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`theme-card rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--primary)] hover:shadow-md ${
        isDragging ? "scale-[0.98] opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-sm font-bold leading-6 text-[color:var(--text-primary)]">
          {title}
        </h3>

        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(event) => event.stopPropagation()}
          className="icon-button h-8 w-8 shrink-0 cursor-grab active:cursor-grabbing"
          aria-label="Drag task"
          title="Drag task"
        >
          <span className="leading-none" aria-hidden="true">
            ::
          </span>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
            priorityStyles[priority] ??
            "theme-status-chip"
          }`}
        >
          {priority}
        </span>

        {dueDate && (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              isOverdue
                ? "theme-overdue"
                : "theme-status-chip"
            }`}
          >
            {isOverdue ? "Overdue " : "Due "}
            {new Date(dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[color:var(--text-secondary)]">
        {description || "No description provided."}
      </p>

      {assignedTo && (
        <div className="mt-4 flex items-center gap-2 border-t border-[color:var(--border)] pt-3">
          <div className="theme-avatar-soft flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
            {assignedTo.name
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <span className="truncate text-xs font-semibold text-[color:var(--text-muted)]">
            {assignedTo.name}
          </span>
        </div>
      )}
    </article>
  );
}

export default TaskCard;
