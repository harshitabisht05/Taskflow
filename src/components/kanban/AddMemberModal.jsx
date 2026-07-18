import { useState } from "react";

function AddMemberModal({
  onClose,
  onAddMember,
  isSubmitting,
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setError("");

    try {
      await onAddMember(email.trim());
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to add team member"
      );
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel max-w-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-strong)]">
              Team
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--text-primary)]">
              Add Team Member
            </h2>

            <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">
              Invite a registered TaskFlow user by email.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="icon-button"
            aria-label="Close add member modal"
          >
            x
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >
          <label
            htmlFor="member-email"
            className="label"
          >
            Member Email
          </label>

          <input
            id="member-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="member@example.com"
            required
            className="field"
          />

          {error && (
            <div className="mt-3 error-box">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
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
                ? "Adding..."
                : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMemberModal;
