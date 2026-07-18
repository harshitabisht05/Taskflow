import { useState } from "react";

function EditProjectModal({
  project,
  onClose,
  onUpdateProject,
  isSubmitting,
  serverError,
}) {
  const [formData, setFormData] = useState({
    name: project.name || "",
    description: project.description || "",
    status: project.status || "active",
    dueDate: project.dueDate
      ? project.dueDate.split("T")[0]
      : "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Project name is required");
      return;
    }

    setError("");

    try {
      await onUpdateProject({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update project"
      );
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel max-w-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-strong)]">
              Project
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--text-primary)]">
              Edit Project
            </h2>

            <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">
              Update the project details and delivery status.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit project modal"
            className="icon-button"
          >
            x
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="label">
              Project Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="field"
            />
          </div>

          <div>
            <label className="label">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="field"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="field"
              >
                <option value="planning">
                  Planning
                </option>
                <option value="active">
                  Active
                </option>
                <option value="completed">
                  Completed
                </option>
              </select>
            </div>

            <div>
              <label className="label">
                Due Date
              </label>

              <input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="field"
              />
            </div>
          </div>

          {(error || serverError) && (
            <div className="error-box">
              {error || serverError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProjectModal;
