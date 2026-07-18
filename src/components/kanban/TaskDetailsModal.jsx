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

  const detailItems = [
    ["Status", task.status],
    ["Priority", task.priority],
    [
      "Due Date",
      task.dueDate
        ? new Date(task.dueDate).toLocaleDateString()
        : "No due date",
    ],
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-panel max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-strong)]">
              Task Details
            </p>

            <h2 className="mt-2 break-words text-2xl font-bold tracking-tight text-[color:var(--text-primary)]">
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="icon-button shrink-0"
            aria-label="Close task details"
          >
            x
          </button>
        </div>

        {serverError && (
          <div className="mt-4 error-box">
            {serverError}
          </div>
        )}

        {isEditing ? (
          <div className="mt-6 space-y-4">
            {isProjectLead && (
              <>
                <div>
                  <label
                    htmlFor="edit-title"
                    className="label"
                  >
                    Title
                  </label>

                  <input
                    id="edit-title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-description"
                    className="label"
                  >
                    Description
                  </label>

                  <textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    disabled={isSubmitting}
                    className="field"
                  />
                </div>
              </>
            )}

            {isProjectLead &&
              project?.projectType ===
                "team" && (
                <div>
                  <label
                    htmlFor="edit-assigned-to"
                    className="label"
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
                    className="field"
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
              <div>
                <label
                  htmlFor="edit-status"
                  className="label"
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

              {isProjectLead && (
                <div>
                  <label
                    htmlFor="edit-priority"
                    className="label"
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
              )}
            </div>

            {isProjectLead && (
              <div>
                <label
                  htmlFor="edit-due-date"
                  className="label"
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
                  className="field"
                />
              </div>
            )}

            {!isProjectLead &&
              isAssignedToCurrentUser && (
                <p className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-hover)] px-4 py-3 text-xs leading-5 text-[color:var(--text-muted)]">
                  You can update the status of this task because it is assigned to you.
                </p>
              )}
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                Description
              </p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[color:var(--text-secondary)]">
                {task.description ||
                  "No description provided."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {detailItems.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-hover)] p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold capitalize text-[color:var(--text-primary)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {task.assignedTo && (
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                  Assigned To
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="theme-avatar-soft flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                    {task.assignedTo.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                      {
                        task.assignedTo
                          .name
                      }
                    </p>
                    <p className="text-xs text-[color:var(--text-muted)]">
                      {
                        task.assignedTo
                          .email
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
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
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  isSubmitting
                }
                className="btn-primary"
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
              {isProjectLead && (
                <button
                  type="button"
                  onClick={
                    handleDelete
                  }
                  disabled={
                    isSubmitting
                  }
                  className="btn-danger mr-auto"
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
                className="btn-secondary"
              >
                Close
              </button>

              {canEdit && (
                <button
                  type="button"
                  onClick={() =>
                    setIsEditing(true)
                  }
                  disabled={
                    isSubmitting
                  }
                  className="btn-primary"
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
