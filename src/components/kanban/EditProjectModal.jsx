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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4B302A]/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-lg rounded-3xl border border-[#E2C4B8] bg-[#FFF9F2] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#4B302A]">
              Edit Project
            </h2>

            <p className="mt-1 text-sm text-[#96796E]">
              Update your project details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit project modal"
            className="rounded-lg px-3 py-1 text-[#96796E] hover:bg-[#F8E3D7]"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-[#4B302A]">
              Project Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none focus:border-[#96796E]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#4B302A]">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none focus:border-[#96796E]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#4B302A]">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none focus:border-[#96796E]"
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
            <label className="mb-2 block text-sm font-medium text-[#4B302A]">
              Due Date
            </label>

            <input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none focus:border-[#96796E]"
            />
          </div>

          {(error || serverError) && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">
                {error || serverError}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#D8B7A9] px-4 py-2.5 text-sm font-medium text-[#795D54] hover:bg-[#F8E3D7]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#624139] disabled:opacity-60"
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