function StatCard({ title, value }) {
  return (
    <div className="rounded-3xl border border-[#B88E80] bg-[#EDB7A6] p-5 shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <p className="text-sm font-medium text-[#795D54]">
        {title}
      </p>

      <p className="mt-2 text-2xl font-semibold text-[#4B302A]">
        {value}
      </p>
    </div>
  );
}

export default StatCard;