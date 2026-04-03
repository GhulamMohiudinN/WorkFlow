"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authAPI } from "../../api/auth";

export const dynamic = "force-dynamic";
import {
  FiMail,
  FiCheckCircle,
  FiClock,
  FiArrowLeft,
  FiRefreshCw,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

function EmailVerificationContent() {
  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);
  const [userData, setUserData] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");



  const handleVerifyEmail = async (verificationToken) => {
    try {
      setVerifying(true);
      const data = await authAPI.verifyEmail(verificationToken);
      toast.success(
        data?.message ||
          "Verified! Setting up your workspace…",
      );
      sessionStorage.removeItem("userData");
      setTimeout(() => {
        router.push(`/workspaceCreation?token=${verificationToken}`);
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Verification failed. Please try again.",
      );
      setVerifying(false);
    }
  };

    useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("userData"));
    setUserData(data);

    // Auto-verify if token is present in URL
    if (token) {
      handleVerifyEmail(token);
    }
  }, [token]);

  useMemo(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    // Prevent resending while countdown is active
    if (countdown > 0) return;

    try {
      setResending(true);
      if (userData?.email) {
        await authAPI.resendVerification(userData.email);
        toast.success("Verification email sent.");
      } else {
        toast.error("Email not found. Sign up to continue.");
        router.push("/signup");
        return;
      }
      setCountdown(60);
      setResending(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend email. Try again.",
      );
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster duration={4000} position={"top-right"} />
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo/Icon Section */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="bg-linear-to-br from-amber-500 to-amber-600 p-6 rounded-2xl shadow-lg">
              <FiMail className="h-16 w-16 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
              <FiCheckCircle className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-amber-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Verify Your Email
            </h2>

            <div className="space-y-4">
              <p className="text-gray-600">We`ve sent a verification link to your gmail account.</p>
              

              <p className="text-gray-600 text-sm">
                Click the link in the email to verify your account and access
                your workspace.
              </p>
            </div>

            {/* Instructions */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <FiClock className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">Link Expires</h4>
                  <p className="text-sm text-gray-600">
                    The verification link will expire in 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <FiAlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">
                    Check Spam Folder
                  </h4>
                  <p className="text-sm text-gray-600">
                    If you dont see the email, check your spam or junk folder
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <FiShield className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">
                    Secure Verification
                  </h4>
                  <p className="text-sm text-gray-600">
                    This helps us ensure the security of your workspace
                  </p>
                </div>
              </div>
            </div>

            {/* Resend Button */}
            <div className="mt-8">
              <button
                onClick={handleResendEmail}
                disabled={resending || countdown > 0 || verifying}
                className={`group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ${
                  countdown > 0 || resending || verifying
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                }`}
              >
                {verifying ? (
                  <>
                    <FiRefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Verifying...
                  </>
                ) : resending ? (
                  <>
                    <FiRefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  `Resend Email (${countdown}s)`
                ) : (
                  <>
                    <FiMail className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </button>
            </div>

            {/* Additional Options */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm">
                <p className="text-gray-500 mb-3">
                  Still having trouble? You can also:
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push("/contact")}
                    className="text-amber-600 hover:text-amber-500 font-medium text-sm"
                  >
                    Contact Support
                  </button>
                  <span className="text-gray-400 mx-2">•</span>
                  <button
                    onClick={() => router.push("/login")}
                    className="text-amber-600 hover:text-amber-500 font-medium text-sm"
                  >
                    Try Different Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
            <FiShield className="h-4 w-4" />
            <span>
              Your security is our priority. All verification emails are
              encrypted.
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            WorkflowPro • Enterprise Workflow Management Platform
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <EmailVerificationContent />
    </Suspense>
  );
}
