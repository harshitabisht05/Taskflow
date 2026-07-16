import { Link } from "react-router-dom";

function ProjectCard({ id, name, description, status, dueDate }) {
  return (
    <Link
      to={`/projects/${id}/board`}
    >
      <div className="group relative rounded-3xl border border-[#B88E80] bg-[#EDB7A6] p-5 shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-lg">
  <div className="flex items-start justify-between gap-3">
    <h3 className="text-lg font-semibold text-[#4B302A]">
      {name}
    </h3>

    <span className="shrink-0 rounded-full border border-[#B88E80] bg-[#F6D1C5] px-3 py-1 text-xs font-medium text-[#795D54]">
      {status}
    </span>
  </div>

  <p className="mt-2 line-clamp-3 text-sm leading-5 text-[#795D54]">
    {description}
  </p>

  <div className="mt-5 border-t border-[#D49E8D] pt-3">
    <p className="text-xs font-medium text-[#795D54]">
      Due {dueDate}
    </p>
  </div>
</div>
    </Link>
  );
}

export default ProjectCard;