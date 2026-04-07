"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiLayers,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiArrowRight,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { processAPI } from "../../api/processAPI";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTimeAgo(dateString) {
  if (!dateString) return "—";
  const diff = Date.now() - new Date(dateString).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  return `${d} days ago`;
}

function calcProgress(steps = []) {
  if (!steps.length) return 0;
  const done = steps.filter((s) => s.status === "completed").length;
  return Math.round((done / steps.length) * 100);
}

function getStatusColor(status) {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800";
    case "active":    return "bg-blue-100 text-blue-800";
    case "pending":   return "bg-yellow-100 text-yellow-800";
    case "draft":     return "bg-gray-100 text-gray-600";
    default:          return "bg-gray-100 text-gray-800";
  }
}

// ─── Skeleton card ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 rounded-lg bg-gray-200" />
        <div className="w-10 h-8 rounded bg-gray-200" />
      </div>
      <div className="w-32 h-4 rounded bg-gray-200" />
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function UserDashboard() {
  const [processes, setProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Read user from localStorage (set at login)
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));

      const result = await processAPI.getAssignedProcesses();
      if (result.success) {
        const list = Array.isArray(result.data) ? result.data : [];
        setProcesses(list);
      } else {
        setError(result.error || "Failed to load your processes.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalAssigned = processes.length;
  const allSteps      = processes.flatMap((p) => p.steps || []);
  const completedSteps = allSteps.filter((s) => s.status === "completed").length;
  const pendingSteps   = allSteps.filter((s) => s.status !== "completed").length;
  const recentProcesses = processes.slice(0, 4);

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <div className="w-56 h-8 rounded bg-gray-200 animate-pulse mb-2" />
          <div className="w-80 h-4 rounded bg-gray-100 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 animate-pulse">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
              <div className="flex-1 space-y-2">
                <div className="w-48 h-4 rounded bg-gray-200" />
                <div className="w-32 h-3 rounded bg-gray-100" />
              </div>
              <div className="w-24 h-2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="bg-red-50 rounded-2xl p-8 border border-red-100 max-w-md w-full">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Could not load dashboard</h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
          >
            <FiRefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0] || "there"}! 👋
        </h1>
        <p className="text-gray-600 mt-2">Here&apos;s an overview of your assigned workflows</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiLayers className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{totalAssigned}</span>
          </div>
          <p className="text-gray-600 font-medium">Assigned Processes</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{completedSteps}</span>
          </div>
          <p className="text-gray-600 font-medium">Completed Steps</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">{pendingSteps}</span>
          </div>
          <p className="text-gray-600 font-medium">Pending Steps</p>
        </div>
      </div>

      {/* Recent Processes */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">My Recent Processes</h2>
            <p className="text-sm text-gray-500 mt-0.5">Processes you&apos;re assigned to or have worked on</p>
          </div>
          {processes.length > 4 && (
            <Link
              href="/users/processesUsers"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              View all
            </Link>
          )}
        </div>

        {recentProcesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="bg-amber-50 rounded-full p-6 w-fit mx-auto mb-4">
              <FiLayers className="h-10 w-10 text-amber-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No processes assigned yet</h3>
            <p className="text-sm text-gray-500">Contact your workspace admin to get started.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {recentProcesses.map((process) => {
                const progress = calcProgress(process.steps || []);
                const pid = process._id || process.id;
                return (
                  <div key={pid} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{process.name}</h3>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0 ${getStatusColor(process.status)}`}>
                            {process.status || "active"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Updated: {formatTimeAgo(process.updatedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-semibold text-gray-700">{progress}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? "bg-green-500" : "bg-amber-500"}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <Link
                          href={`/users/processesUsers/${pid}`}
                          className="inline-flex items-center text-amber-600 hover:text-amber-700 text-sm font-medium"
                        >
                          View
                          <FiArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <Link
                href="/users/processesUsers"
                className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center"
              >
                View all processes
                <FiArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Quick Tip */}
      <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <FiTrendingUp className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Need Help?</h3>
            <p className="text-gray-600 text-sm mt-1">
              Click on any process to view details and complete your assigned tasks.
              If you need assistance, contact your workspace admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}