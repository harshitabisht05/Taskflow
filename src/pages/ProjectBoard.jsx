import { useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import KanbanColumn from "../components/kanban/KanbanColumn";
import TaskCard from "../components/kanban/TaskCard";
import TaskModal from "../components/kanban/TaskModal";
import TaskDetailsModal from "../components/kanban/TaskDetailsModal";
import AddMemberModal from "../components/kanban/AddMemberModal";
import EditProjectModal from "../components/kanban/EditProjectModal";

import { useAuth } from "../context/AuthContext";

import {
  getProjectById,
  addProjectMember,
  removeProjectMember,
  updateProject,
  deleteProject,
} from "../api/projectApi";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from "../api/taskApi";

const kanbanColumns = [
  {
    id: "todo",
    title: "To Do",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "review",
    title: "Review",
  },
  {
    id: "done",
    title: "Done",
  },
];

function ProjectBoard() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);
  const [
    isEditProjectOpen,
    setIsEditProjectOpen,
  ] = useState(false);
  const [
    isAddMemberModalOpen,
    setIsAddMemberModalOpen,
  ] = useState(false);
  const [selectedTask, setSelectedTask] =
    useState(null);

  const [searchQuery, setSearchQuery] =
    useState("");
  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("all");
  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");
  const [
    dueDateFilter,
    setDueDateFilter,
  ] = useState("all");

  const [
    removeMemberError,
    setRemoveMemberError,
  ] = useState("");
  const [
    projectUpdateError,
    setProjectUpdateError,
  ] = useState("");
  const [
    deleteProjectError,
    setDeleteProjectError,
  ] = useState("");
  const [taskError, setTaskError] = useState("");

  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () =>
      getProjectById(projectId),
    enabled: Boolean(projectId),
  });

  const isProjectLead =
    project?.owner?._id === user?._id;

  const {
    data: tasks = [],
    isLoading: areTasksLoading,
    isError: areTasksError,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasks(projectId),
    enabled: Boolean(projectId),
  });

  const createTaskMutation = useMutation({
    mutationFn: (taskData) =>
      createTask(projectId, taskData),

    onSuccess: () => {
      setTaskError("");

      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboardStats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      setIsTaskModalOpen(false);
    },

    onError: (error) => {
      setTaskError(
        error.response?.data?.message ||
          "Unable to create task. Please try again."
      );
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (updatedTask) =>
      updateTask(
        projectId,
        updatedTask._id,
        updatedTask
      ),

    onSuccess: () => {
      setTaskError("");

      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboardStats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      setSelectedTask(null);
    },

    onError: (error) => {
      setTaskError(
        error.response?.data?.message ||
          "Unable to update task. Please try again."
      );

      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId) =>
      deleteTask(projectId, taskId),

    onSuccess: () => {
      setTaskError("");

      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboardStats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      setSelectedTask(null);
    },

    onError: (error) => {
      setTaskError(
        error.response?.data?.message ||
          "Unable to delete task. Please try again."
      );
    },
  });

  const reorderTasksMutation = useMutation({
    mutationFn: (updatedTasks) =>
      reorderTasks(
        projectId,
        updatedTasks
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboardStats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },

    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: (email) =>
      addProjectMember(
        projectId,
        email
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "project",
          projectId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      setIsAddMemberModalOpen(false);
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId) =>
      removeProjectMember(
        projectId,
        memberId
      ),

    onSuccess: () => {
      setRemoveMemberError("");

      queryClient.invalidateQueries({
        queryKey: [
          "project",
          projectId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },

    onError: (error) => {
      setRemoveMemberError(
        error.response?.data?.message ||
          "Unable to remove team member"
      );
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: (projectData) =>
      updateProject(
        projectId,
        projectData
      ),

    onSuccess: () => {
      setProjectUpdateError("");

      queryClient.invalidateQueries({
        queryKey: [
          "project",
          projectId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboardStats"],
      });

      setIsEditProjectOpen(false);
    },

    onError: (error) => {
      setProjectUpdateError(
        error.response?.data?.message ||
          "Unable to update project"
      );
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: () =>
      deleteProject(projectId),

    onSuccess: () => {
      setDeleteProjectError("");

      queryClient.removeQueries({
        queryKey: [
          "project",
          projectId,
        ],
      });
      queryClient.removeQueries({
        queryKey: [
          "tasks",
          projectId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboardStats"],
      });

      navigate("/dashboard");
    },

    onError: (error) => {
      setDeleteProjectError(
        error.response?.data?.message ||
          "Unable to delete project. Please try again."
      );
    },
  });

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setStatusFilter("all");
    setDueDateFilter("all");
  };

  const handleRemoveMember = (member) => {
    const shouldRemove =
      window.confirm(
        `Remove ${member.user.name} from this project?`
      );

    if (!shouldRemove) {
      return;
    }

    setRemoveMemberError("");
    removeMemberMutation.mutate(
      member.user._id
    );
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => {
      const matchesStatus =
        task.status === status;

      const normalizedSearch =
        searchQuery
          .trim()
          .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        task.title
          ?.toLowerCase()
          .includes(
            normalizedSearch
          ) ||
        task.description
          ?.toLowerCase()
          .includes(
            normalizedSearch
          );

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority ===
          priorityFilter;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const taskDueDate =
        task.dueDate
          ? new Date(task.dueDate)
          : null;

      const matchesDueDate =
        dueDateFilter === "all" ||
        (dueDateFilter ===
          "overdue" &&
          taskDueDate &&
          taskDueDate < today &&
          task.status !== "done") ||
        (dueDateFilter ===
          "no-date" &&
          !taskDueDate);

      return (
        matchesStatus &&
        matchesSearch &&
        matchesPriority &&
        matchesDueDate
      );
    });
  };

  const handleCreateTask = (formData) => {
    setTaskError("");
    createTaskMutation.mutate(formData);
  };

  const handleUpdateTask = (updatedTask) => {
    setTaskError("");
    updateTaskMutation.mutate(updatedTask);
  };

  const handleDeleteTask = (taskId) => {
    setTaskError("");
    deleteTaskMutation.mutate(taskId);
  };

  const handleDragEnd = (event) => {
    if (statusFilter !== "all") {
      return;
    }

    const { active, over } = event;

    if (
      !over ||
      active.id === over.id
    ) {
      return;
    }

    const activeTask = tasks.find(
      (task) =>
        task._id === active.id
    );

    if (!activeTask) {
      return;
    }

    const isAssignedToCurrentUser =
      activeTask.assignedTo?._id ===
      user?._id;

    if (
      project?.projectType ===
        "team" &&
      !isProjectLead &&
      !isAssignedToCurrentUser
    ) {
      return;
    }

    const targetColumn =
      kanbanColumns.find(
        (column) =>
          column.id === over.id
      );

    let updatedTasks = [...tasks];

    if (targetColumn) {
      if (
        activeTask.status ===
        targetColumn.id
      ) {
        return;
      }

      updatedTasks = tasks.map(
        (task) =>
          task._id === active.id
            ? {
                ...task,
                status:
                  targetColumn.id,
              }
            : task
      );
    } else {
      const overTask = tasks.find(
        (task) =>
          task._id === over.id
      );

      if (!overTask) {
        return;
      }

      const activeIndex =
        tasks.findIndex(
          (task) =>
            task._id === active.id
        );

      const overIndex =
        tasks.findIndex(
          (task) =>
            task._id === over.id
        );

      if (
        activeTask.status ===
        overTask.status
      ) {
        if (!isProjectLead) {
          return;
        }

        updatedTasks = arrayMove(
          tasks,
          activeIndex,
          overIndex
        );
      } else {
        const tasksWithUpdatedStatus =
          tasks.map((task) =>
            task._id === active.id
              ? {
                  ...task,
                  status:
                    overTask.status,
                }
              : task
          );

        updatedTasks = arrayMove(
          tasksWithUpdatedStatus,
          activeIndex,
          overIndex
        );
      }
    }

    const tasksWithPositions =
      updatedTasks.map((task) => {
        const columnTasks =
          updatedTasks.filter(
            (columnTask) =>
              columnTask.status ===
              task.status
          );

        const position =
          columnTasks.findIndex(
            (columnTask) =>
              columnTask._id ===
              task._id
          );

        return {
          ...task,
          position,
        };
      });

    queryClient.setQueryData(
      ["tasks", projectId],
      tasksWithPositions
    );

    if (isProjectLead) {
      reorderTasksMutation.mutate(
        tasksWithPositions.map(
          (task) => ({
            _id: task._id,
            status: task.status,
            position:
              task.position,
          })
        )
      );

      return;
    }

    const movedTask =
      tasksWithPositions.find(
        (task) =>
          task._id ===
          activeTask._id
      );

    if (!movedTask) {
      return;
    }

    updateTaskMutation.mutate({
      ...activeTask,
      status: movedTask.status,
    });
  };

  const handleDeleteProject = () => {
    const shouldDelete =
      window.confirm(
        `Are you sure you want to delete "${project.name}"? This will permanently delete the project and all of its tasks.`
      );

    if (!shouldDelete) {
      return;
    }

    setDeleteProjectError("");
    deleteProjectMutation.mutate();
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const visibleColumns =
    statusFilter === "all"
      ? kanbanColumns
      : kanbanColumns.filter(
          (column) =>
            column.id ===
            statusFilter
        );

  const totalProjectTasks =
    tasks.length;
  const completedProjectTasks =
    tasks.filter(
      (task) =>
        task.status === "done"
    ).length;

  const projectProgress =
    totalProjectTasks > 0
      ? Math.round(
          (completedProjectTasks /
            totalProjectTasks) *
            100
        )
      : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const projectDueDate =
    project?.dueDate
      ? new Date(project.dueDate)
      : null;

  const isProjectOverdue =
    projectDueDate &&
    projectDueDate < today &&
    project?.status !== "completed";

  const filtersAreActive =
    searchQuery ||
    priorityFilter !== "all" ||
    statusFilter !== "all" ||
    dueDateFilter !== "all";

  if (isProjectLoading) {
    return (
      <div className="app-page">
        <div className="page-shell">
          <div className="panel animate-pulse p-6">
            <div className="h-6 w-48 rounded bg-slate-200" />
            <div className="mt-4 h-4 w-2/3 rounded bg-slate-100" />
            <div className="mt-8 h-2 w-80 max-w-full rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (isProjectError) {
    return (
      <div className="app-page">
        <div className="page-shell">
          <div className="panel p-8">
            <h1 className="text-2xl font-bold text-slate-950">
              Unable to load project
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              The project could not be found or the server is unavailable.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="page-shell">
        <section className="panel overflow-hidden">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-teal-700 ring-1 ring-teal-100">
                    {project?.projectType === "team"
                      ? "Team Project"
                      : "Personal Project"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-600">
                    {project?.status}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  {project?.name ??
                    "Project Board"}
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                  {project?.description ||
                    "Manage and track tasks across your project workflow."}
                </p>

                {projectDueDate && (
                  <p
                    className={`mt-3 text-sm font-semibold ${
                      isProjectOverdue
                        ? "text-rose-600"
                        : "text-slate-500"
                    }`}
                  >
                    {isProjectOverdue
                      ? "Overdue: "
                      : "Due: "}
                    {projectDueDate.toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                {isProjectLead && (
                  <button
                    type="button"
                    onClick={() => {
                      setProjectUpdateError(
                        ""
                      );
                      setIsEditProjectOpen(
                        true
                      );
                    }}
                    className="btn-secondary"
                  >
                    Edit Project
                  </button>
                )}

                {isProjectLead && (
                  <button
                    type="button"
                    onClick={
                      handleDeleteProject
                    }
                    disabled={
                      deleteProjectMutation.isPending
                    }
                    className="btn-danger"
                  >
                    {deleteProjectMutation.isPending
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                )}

                {project?.projectType ===
                  "team" &&
                  isProjectLead && (
                    <button
                      type="button"
                      onClick={() =>
                        setIsAddMemberModalOpen(
                          true
                        )
                      }
                      className="btn-secondary"
                    >
                      Add Member
                    </button>
                  )}

                {isProjectLead && (
                  <button
                    type="button"
                    onClick={() => {
                      setTaskError("");
                      setIsTaskModalOpen(true);
                    }}
                    className="btn-primary"
                  >
                    <span aria-hidden="true">+</span>
                    Add Task
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-[0.14em] text-slate-400">
                  Project Progress
                </span>
                <span className="font-bold text-slate-900">
                  {projectProgress}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all duration-300"
                  style={{
                    width: `${projectProgress}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs font-medium text-slate-500">
                {completedProjectTasks} of {totalProjectTasks} tasks completed
              </p>
            </div>

            {project?.projectType ===
              "team" && (
              <aside className="border-t border-slate-100 p-5 sm:p-6 lg:border-l lg:border-t-0">
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
                  Team
                </h2>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                    {project.owner?.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-950">
                      {project.owner?.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {project.owner?.email}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-teal-600">
                      Lead
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {project.members
                    ?.length > 0 ? (
                    project.members.map(
                      (member) => (
                        <div
                          key={
                            member.user._id
                          }
                          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                            {member.user.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {
                                member.user
                                  .name
                              }
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {
                                member.user
                                  .email
                              }
                            </p>
                          </div>

                          {isProjectLead && (
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveMember(
                                  member
                                )
                              }
                              disabled={
                                removeMemberMutation.isPending
                              }
                              className="ml-auto text-xs font-bold text-rose-600 transition hover:text-rose-800 disabled:opacity-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                      No team members added yet.
                    </p>
                  )}

                  {removeMemberError && (
                    <div className="error-box">
                      {removeMemberError}
                    </div>
                  )}
                </div>
              </aside>
            )}
          </div>
        </section>

        {deleteProjectError && (
          <div className="mt-4 error-box">
            {deleteProjectError}
          </div>
        )}

        {taskError && (
          <div className="mt-4 error-box">
            <div className="flex items-start justify-between gap-4">
              <p>{taskError}</p>

              <button
                type="button"
                onClick={() => setTaskError("")}
                className="font-bold text-rose-700 hover:text-rose-900"
                aria-label="Dismiss error"
              >
                x
              </button>
            </div>
          </div>
        )}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[minmax(14rem,1fr)_repeat(3,12rem)_auto]">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search tasks..."
              className="field py-2.5"
            />

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(
                  event.target.value
                )
              }
              className="field py-2.5"
            >
              <option value="all">
                All Priorities
              </option>
              <option value="Low">
                Low Priority
              </option>
              <option value="Medium">
                Medium Priority
              </option>
              <option value="High">
                High Priority
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="field py-2.5"
            >
              <option value="all">
                All Statuses
              </option>
              <option value="todo">
                To Do
              </option>
              <option value="in-progress">
                In Progress
              </option>
              <option value="review">
                Review
              </option>
              <option value="done">
                Done
              </option>
            </select>

            <select
              value={dueDateFilter}
              onChange={(event) =>
                setDueDateFilter(
                  event.target.value
                )
              }
              className="field py-2.5"
            >
              <option value="all">
                All Due Dates
              </option>
              <option value="overdue">
                Overdue
              </option>
              <option value="no-date">
                No Due Date
              </option>
            </select>

            <button
              type="button"
              onClick={
                handleClearFilters
              }
              disabled={!filtersAreActive}
              className="btn-secondary whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        </section>

        {areTasksLoading && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kanbanColumns.map((column) => (
              <div
                key={column.id}
                className="min-h-[24rem] animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="mt-6 h-28 rounded-2xl bg-white" />
                <div className="mt-3 h-24 rounded-2xl bg-white" />
              </div>
            ))}
          </div>
        )}

        {areTasksError && (
          <div className="mt-6 error-box">
            Unable to load tasks. Please try again.
          </div>
        )}

        {!areTasksLoading &&
          !areTasksError && (
            <DndContext
              sensors={sensors}
              onDragEnd={
                handleDragEnd
              }
            >
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {visibleColumns.map(
                  (column) => {
                    const columnTasks =
                      getTasksByStatus(
                        column.id
                      );

                    return (
                      <KanbanColumn
                        key={
                          column.id
                        }
                        id={
                          column.id
                        }
                        title={
                          column.title
                        }
                        count={
                          columnTasks.length
                        }
                      >
                        <SortableContext
                          items={columnTasks.map(
                            (task) =>
                              task._id
                          )}
                          strategy={
                            verticalListSortingStrategy
                          }
                        >
                          {columnTasks.map(
                            (task) => (
                              <TaskCard
                                key={
                                  task._id
                                }
                                id={
                                  task._id
                                }
                                title={
                                  task.title
                                }
                                description={
                                  task.description
                                }
                                priority={
                                  task.priority
                                }
                                dueDate={
                                  task.dueDate
                                }
                                status={
                                  task.status
                                }
                                assignedTo={
                                  task.assignedTo
                                }
                                disabled={
                                  statusFilter !==
                                  "all"
                                }
                                onClick={() => {
                                  setTaskError("");
                                  setSelectedTask(task);
                                }}
                              />
                            )
                          )}
                        </SortableContext>
                      </KanbanColumn>
                    );
                  }
                )}
              </div>
            </DndContext>
          )}

        {isTaskModalOpen && (
          <TaskModal
            project={project}
            onClose={() => {
              setTaskError("");
              setIsTaskModalOpen(false);
            }}
            onCreateTask={handleCreateTask}
            isSubmitting={createTaskMutation.isPending}
            serverError={taskError}
          />
        )}

        {isEditProjectOpen && (
          <EditProjectModal
            project={project}
            onClose={() => {
              setProjectUpdateError(
                ""
              );
              setIsEditProjectOpen(
                false
              );
            }}
            onUpdateProject={(
              projectData
            ) =>
              updateProjectMutation.mutateAsync(
                projectData
              )
            }
            isSubmitting={
              updateProjectMutation.isPending
            }
            serverError={
              projectUpdateError
            }
          />
        )}

        {isAddMemberModalOpen && (
          <AddMemberModal
            onClose={() =>
              setIsAddMemberModalOpen(
                false
              )
            }
            onAddMember={(email) =>
              addMemberMutation.mutateAsync(
                email
              )
            }
            isSubmitting={
              addMemberMutation.isPending
            }
          />
        )}

        {selectedTask && (
          <TaskDetailsModal
            task={selectedTask}
            project={project}
            isProjectLead={isProjectLead}
            isAssignedToCurrentUser={
              selectedTask.assignedTo?._id === user?._id
            }
            onClose={() => {
              setTaskError("");
              setSelectedTask(null);
            }}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            isUpdating={updateTaskMutation.isPending}
            isDeleting={deleteTaskMutation.isPending}
            serverError={taskError}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectBoard;
