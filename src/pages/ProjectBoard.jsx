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

  // Modal state
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

  // Filter state
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

  // Error state
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
  // Fetch current project
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

  // Check whether current user is project owner / team lead
  const isProjectLead =
    project?.owner?._id === user?._id;

  // Fetch project tasks
  const {
    data: tasks = [],
    isLoading: areTasksLoading,
    isError: areTasksError,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasks(projectId),
    enabled: Boolean(projectId),
  });

// Create task
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

// Update task
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

// Delete task
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

  // Persist drag-and-drop ordering
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

  // Add team member
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

  // Remove team member
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

  // Update project
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

  // Delete project
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

  // Clear all task filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setStatusFilter("all");
    setDueDateFilter("all");
  };

  // Remove project member
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

  // Filter tasks
  const getTasksByStatus = (status) => {
    return tasks.filter((task) => {
      const matchesStatus =
        task.status === status;

      const normalizedSearch =
        searchQuery
          .trim()
          .toLowerCase();

      const matchesSearch =
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

  // Drag and drop
  const handleDragEnd = (event) => {
    // Disable drag and drop while
    // filtering by status
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

    // Team members can only move
    // tasks assigned to them
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

    // Dropped directly onto a column
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
      // Dropped onto another task
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
        // Only project lead can
        // reorder inside same column
        if (!isProjectLead) {
          return;
        }

        updatedTasks = arrayMove(
          tasks,
          activeIndex,
          overIndex
        );
      } else {
        // Move task into another column
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

    // Recalculate positions
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

    // Optimistic UI update
    queryClient.setQueryData(
      ["tasks", projectId],
      tasksWithPositions
    );

    // Project lead can persist
    // full ordering
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

    // Team member can update
    // only their assigned task
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

  // Delete project
  const handleDeleteProject = () => {
    const shouldDelete =
      window.confirm(
        `Are you sure you want to delete "${project.name}"? This will permanently delete the project and all of its tasks.`
      );

    if (!shouldDelete) {
      return;
    }

    // Clear previous deletion error
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

  // Visible Kanban columns
  const visibleColumns =
    statusFilter === "all"
      ? kanbanColumns
      : kanbanColumns.filter(
          (column) =>
            column.id ===
            statusFilter
        );

  // Project progress
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

  // Project due date
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

  // Project loading state
  if (isProjectLoading) {
    return (
      <div className="min-h-full bg-[#FFF3DF] p-4 md:p-8">
        <p className="text-sm text-[#96796E]">
          Loading project...
        </p>
      </div>
    );
  }

  // Project error state
  if (isProjectError) {
    return (
      <div className="min-h-full bg-[#FFF3DF] p-4 md:p-8">
        <h1 className="text-2xl font-semibold text-[#4B302A]">
          Unable to load project
        </h1>

        <p className="mt-2 text-sm text-[#96796E]">
          The project could not be
          found or the server is
          unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#FFF3DF] p-4 md:p-8">
      {/* Project Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Project Information */}
        <div>
          <p className="text-sm font-medium text-[#96796E]">
            Project
          </p>

          <h1 className="mt-1 text-3xl font-semibold text-[#4B302A]">
            {project?.name ??
              "Project Board"}
          </h1>

          <p className="mt-2 text-sm text-[#96796E]">
            {project?.description ||
              "Manage and track tasks across your project workflow."}
          </p>

          {/* Project Due Date */}
          {projectDueDate && (
            <p
              className={`mt-2 text-sm ${
                isProjectOverdue
                  ? "font-medium text-red-600"
                  : "text-[#96796E]"
              }`}
            >
              {isProjectOverdue
                ? "Overdue: "
                : "Due: "}

              {projectDueDate.toLocaleDateString()}
            </p>
          )}

          {/* Project Progress */}
          <div className="mt-4 max-w-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#795D54]">
                Project Progress
              </span>

              <span className="text-[#96796E]">
                {projectProgress}%
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E2C4B8]">
              <div
                className="h-full rounded-full bg-[#4B302A] transition-all duration-300"
                style={{
                  width: `${projectProgress}%`,
                }}
              />
            </div>

            <p className="mt-1 text-xs text-[#96796E]">
              {completedProjectTasks}{" "}
              of {totalProjectTasks}{" "}
              tasks completed
            </p>
          </div>

          {project?.projectType ===
            "team" && (
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-[#96796E]">
              Team Project
            </p>
          )}
        </div>

        {/* Project Actions */}
        <div className="flex shrink-0 flex-wrap gap-3">
          {/* Edit Project */}
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
              className="rounded-xl border border-[#4B302A] px-5 py-2.5 text-sm font-medium text-[#4B302A] transition hover:bg-[#F8E3D7]"
            >
              Edit Project
            </button>
          )}

          {/* Delete Project */}
          {isProjectLead && (
            <button
              type="button"
              onClick={
                handleDeleteProject
              }
              disabled={
                deleteProjectMutation.isPending
              }
              className="rounded-xl border border-red-300 px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteProjectMutation.isPending
                ? "Deleting..."
                : "Delete Project"}
            </button>
          )}

          {/* Add Member */}
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
                className="rounded-xl border border-[#4B302A] px-5 py-2.5 text-sm font-medium text-[#4B302A] transition hover:bg-[#F8E3D7]"
              >
                + Add Member
              </button>
            )}

          {/* Add Task */}
          {isProjectLead && (
            <button
              type="button"
              onClick={() => {
                setTaskError("");
                setIsTaskModalOpen(true);
              }}
              className="rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#624139] hover:shadow-md"
            >
              + Add Task
            </button>
          )}
        </div>
      </div>

      {/* Delete Project Error */}
      {deleteProjectError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">
            {deleteProjectError}
          </p>
        </div>
      )}

      {/* Team Members */}
      {project?.projectType ===
        "team" && (
        <div className="mt-6 rounded-2xl border border-[#E2C4B8] bg-[#FFF9F2] p-5">
          <h2 className="text-lg font-semibold text-[#4B302A]">
            Team
          </h2>

          {/* Team Lead */}
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#96796E]">
              Team Lead
            </p>

            <p className="mt-1 text-sm font-medium text-[#4B302A]">
              {project.owner?.name}
            </p>

            <p className="text-xs text-[#96796E]">
              {project.owner?.email}
            </p>
          </div>

          {/* Team Members */}
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#96796E]">
              Members
            </p>

            {project.members
              ?.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {project.members.map(
                  (member) => (
                    <div
                      key={
                        member.user._id
                      }
                      className="flex items-center gap-4 rounded-xl border border-[#E2C4B8] bg-white px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#4B302A]">
                          {
                            member.user
                              .name
                          }
                        </p>

                        <p className="text-xs text-[#96796E]">
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
                          className="ml-auto text-xs font-medium text-red-600 transition hover:text-red-800 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )
                )}

                {removeMemberError && (
                  <p className="w-full text-sm text-red-600">
                    {
                      removeMemberError
                    }
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-[#96796E]">
                No team members added
                yet.
              </p>
            )}
          </div>
        </div>
      )}
{/* Task Mutation Error */}
{taskError && (
  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
    <div className="flex items-start justify-between gap-4">
      <p className="text-sm text-red-700">
        {taskError}
      </p>

      <button
        type="button"
        onClick={() => setTaskError("")}
        className="text-sm font-medium text-red-700 hover:text-red-900"
        aria-label="Dismiss error"
      >
        ✕
      </button>
    </div>
  </div>
)}
      {/* Task Loading State */}
      {areTasksLoading && (
        <p className="mt-8 text-sm text-[#96796E]">
          Loading tasks...
        </p>
      )}

      {/* Task Error State */}
      {areTasksError && (
        <p className="mt-8 text-sm text-red-600">
          Unable to load tasks.
          Please try again.
        </p>
      )}

      {/* Search and Filters */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(
              event.target.value
            )
          }
          placeholder="Search tasks..."
          className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-2.5 text-sm text-[#4B302A] outline-none transition focus:border-[#96796E] sm:max-w-sm"
        />

        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(
              event.target.value
            )
          }
          className="rounded-xl border border-[#D8B7A9] bg-white px-4 py-2.5 text-sm text-[#4B302A] outline-none transition focus:border-[#96796E]"
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
          className="rounded-xl border border-[#D8B7A9] bg-white px-4 py-2.5 text-sm text-[#4B302A] outline-none transition focus:border-[#96796E]"
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
          className="rounded-xl border border-[#D8B7A9] bg-white px-4 py-2.5 text-sm text-[#4B302A] outline-none transition focus:border-[#96796E]"
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
          disabled={
            !searchQuery &&
            priorityFilter ===
              "all" &&
            statusFilter ===
              "all" &&
            dueDateFilter ===
              "all"
          }
          className="rounded-xl border border-[#D8B7A9] px-4 py-2.5 text-sm font-medium text-[#795D54] transition hover:bg-[#F8E3D7] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear Filters
        </button>
      </div>

      {/* Kanban Board */}
      {!areTasksLoading &&
        !areTasksError && (
          <DndContext
            sensors={sensors}
            onDragEnd={
              handleDragEnd
            }
          >
            <div className="mt-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            </div>
          </DndContext>
        )}

      {/* Create Task Modal */}
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

      {/* Edit Project Modal */}
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

      {/* Add Member Modal */}
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

      {/* Task Details Modal */}
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
  );
}

export default ProjectBoard;