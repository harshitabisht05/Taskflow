function StatCard({ title, value }) {
  return (
    <div className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-semibold text-[color:var(--text-muted)]">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

export default StatCard;
