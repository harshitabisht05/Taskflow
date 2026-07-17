import { useState } from "react";

function TaskDetailsModal({ task, onClose,onUpdateTask, onDeleteTask,  }) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

const handleSave = () => {
  onUpdateTask({
    ...task,
    ...formData,
  });
};

const handleDelete = () => {
  const shouldDelete = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (shouldDelete) {
    onDeleteTask(task._id);
  }
};

const handleCancelEdit = () => {
  setFormData({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
  });

  setIsEditing(false);
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4B302A]/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-lg rounded-3xl border border-[#E2C4B8] bg-[#FFF9F2] p-6 shadow-xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xl font-semibold text-[#4B302A]">
              Task Details
            </p>

            <h2 className="mt-2 text-l text-[#96796E]">
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-[#96796E] transition hover:bg-[#F8E3D7] hover:text-[#4B302A]"
            aria-label="Close task details"
          >
            ✕
          </button>
        </div>

        {/* Edit Mode */}
        {isEditing ? (
          <div className="mt-6 space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="edit-title"
                className="mb-1.5 block text-sm font-medium text-[#4B302A]"
              >
                Title
              </label>

              <input
                id="edit-title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="edit-description"
                className="mb-1.5 block text-sm font-medium text-[#4B302A]"
              >
                Description
              </label>

              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Status */}
              <div>
                <label
                  htmlFor="edit-status"
                  className="mb-1.5 block text-sm font-medium text-[#4B302A]"
                >
                  Status
                </label>

                <select
                  id="edit-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="edit-priority"
                  className="mb-1.5 block text-sm font-medium text-[#4B302A]"
                >
                  Priority
                </label>

                <select
                  id="edit-priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="edit-due-date"
                className="mb-1.5 block text-sm font-medium text-[#4B302A]"
              >
                Due Date
              </label>

              <input
                id="edit-due-date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40"
              />
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-l font-semibold text-[#4B302A]">
                Description
              </p>

              <p className="mt-2 text-sm text-[#4B302A]">
                {task.description || "No description provided."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-l font-semibold text-[#4B302A]">
                  Status
                </p>

                <p className="mt-2 text-sm text-[#4B302A]">
                  {task.status}
                </p>
              </div>

              <div>
                <p className="text-l font-semibold text-[#4B302A]">
                  Priority
                </p>

                <p className="mt-2 text-sm text-[#4B302A]">
                  {task.priority}
                </p>
              </div>

              <div>
                <p className="text-l font-semibold text-[#4B302A]">
                  Due Date
                </p>

                <p className="mt-2 text-sm text-[#4B302A]">
                  {task.dueDate || "No due date"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl border border-[#D8B7A9] px-4 py-2.5 text-sm font-medium text-[#795D54] transition hover:bg-[#F8E3D7]"
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#624139]"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
            <button
              type="button"
              onClick={handleDelete}
              className="mr-auto rounded-xl px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              Delete Task
            </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#D8B7A9] px-4 py-2.5 text-sm font-medium text-[#795D54] transition hover:bg-[#F8E3D7]"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#624139]"
              >
                Edit Task
              </button>

              
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsModal;