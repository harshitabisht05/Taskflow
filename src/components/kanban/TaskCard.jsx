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
    High: "bg-rose-50 text-rose-700 ring-rose-200",
    Medium: "bg-amber-50 text-amber-700 ring-amber-200",
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
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
      className={`surface rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md ${
        isDragging ? "scale-[0.98] opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-sm font-bold leading-6 text-slate-950">
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
            "bg-slate-100 text-slate-600 ring-slate-200"
          }`}
        >
          {priority}
        </span>

        {dueDate && (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              isOverdue
                ? "bg-rose-50 text-rose-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {isOverdue ? "Overdue " : "Due "}
            {new Date(dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
        {description || "No description provided."}
      </p>

      {assignedTo && (
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
            {assignedTo.name
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <span className="truncate text-xs font-semibold text-slate-500">
            {assignedTo.name}
          </span>
        </div>
      )}
    </article>
  );
}

export default TaskCard;
