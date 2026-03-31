"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../formValidationScheme/authSchema";
import authAPI from "../../api/auth";
import toast, { Toaster } from "react-hot-toast";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiArrowLeft,
  FiUsers,
  FiLayers,
  FiTrendingUp,
  FiZap,
  FiBriefcase,
  FiCheckCircle,
  FiCpu,
} from "react-icons/fi";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.login(formData);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Toaster position="top-right" duration={4000} />
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-start pt-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="bg-amber-100 p-4 rounded-xl">
              <FiBriefcase className="w-12 h-12 text-amber-600" />
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="flex justify-center lg:justify-start mb-6">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>

          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <div className="bg-amber-100 p-2 rounded-lg">
                <FiBriefcase className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">WorkflowPro</h2>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Enterprise Workflow Management Platform
            </p>
          </div>

          <form className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  placeholder="your@company.com"
                />
              </div>
              <p className="text-red-500 text-sm mt-2">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <p className="text-red-500 text-sm mt-2">
                {errors.password?.message}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-amber-600 hover:text-amber-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <FiShield className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-sm text-gray-600">
                Enterprise-grade security with MongoDB encryption
              </span>
            </div>

            <div>
              <button
                onClick={handleSubmit(handleLogin)}
                disabled={loading}
                className="group relative w-full hover:cursor-pointer flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Access Workspace"
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Don`t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-amber-600 hover:text-amber-500"
                >
                  Request enterprise access
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Platform Features Section */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-amber-50 to-amber-100">
        <div className="flex flex-col items-center justify-center w-full p-6">
          <div className="max-w-sm text-center space-y-3">
            {/* Logo Placeholder */}
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-white p-3 rounded-xl shadow-lg">
                <FiBriefcase className="w-10 h-10 text-amber-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  WorkflowPro
                </h1>
                <p className="text-amber-600 font-medium text-sm mt-1">
                  Enterprise Workflow Management
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900">
                Streamline Your Business Processes
              </h3>
              <p className="text-gray-600 text-sm">
                Create, manage, and optimize workflows with AI-powered insights.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                  <FiUsers className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Team Management
                  </h4>
                  <p className="text-xs text-gray-600">
                    Add team members and manage permissions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                  <FiLayers className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Visual Builder
                  </h4>
                  <p className="text-xs text-gray-600">
                    Drag-and-drop workflow creation
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                  <FiTrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Analytics
                  </h4>
                  <p className="text-xs text-gray-600">
                    Monitor performance and productivity
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                  <FiZap className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    AI Automation
                  </h4>
                  <p className="text-xs text-gray-600">
                    Smart workflow optimization
                  </p>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="pt-3 border-t border-amber-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <FiShield className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-gray-700">
                  Enterprise Security
                </span>
                <FiCpu className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-gray-700">
                  MongoDB
                </span>
              </div>
              <p className="text-xs text-gray-500">
                ISO 27001 compliant infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
