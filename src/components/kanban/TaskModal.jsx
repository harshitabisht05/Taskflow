import { useState } from "react";

function TaskModal({
  project,
  onClose,
  onCreateTask,
  isSubmitting = false,
  serverError = "",
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "Medium",
    dueDate: "",
    assignedTo: "",
  });

  const [validationError, setValidationError] =
    useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValidationError("");

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setValidationError(
        "Task title is required."
      );
      return;
    }

    onCreateTask({
      ...formData,
      title: formData.title.trim(),
      description:
        formData.description.trim(),
      assignedTo:
        formData.assignedTo || null,
      dueDate:
        formData.dueDate || null,
    });
  };

  const displayedError =
    validationError || serverError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4B302A]/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#E2C4B8] bg-[#FFF9F2] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#4B302A]">
            Create Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg px-3 py-1 text-[#96796E] transition hover:bg-[#F8E3D7] hover:text-[#4B302A] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close task modal"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-sm text-[#96796E]">
          Add a new task to this project.
        </p>

        {/* Error */}
        {displayedError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              {displayedError}
            </p>
          </div>
        )}

        <form
          id="task-form"
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-medium text-[#4B302A]"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-[#4B302A]"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="3"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-sm font-medium text-[#4B302A]"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
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
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="mb-1.5 block text-sm font-medium text-[#4B302A]"
              >
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>
            </div>
          </div>

          {/* Assigned Member */}
          {project?.projectType ===
            "team" && (
            <div>
              <label
                htmlFor="assignedTo"
                className="mb-1.5 block text-sm font-medium text-[#4B302A]"
              >
                Assign To
              </label>

              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  Unassigned
                </option>

                {project.members?.map(
                  (member) => (
                    <option
                      key={
                        member.user._id
                      }
                      value={
                        member.user._id
                      }
                    >
                      {member.user.name}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {/* Due Date */}
          <div>
            <label
              htmlFor="dueDate"
              className="mb-1.5 block text-sm font-medium text-[#4B302A]"
            >
              Due Date
            </label>

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-[#D8B7A9] px-4 py-2.5 text-sm font-medium text-[#795D54] transition hover:bg-[#F8E3D7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="task-form"
            disabled={isSubmitting}
            className="rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#624139] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Creating..."
              : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;