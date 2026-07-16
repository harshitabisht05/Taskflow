import { useState } from "react";
import { useParams } from "react-router-dom";

import KanbanColumn from "../components/kanban/KanbanColumn";
import TaskCard from "../components/kanban/TaskCard";
import TaskModal from "../components/kanban/TaskModal";
import TaskDetailsModal from "../components/kanban/TaskDetailsModal";

import mockTasks from "../data/mockTasks";
import mockProjects from "../data/mockProjects";

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

  const [tasks, setTasks] = useState(mockTasks);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Find the current project using the project ID from the URL
  const project = mockProjects.find(
    (project) => project.id === Number(projectId)
  );

  // Get tasks belonging to the current project and column
  const getTasksByStatus = (status) => {
    return tasks.filter(
      (task) =>
        task.projectId === Number(projectId) &&
        task.status === status
    );
  };

  // Create a new task
  const handleCreateTask = (formData) => {
    const newTask = {
      id: Date.now(),
      projectId: Number(projectId),
      ...formData,
    };

    setTasks((currentTasks) => [
      ...currentTasks,
      newTask,
    ]);

    setIsTaskModalOpen(false);
  };

  // Update an existing task
  const handleUpdateTask = (updatedTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );

    setSelectedTask(null);
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== taskId
      )
    );

    setSelectedTask(null);
  };

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
            {project?.name ?? "Project Board"}
          </h1>

          <p className="mt-2 text-sm text-[#96796E]">
            Manage and track tasks across your project workflow.
          </p>
        </div>

        {/* Add Task Button */}
        <button
          type="button"
          onClick={() => setIsTaskModalOpen(true)}
          className="shrink-0 rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#624139] hover:shadow-md"
        >
          + Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kanbanColumns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);

            return (
              <KanbanColumn
                key={column.id}
                title={column.title}
                count={columnTasks.length}
              >
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    priority={task.priority}
                    dueDate={task.dueDate}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </KanbanColumn>
            );
          })}
        </div>
      </div>

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <TaskModal
          onClose={() => setIsTaskModalOpen(false)}
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