"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../formValidationScheme/authSchema";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, clearError } from "../../store/slices/authSlice";

import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiArrowLeft,
  FiUsers,
  FiLayers,
  FiZap,
  FiBriefcase,
  FiCheckCircle,
  FiCpu,
  FiUserPlus,
  FiGlobe,
  FiUser,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (formData) => {
    try {
      const result = await dispatch(signupUser(formData)).unwrap();
      toast.success(
        "Account created successfully! Please check your email for verification.",
        {
          duration: 4000,
          position: "top-right",
        },
      );
      router.push(`/emailVerfication`);
    } catch (error) {
      toast.error(error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Left Side - Signup Form */}
      <div className="flex-1 flex flex-col justify-start pt-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="bg-amber-100 p-4 rounded-xl">
              <FiUserPlus className="w-12 h-12 text-amber-600" />
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
                <FiUserPlus className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Create Account
              </h2>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Start your enterprise workflow management journey
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  {...register("name")}
                  autoComplete="name"
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
              <p className="text-red-500 text-sm mt-2">
                {errors.name?.message}
              </p>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  {...register("email")}
                  autoComplete="email"
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  placeholder="john@example.com"
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
                Create Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  placeholder="Minimum 8 characters"
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
              <p className="mt-1 text-xs text-gray-500">
                Password must contain at least 1 letter and 1 number
              </p>
              <p className="text-red-500 text-sm mt-2">
                {errors.password?.message}
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  autoComplete="new-password"
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <p className="text-red-500 text-sm mt-2">
                {errors.confirmPassword?.message}
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  {...register("terms")}
                  checked={termsAccepted}
                  required
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 text-amber-600 rounded border-gray-300"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-amber-600 hover:text-amber-500"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-amber-600 hover:text-amber-500"
                  >
                    Privacy Policy
                  </a>
                </label>
                <p className="text-gray-500 text-xs mt-1">
                  By creating an account, you agree to our enterprise agreement
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <FiShield className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-sm text-gray-600">
                Your data is encrypted and stored securely with MongoDB Atlas
              </span>
            </div>

            <div>
              <button
                // type="submit"
                disabled={loading}
                className="group relative w-full hover:cursor-pointer flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Workspace"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-amber-600 hover:text-amber-500"
                >
                  Sign in to your workspace
                </Link>
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  For enterprise clients
                </span>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/contact")}
                className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-500"
              >
                <FiGlobe className="mr-2 h-4 w-4" />
                Need custom enterprise solution? Contact sales
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Platform Benefits Section */}
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
                  Enterprise Workflow Platform
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900">
                Why Choose WorkflowPro?
              </h3>
              <p className="text-gray-600 text-sm">
                Join thousands of companies streamlining their operations
              </p>
            </div>

            {/* Benefits Cards */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                  <FiCheckCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Get Started in Minutes
                  </h4>
                  <p className="text-xs text-gray-600">
                    Set up your company workspace instantly
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                  <FiUsers className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Unlimited Team Members
                  </h4>
                  <p className="text-xs text-gray-600">
                    Add your entire team with role-based access
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                  <FiLayers className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Unlimited Workflows
                  </h4>
                  <p className="text-xs text-gray-600">
                    Create as many processes as you need
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                  <FiZap className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    AI-Powered Insights
                  </h4>
                  <p className="text-xs text-gray-600">
                    Get smart suggestions to optimize workflows
                  </p>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="pt-3 border-t border-amber-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <FiShield className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-gray-700">
                  SOC 2 Type II Certified
                </span>
                <FiCpu className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-gray-700">
                  MongoDB Encryption
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Each company gets a completely isolated, secure workspace
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
