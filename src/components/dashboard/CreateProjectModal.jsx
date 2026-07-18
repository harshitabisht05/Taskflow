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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4B302A]/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#E2C4B8] bg-[#FFF9F2] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#4B302A]">
              Create Project
            </h2>

            <p className="mt-1 text-sm text-[#96796E]">
              Create a new project and start organizing your tasks.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-[#96796E] transition hover:bg-[#F8E3D7] hover:text-[#4B302A]"
            aria-label="Close create project modal"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          {/* Project Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#4B302A]"
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
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none transition focus:border-[#96796E]"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-[#4B302A]"
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
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none transition focus:border-[#96796E]"
            />
          </div>

          {/* Project Type */}
          <div>
            <label
              htmlFor="projectType"
              className="mb-2 block text-sm font-medium text-[#4B302A]"
            >
              Project Type
            </label>

            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none transition focus:border-[#96796E]"
            >
              <option value="single">
                Single Project
              </option>

              <option value="team">
                Team Project
              </option>
            </select>

            <p className="mt-2 text-xs text-[#96796E]">
              {formData.projectType === "team"
                ? "Create a collaborative project where you can add members and assign tasks."
                : "Create a personal project managed only by you."}
            </p>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-[#4B302A]"
            >
              Status
            </label>

            <select
  id="status"
  name="status"
  value={formData.status}
  onChange={handleChange}
  className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none transition focus:border-[#96796E]"
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

          {/* Due Date */}
          <div>
            <label
              htmlFor="dueDate"
              className="mb-2 block text-sm font-medium text-[#4B302A]"
            >
              Due Date
            </label>

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none transition focus:border-[#96796E]"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#D8B7A9] px-4 py-2.5 text-sm font-medium text-[#795D54] transition hover:bg-[#F8E3D7]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#624139] disabled:cursor-not-allowed disabled:opacity-60"
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