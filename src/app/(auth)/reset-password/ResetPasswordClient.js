"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../../formValidationScheme/authSchema";
import { authAPI } from "../../api/auth";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ResetPasswordClient({ token }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    if (!token) {
      setError("Reset token is missing. Please use the link from your email.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authAPI.resetPassword(token, data.password, data.confirmPassword);
      setSuccess("Password reset successfully. Redirecting to login...");
      toast.success("Password reset successful!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to reset password. Please try again.";
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
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-500">
            Create a new password for your account.
          </p>
        </div>

        {token ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.password ? "border-red-400" : "border-gray-300"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.confirmPassword ? "border-red-400" : "border-gray-300"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-linear-to-r from-amber-500 to-amber-600 px-4 py-2 text-white font-semibold transition hover:from-amber-600 hover:to-amber-700 disabled:opacity-70"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600 text-center">{success}</p>
            )}
          </form>
        ) : (
          <div className="text-sm text-red-600 text-center">
            Reset token missing. Please use the link from your email.
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/login" className="text-amber-600 hover:text-amber-700">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
