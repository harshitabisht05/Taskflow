import { useQuery } from "@tanstack/react-query";

import StatCard from "../components/dashboard/StatCard";
import ProjectCard from "../components/dashboard/ProjectCard";
import { getProjects } from "../api/projectApi";

function Dashboard() {
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <div className="p-4 md:p-8">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#4B302A]">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-[#96796E]">
          Welcome to TaskFlow. Manage your projects and track your progress.
        </p>
      </div>

      {/* Statistics */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={projects.length}
        />

        {/* Temporary values until Task API is connected */}
        <StatCard title="Total Tasks" value={24} />
        <StatCard title="Completed Tasks" value={12} />
        <StatCard title="In Progress" value={8} />
      </section>

      {/* Recent Projects */}
      <section className="mt-10">
        <div className="mt-14">
          <h2 className="text-2xl font-semibold text-[#4B302A]">
            Recent Projects
          </h2>

          <p className="mt-1 text-sm text-[#96796E]">
            Your recently active projects.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <p className="mt-6 text-sm text-[#96796E]">
            Loading projects...
          </p>
        )}

        {/* Error State */}
        {isError && (
          <p className="mt-6 text-sm text-red-600">
            Unable to load projects. Please try again.
          </p>
        )}

        {/* Empty State */}
        {!isLoading && !isError && projects.length === 0 && (
          <p className="mt-6 text-sm text-[#96796E]">
            No projects found.
          </p>
        )}

        {/* Projects */}
        {!isLoading && !isError && projects.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                id={project._id}
                name={project.name}
                description={project.description}
                status={project.status}
                dueDate={project.dueDate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;