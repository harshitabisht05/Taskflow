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
    <div className="modal-backdrop">
      <div className="modal-panel max-w-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-strong)]">
              Task
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--text-primary)]">
              Create Task
            </h2>
            <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">
              Add a task with ownership, priority, and a due date.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="icon-button"
            aria-label="Close task modal"
          >
            x
          </button>
        </div>

        {displayedError && (
          <div className="mt-4 error-box">
            {displayedError}
          </div>
        )}

        <form
          id="task-form"
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="title"
              className="label"
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
              className="field"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="label"
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
              className="field"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="status"
                className="label"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field"
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

            <div>
              <label
                htmlFor="priority"
                className="label"
              >
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field"
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

          {project?.projectType ===
            "team" && (
            <div>
              <label
                htmlFor="assignedTo"
                className="label"
              >
                Assign To
              </label>

              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                disabled={isSubmitting}
                className="field"
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

          <div>
            <label
              htmlFor="dueDate"
              className="label"
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
              className="field"
            />
          </div>
        </form>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="task-form"
            disabled={isSubmitting}
            className="btn-primary"
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
