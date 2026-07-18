import { useState } from "react";

function CreateProjectModal({
  onClose,
  onCreateProject,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    dueDate: "",
    projectType: "single",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
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
      await onCreateProject({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create project"
      );
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel max-w-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-600">
              New Project
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Create Project
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Set up a workspace for tasks, deadlines, and collaboration.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="icon-button"
            aria-label="Close create project modal"
          >
            x
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="label"
            >
              Project Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
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
              rows="3"
              placeholder="Describe your project"
              className="field"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="projectType"
                className="label"
              >
                Project Type
              </label>

              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="field"
              >
                <option value="single">
                  Personal
                </option>
                <option value="team">
                  Team
                </option>
              </select>
            </div>

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
          </div>

          <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            {formData.projectType === "team"
              ? "Team projects let you add members and assign work."
              : "Personal projects stay private to your account."}
          </p>

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
              className="field"
            />
          </div>

          {error && (
            <div className="error-box">
              {error}
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
                ? "Creating..."
                : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
