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

  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

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
    <div className="app-page">
      <div className="page-shell">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your projects, spot bottlenecks, and keep work moving from one focused place.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsCreateProjectOpen(true)
            }
            className="btn-primary shrink-0"
          >
            <span aria-hidden="true">+</span>
            New Project
          </button>
        </div>

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
        </section>

        {areStatsError && (
          <div className="mt-4 error-box">
            Unable to load dashboard statistics.
          </div>
        )}

        <section className="mt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Recent Projects
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your recently active workspaces.
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-500">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </p>
          </div>

          {isLoading && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="panel animate-pulse p-5"
                >
                  <div className="h-5 w-2/3 rounded bg-slate-200" />
                  <div className="mt-4 h-3 w-full rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
                  <div className="mt-6 h-2 w-full rounded-full bg-slate-200" />
                  <div className="mt-4 h-4 w-1/3 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="mt-6 error-box">
              Unable to load projects. Please try again.
            </div>
          )}

          {!isLoading &&
            !isError &&
            projects.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-base font-semibold text-slate-900">
                  No projects yet
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Create your first project to collect tasks, due dates, and teammates in one board.
                </p>
              </div>
            )}

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
    </div>
  );
}

export default Dashboard;
