function TaskCard({
  title,
  description,
  priority,
  dueDate,
  onClick,
}) {
  const priorityStyles = {
    High: "bg-[#F2B8A8] text-[#6B352B]",
    Medium: "bg-[#F5D5B8] text-[#76512F]",
    Low: "bg-[#D8E1C5] text-[#53603D]",
  };

  return (
    <article
      onClick={onClick}
      className="cursor-pointer rounded-2xl border border-[#E2C4B8] bg-[#FFF9F2] p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-6 text-[#4B302A]">
          {title}
        </h3>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
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
          {dueDate ? `Due ${dueDate}` : "No due date"}
        </p>
      </div>
    </article>
  );
}

export default TaskCard;