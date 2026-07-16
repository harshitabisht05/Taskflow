import { useState } from "react";

function TaskModal({ onClose, onCreateTask  }) {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "Medium",
    dueDate: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onCreateTask(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4B302A]/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-lg rounded-3xl border border-[#E2C4B8] bg-[#FFF9F2] p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#4B302A]">
            Create Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-[#96796E] transition hover:bg-[#F8E3D7] hover:text-[#4B302A]"
            aria-label="Close task modal"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-sm text-[#96796E]">
          Add a new task to this project.
        </p>

        <form
            id="task-form"
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
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
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40"
            />
          </div>

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
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
                className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

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
                className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

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
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40"
            />
          </div>
        </form>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#D8B7A9] px-4 py-2.5 text-sm font-medium text-[#795D54] transition hover:bg-[#F8E3D7]"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="task-form"
            className="rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#624139]"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;