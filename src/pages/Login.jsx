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
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/80 lg:grid-cols-[1fr_0.95fr]">
        <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-sm font-black text-slate-950">
              TF
            </div>
            <h1 className="mt-8 max-w-sm text-4xl font-bold tracking-tight">
              Bring every project back into focus.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Track deadlines, move tasks across the board, and keep teams aligned without losing the thread.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="font-bold">Boards</p>
              <p className="mt-1 text-xs text-slate-400">Plan visually</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="font-bold">Teams</p>
              <p className="mt-1 text-xs text-slate-400">Assign clearly</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="font-bold">Progress</p>
              <p className="mt-1 text-xs text-slate-400">Ship steadily</p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-8 lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
              TaskFlow
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
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

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
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
