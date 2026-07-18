import { useState } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuth } from "../context/AuthContext";
import StatCard from "../components/dashboard/StatCard";
import ProjectCard from "../components/dashboard/ProjectCard";
import CreateProjectModal from "../components/dashboard/CreateProjectModal";
import { getDashboardStats } from "../api/dashboardApi";

import {
  getProjects,
  createProject,
} from "../api/projectApi";

function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isCreateProjectOpen, setIsCreateProjectOpen] =
    useState(false);

  // Fetch all projects
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  // Create a new project
  const createProjectMutation = useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboardStats"],
      });

      setIsCreateProjectOpen(false);
    },
  });

  const {
  data: stats,
  isLoading: areStatsLoading,
  isError: areStatsError,
} = useQuery({
  queryKey: ["dashboardStats"],
  queryFn: getDashboardStats,
});
  return (
    <div className="p-4 md:p-8">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#4B302A]">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-[#96796E]">
            Welcome to TaskFlow. Manage your projects and track your progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setIsCreateProjectOpen(true)
          }
          className="shrink-0 rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#624139]"
        >
          + New Project
        </button>
      </div>

      {/* Statistics */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
  title="Total Projects"
  value={
    areStatsLoading
      ? "..."
      : stats?.totalProjects ?? 0
  }
/>

<StatCard
  title="Total Tasks"
  value={
    areStatsLoading
      ? "..."
      : stats?.totalTasks ?? 0
  }
/>

<StatCard
  title="Completed Tasks"
  value={
    areStatsLoading
      ? "..."
      : stats?.completedTasks ?? 0
  }
/>

<StatCard
  title="In Progress"
  value={
    areStatsLoading
      ? "..."
      : stats?.inProgressTasks ?? 0
  }
/>
{areStatsError && (
  <p className="mt-3 text-sm text-red-600">
    Unable to load dashboard statistics.
  </p>
)}
      </section>

      {/* Recent Projects */}
      <section className="mt-10">
        <div>
          <h2 className="text-2xl font-semibold text-[#4B302A]">
            Recent Projects
          </h2>

          <p className="mt-1 text-sm text-[#96796E]">
            Your recently active projects.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-[#E2C4B8] bg-[#FFF9F2] p-5"
              >
                <div className="h-5 w-2/3 rounded bg-[#E2C4B8]" />

                <div className="mt-4 h-3 w-full rounded bg-[#F1E5DD]" />

                <div className="mt-2 h-3 w-4/5 rounded bg-[#F1E5DD]" />

                <div className="mt-6 h-2 w-full rounded-full bg-[#E2C4B8]" />

                <div className="mt-4 h-4 w-1/3 rounded bg-[#F1E5DD]" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <p className="mt-6 text-sm text-red-600">
            Unable to load projects. Please try again.
          </p>
        )}

        {/* Empty State */}
        {!isLoading &&
          !isError &&
          projects.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-[#D8B7A9] bg-[#FFF9F2] p-8 text-center">
              <p className="text-sm text-[#96796E]">
                No projects found. Create your first project to get started.
              </p>
            </div>
          )}

        {/* Project Cards */}
        {!isLoading &&
          !isError &&
          projects.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  id={project._id}
                  name={project.name}
                  description={project.description}
                  status={project.status}
                  dueDate={project.dueDate}
                  projectType={project.projectType}
                  totalTasks={project.totalTasks}
                  completedTasks={project.completedTasks}
                  role={
                    project.projectType === "team"
                      ? project.owner?._id === user?._id
                        ? "Team Lead"
                        : "Team Member"
                      : "Personal"
                  }
                />
              ))}
            </div>
          )}
      </section>

      {/* Create Project Modal */}
      {isCreateProjectOpen && (
        <CreateProjectModal
          onClose={() =>
            setIsCreateProjectOpen(false)
          }
          onCreateProject={(projectData) =>
            createProjectMutation.mutateAsync(
              projectData
            )
          }
          isSubmitting={
            createProjectMutation.isPending
          }
        />
      )}
    </div>
  );
}

export default Dashboard;