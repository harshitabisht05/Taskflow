import { useDroppable } from "@dnd-kit/core";

function KanbanColumn({ id, title, count, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <section
      ref={setNodeRef}
      className={`theme-column flex min-h-[24rem] w-full flex-col border p-4 transition ${
        isOver ? "theme-column-over" : ""
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--text-secondary)]">
          {title}
        </h2>

        <span className="theme-count flex h-7 min-w-7 items-center justify-center rounded-full border px-2 text-xs font-bold">
          {count}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {count > 0 ? (
          children
        ) : (
          <div className="flex min-h-28 flex-1 items-center justify-center rounded-xl border border-dashed border-[color:var(--border)] bg-[color:var(--surface)]/70 p-5 text-center">
            <p className="text-sm font-medium text-[color:var(--text-muted)]">
              No tasks yet
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default KanbanColumn;
