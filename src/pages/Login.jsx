import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to log in. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--background)] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-xl lg:grid-cols-[1fr_0.95fr]">
        <section className="theme-sidebar hidden p-10 text-[color:var(--sidebar-text)] lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="theme-avatar flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black">
              TF
            </div>
            <h1 className="mt-8 max-w-sm text-4xl font-bold tracking-tight">
              Bring every project back into focus.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-[color:var(--sidebar-muted)]">
              Track deadlines, move tasks across the board, and keep teams aligned without losing the thread.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--sidebar-text)_12%,transparent)] p-4">
              <p className="font-bold">Boards</p>
              <p className="mt-1 text-xs text-[color:var(--sidebar-muted)]">Plan visually</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--sidebar-text)_12%,transparent)] p-4">
              <p className="font-bold">Teams</p>
              <p className="mt-1 text-xs text-[color:var(--sidebar-muted)]">Assign clearly</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--sidebar-text)_12%,transparent)] p-4">
              <p className="font-bold">Progress</p>
              <p className="mt-1 text-xs text-[color:var(--sidebar-muted)]">Ship steadily</p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-8 lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
              TaskFlow
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--text-primary)]">
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
              Log in to continue managing your workspace.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="label"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="field"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="label"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="field"
              />
            </div>

            {error && (
              <div className="error-box">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting
                ? "Logging in..."
                : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[color:var(--text-secondary)]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[color:var(--accent-strong)] hover:underline"
            >
              Create account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
