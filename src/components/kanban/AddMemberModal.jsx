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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4B302A]/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-3xl border border-[#E2C4B8] bg-[#FFF9F2] p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#4B302A]">
              Add Team Member
            </h2>

            <p className="mt-1 text-sm text-[#96796E]">
              Add a registered TaskFlow user by email.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-[#96796E] hover:bg-[#F8E3D7]"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >
          <label
            htmlFor="member-email"
            className="mb-2 block text-sm font-medium text-[#4B302A]"
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
            className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none focus:border-[#96796E]"
          />

          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
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
              className="rounded-xl bg-[#4B302A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#624139] disabled:cursor-not-allowed disabled:opacity-60"
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