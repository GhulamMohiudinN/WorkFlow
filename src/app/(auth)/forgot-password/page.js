"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "../../formValidationScheme/authSchema";
import { authAPI } from "../../api/auth";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await authAPI.requestPasswordReset(data.email);
      setSuccessMessage(
        "A password reset link has been sent to your email. Please check your inbox.",
      );
      toast.success("Reset instructions sent successfully.");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Could not send reset email. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white flex items-center justify-center py-12">
      <Toaster position="top-right" duration={4000} />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-amber-100 p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your registered email to receive password reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.email ? "border-red-400" : "border-gray-300"}`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-linear-to-r from-amber-500 to-amber-600 px-4 py-2 text-white font-semibold transition hover:from-amber-600 hover:to-amber-700 disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {successMessage && (
            <p className="text-sm text-green-600 text-center">
              {successMessage}
            </p>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/login" className="text-amber-600 hover:text-amber-700">
            Back to login
          </Link>
          <span className="mx-2">•</span>
          <button
            onClick={() => router.push("/")}
            className="text-amber-600 hover:text-amber-700"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
