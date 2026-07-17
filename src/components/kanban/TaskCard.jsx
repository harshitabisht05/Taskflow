import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({
  id,
  title,
  description,
  priority,
  dueDate,
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
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityStyles = {
    High: "bg-[#F2B8A8] text-[#6B352B]",
    Medium: "bg-[#F5D5B8] text-[#76512F]",
    Low: "bg-[#D8E1C5] text-[#53603D]",
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`rounded-2xl border border-[#E2C4B8] bg-[#FFF9F2] p-4 shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-6 text-[#4B302A]">
          {title}
        </h3>

        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(event) => event.stopPropagation()}
          className="cursor-grab rounded-lg px-2 py-1 text-[#96796E] hover:bg-[#F1E5DD] active:cursor-grabbing"
          aria-label="Drag task"
        >
          ⋮⋮
        </button>
      </div>

      <div className="mt-2">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            priorityStyles[priority] ??
            "bg-[#F1E5DD] text-[#795D54]"
          }`}
        >
          {priority}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-5 text-[#795D54]">
        {description || "No description provided."}
      </p>

      <div className="mt-4 border-t border-[#E8D2C8] pt-3">
        <p className="text-xs font-medium text-[#96796E]">
          {dueDate
            ? `Due ${dueDate}`
            : "No due date"}
        </p>
      </div>
    </article>
  );
}

export default TaskCard;