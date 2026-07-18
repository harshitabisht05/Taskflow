import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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
      await register(formData);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF3DF] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E2C4B8] bg-[#FFF9F2] p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-[#4B302A]">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-[#96796E]">
            Start managing your projects with TaskFlow.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#4B302A]"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none focus:border-[#96796E]"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#4B302A]"
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
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none focus:border-[#96796E]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#4B302A]"
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
              minLength={6}
              className="w-full rounded-xl border border-[#D8B7A9] bg-white px-4 py-3 text-sm text-[#4B302A] outline-none focus:border-[#96796E]"
              placeholder="Minimum 6 characters"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#4B302A] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#624139] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#96796E]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#4B302A] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;