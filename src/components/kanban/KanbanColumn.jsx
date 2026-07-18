import { useDroppable } from "@dnd-kit/core";

function KanbanColumn({ id, title, count, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[24rem] w-full flex-col rounded-2xl border p-4 transition ${
        isOver
          ? "border-teal-300 bg-teal-50 shadow-md shadow-teal-100"
          : "border-slate-200 bg-slate-50/80"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-600">
          {title}
        </h2>

        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
          {count}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {count > 0 ? (
          children
        ) : (
          <div className="flex min-h-28 flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/70 p-5 text-center">
            <p className="text-sm font-medium text-slate-400">
              No tasks yet
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default KanbanColumn;
