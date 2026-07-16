function KanbanColumn({ title, count, children }) {
  return (
    <section className="w-full rounded-2xl border border-[#D8B7A9] bg-[#F8E3D7] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-[#4B302A]">
          {title}
        </h2>

        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#EDB7A6] px-2 text-xs font-semibold text-[#4B302A]">
          {count}
        </span>
      </div>

      <div className="space-y-3">
        {count > 0 ? (
            children
        ) : (
            <div className="rounded-xl border border-dashed border-[#C9A597] p-5 text-center">
              <p className="text-sm text-[#96796E]">
                No tasks yet
              </p>
            </div>
        )}
        </div>
    </section>
  );
}

export default KanbanColumn;