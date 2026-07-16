import StatCard from "../components/dashboard/StatCard";
import ProjectCard from "../components/dashboard/ProjectCard";
import mockProjects from "../data/mockProjects";
import ProjectBoard from "./ProjectBoard";

function Dashboard() {
  return (
    <div className="p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold text-[#4B302A]">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-[#96796E]">
          Welcome to TaskFlow. Manage your projects and track your progress.
        </p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Projects" value={4} />
        <StatCard title="Total Tasks" value={24} />
        <StatCard title="Completed Tasks" value={12} />
        <StatCard title="In Progress" value={8} />
      </section>

      <section className="mt-10">
        <div className="mt-14">
          <h2 className="text-2xl font-semibold text-[#4B302A]">
            Recent Projects
          </h2>

          <p className="mt-1 text-sm text-[#96796E]">
            Your recently active projects.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              status={project.status}
              dueDate={project.dueDate}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;