import { useState } from "react";
import { useParams } from "react-router-dom";
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

import { getProjectById } from "../api/projectApi";

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

  const queryClient = useQueryClient();

  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  // Fetch current project
  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    enabled: Boolean(projectId),
  });

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
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });

      setIsTaskModalOpen(false);
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
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });

      setSelectedTask(null);
    },
  });

  // Delete task
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId) =>
      deleteTask(projectId, taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });

      setSelectedTask(null);
    },
  });

  // Persist drag-and-drop ordering
  const reorderTasksMutation = useMutation({
    mutationFn: (updatedTasks) =>
      reorderTasks(projectId, updatedTasks),

    onError: () => {
      // Restore server state if reorder fails
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
  });

  const getTasksByStatus = (status) => {
    return tasks.filter(
      (task) => task.status === status
    );
  };

  const handleCreateTask = (formData) => {
    createTaskMutation.mutate(formData);
  };

  const handleUpdateTask = (updatedTask) => {
    updateTaskMutation.mutate(updatedTask);
  };

  const handleDeleteTask = (taskId) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeTask = tasks.find(
      (task) => task._id === active.id
    );

    if (!activeTask) {
      return;
    }

    const targetColumn = kanbanColumns.find(
      (column) => column.id === over.id
    );

    let updatedTasks = [...tasks];

    // Dropped directly onto a column
    if (targetColumn) {
      if (activeTask.status === targetColumn.id) {
        return;
      }

      updatedTasks = tasks.map((task) =>
        task._id === active.id
          ? {
              ...task,
              status: targetColumn.id,
            }
          : task
      );
    } else {
      // Dropped onto another task
      const overTask = tasks.find(
        (task) => task._id === over.id
      );

      if (!overTask) {
        return;
      }

      const activeIndex = tasks.findIndex(
        (task) => task._id === active.id
      );

      const overIndex = tasks.findIndex(
        (task) => task._id === over.id
      );

      if (activeTask.status === overTask.status) {
        // Reorder tasks within the same column
        updatedTasks = arrayMove(
          tasks,
          activeIndex,
          overIndex
        );
      } else {
        // Move task into another column
        const tasksWithUpdatedStatus = tasks.map(
          (task) =>
            task._id === active.id
              ? {
                  ...task,
                  status: overTask.status,
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

    // Recalculate task positions inside each column
    const tasksWithPositions = updatedTasks.map(
      (task) => {
        const columnTasks = updatedTasks.filter(
          (columnTask) =>
            columnTask.status === task.status
        );

        const position = columnTasks.findIndex(
          (columnTask) =>
            columnTask._id === task._id
        );

        return {
          ...task,
          position,
        };
      }
    );

    // Optimistically update UI
    queryClient.setQueryData(
      ["tasks", projectId],
      tasksWithPositions
    );

    // Persist new positions to MongoDB
    reorderTasksMutation.mutate(
      tasksWithPositions.map((task) => ({
        _id: task._id,
        status: task.status,
        position: task.position,
      }))
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
          The project could not be found or the
          server is unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#FFF3DF] p-4 md:p-8">
      {/* Project Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#96796E]">
            Project
          </p>

          <h1 className="mt-1 text-3xl font-semibold text-[#4B302A]">
            {project?.name ?? "Project Board"}
          </h1>

          <p className="mt-2 text-sm text-[#96796E]">
            {project?.description ||
              "Manage and track tasks across your project workflow."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsTaskModalOpen(true)}
          className="shrink-0 rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#624139] hover:shadow-md"
        >
          + Add Task
        </button>
      </div>

      {/* Task Loading State */}
      {areTasksLoading && (
        <p className="mt-8 text-sm text-[#96796E]">
          Loading tasks...
        </p>
      )}

      {/* Task Error State */}
      {areTasksError && (
        <p className="mt-8 text-sm text-red-600">
          Unable to load tasks. Please try again.
        </p>
      )}

      {/* Kanban Board */}
      {!areTasksLoading && !areTasksError && (
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kanbanColumns.map((column) => {
                const columnTasks =
                  getTasksByStatus(column.id);

                return (
                  <KanbanColumn
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    count={columnTasks.length}
                  >
                    <SortableContext
                      items={columnTasks.map(
                        (task) => task._id
                      )}
                      strategy={
                        verticalListSortingStrategy
                      }
                    >
                      {columnTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          id={task._id}
                          title={task.title}
                          description={
                            task.description
                          }
                          priority={task.priority}
                          dueDate={task.dueDate}
                          onClick={() =>
                            setSelectedTask(task)
                          }
                        />
                      ))}
                    </SortableContext>
                  </KanbanColumn>
                );
              })}
            </div>
          </div>
        </DndContext>
      )}

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <TaskModal
          onClose={() =>
            setIsTaskModalOpen(false)
          }
          onCreateTask={handleCreateTask}
        />
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default ProjectBoard;