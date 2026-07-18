import { useState } from "react";

function TaskDetailsModal({
  task,
  project,
  isProjectLead,
  isAssignedToCurrentUser,
  onClose,
  onUpdateTask,
  onDeleteTask,
  isUpdating = false,
  isDeleting = false,
  serverError = "",
}) {
  const [isEditing, setIsEditing] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate
        ? task.dueDate.split("T")[0]
        : "",
      assignedTo:
        task.assignedTo?._id || "",
    });

  const isSubmitting =
    isUpdating || isDeleting;

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData(
      (currentFormData) => ({
        ...currentFormData,
        [name]: value,
      })
    );
  };

  const handleSave = () => {
    if (isSubmitting) {
      return;
    }

    // Project lead can update
    // all editable fields
    if (isProjectLead) {
      onUpdateTask({
        ...task,
        ...formData,
        assignedTo:
          formData.assignedTo ||
          null,
        dueDate:
          formData.dueDate || null,
      });

      return;
    }

    // Assigned member can
    // update status only
    if (isAssignedToCurrentUser) {
      onUpdateTask({
        ...task,
        status: formData.status,
      });
    }
  };

  const handleDelete = () => {
    if (isSubmitting) {
      return;
    }

    const shouldDelete =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (shouldDelete) {
      onDeleteTask(task._id);
    }
  };

  const handleCancelEdit = () => {
    if (isSubmitting) {
      return;
    }

    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate
        ? task.dueDate.split("T")[0]
        : "",
      assignedTo:
        task.assignedTo?._id || "",
    });

    setIsEditing(false);
  };

  const canEdit =
    isProjectLead ||
    isAssignedToCurrentUser;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4B302A]/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#E2C4B8] bg-[#FFF9F2] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xl font-semibold text-[#4B302A]">
              Task Details
            </p>

            <h2 className="mt-2 text-lg text-[#96796E]">
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg px-3 py-1 text-[#96796E] transition hover:bg-[#F8E3D7] hover:text-[#4B302A] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close task details"
          >
            ✕
          </button>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              {serverError}
            </p>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing ? (
          <div className="mt-6 space-y-4">
            {/* Assignment - Lead only */}
            {isProjectLead &&
              project?.projectType ===
                "team" && (
                <div>
                  <label
                    htmlFor="edit-assigned-to"
                    className="mb-1.5 block text-sm font-medium text-[#4B302A]"
                  >
                    Assign To
                  </label>

                  <select
                    id="edit-assigned-to"
                    name="assignedTo"
                    value={
                      formData.assignedTo
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      isSubmitting
                    }
                    className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      Unassigned
                    </option>

                    {project.members?.map(
                      (member) => (
                        <option
                          key={
                            member.user
                              ._id
                          }
                          value={
                            member.user
                              ._id
                          }
                        >
                          {
                            member.user
                              .name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

            <div
              className={
                isProjectLead
                  ? "grid gap-4 sm:grid-cols-2"
                  : ""
              }
            >
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
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    isSubmitting
                  }
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

              {/* Priority - Lead only */}
              {isProjectLead && (
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
                    value={
                      formData.priority
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      isSubmitting
                    }
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
              )}
            </div>

            {/* Due Date - Lead only */}
            {isProjectLead && (
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
                  value={
                    formData.dueDate
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    isSubmitting
                  }
                  className="w-full rounded-xl border border-[#D8B7A9] bg-white px-3 py-2.5 text-[#4B302A] outline-none transition focus:border-[#96796E] focus:ring-2 focus:ring-[#EDB7A6]/40 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            )}

            {!isProjectLead &&
              isAssignedToCurrentUser && (
                <p className="text-xs text-[#96796E]">
                  You can update the
                  status of this task
                  because it is assigned
                  to you.
                </p>
              )}
          </div>
        ) : (
          /* View Mode */
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-lg font-semibold text-[#4B302A]">
                Description
              </p>

              <p className="mt-2 text-sm text-[#4B302A]">
                {task.description ||
                  "No description provided."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-lg font-semibold text-[#4B302A]">
                  Status
                </p>

                <p className="mt-2 text-sm text-[#4B302A]">
                  {task.status}
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold text-[#4B302A]">
                  Priority
                </p>

                <p className="mt-2 text-sm text-[#4B302A]">
                  {task.priority}
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold text-[#4B302A]">
                  Due Date
                </p>

                <p className="mt-2 text-sm text-[#4B302A]">
                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                    : "No due date"}
                </p>
              </div>

              {/* Assigned Member */}
              {task.assignedTo && (
                <div>
                  <p className="text-lg font-semibold text-[#4B302A]">
                    Assigned To
                  </p>

                  <p className="mt-2 text-sm text-[#4B302A]">
                    {
                      task.assignedTo
                        .name
                    }
                  </p>

                  <p className="mt-1 text-xs text-[#96796E]">
                    {
                      task.assignedTo
                        .email
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={
                  handleCancelEdit
                }
                disabled={
                  isSubmitting
                }
                className="rounded-xl border border-[#D8B7A9] px-4 py-2.5 text-sm font-medium text-[#795D54] transition hover:bg-[#F8E3D7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  isSubmitting
                }
                className="rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#624139] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating
                  ? "Saving..."
                  : isProjectLead
                    ? "Save Changes"
                    : "Update Status"}
              </button>
            </>
          ) : (
            <>
              {/* Delete - Lead only */}
              {isProjectLead && (
                <button
                  type="button"
                  onClick={
                    handleDelete
                  }
                  disabled={
                    isSubmitting
                  }
                  className="mr-auto rounded-xl px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting
                    ? "Deleting..."
                    : "Delete Task"}
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                disabled={
                  isSubmitting
                }
                className="rounded-xl border border-[#D8B7A9] px-4 py-2.5 text-sm font-medium text-[#795D54] transition hover:bg-[#F8E3D7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Close
              </button>

              {/* Edit */}
              {canEdit && (
                <button
                  type="button"
                  onClick={() =>
                    setIsEditing(true)
                  }
                  disabled={
                    isSubmitting
                  }
                  className="rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#624139] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isProjectLead
                    ? "Edit Task"
                    : "Update Status"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsModal;