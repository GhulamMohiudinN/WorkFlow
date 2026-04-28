"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  FiLayers,
  FiSearch,
  FiClock,
  FiUsers,
  FiEye,
  FiChevronRight,
  FiAlertCircle,
  FiRefreshCw,
  FiX,
  FiEdit2,
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
  return `${d}d ago`;
}

function calcProgress(steps = []) {
  if (!steps.length) return 0;
  const done = steps.filter((s) => s.status === "completed").length;
  return Math.round((done / steps.length) * 100);
}

const STATUS_COLORS = {
  active:    "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  pending:   "bg-yellow-100 text-yellow-800",
  draft:     "bg-gray-100 text-gray-600",
};
function statusColor(status) {
  return STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
}

const CARD_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-amber-500",
  "bg-teal-500", "bg-pink-500", "bg-indigo-500",
];
function processColor(idx) {
  return CARD_COLORS[idx % CARD_COLORS.length];
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function ProcessCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gray-200" />
        <div className="w-16 h-5 rounded-full bg-gray-200" />
      </div>
      <div className="w-40 h-5 rounded bg-gray-200 mb-2" />
      <div className="w-full h-3 rounded bg-gray-100 mb-4" />
      <div className="space-y-2 mb-4">
        <div className="w-32 h-3 rounded bg-gray-100" />
        <div className="w-36 h-3 rounded bg-gray-100" />
      </div>
      <div className="h-2 rounded-full bg-gray-100" />
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function UserProcessesPage() {
  const [allProcesses, setAllProcesses] = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  const searchTimer = useRef(null);
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  const [userRole, setUserRole] = useState("viewer");

  const loadProcesses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await processAPI.getAssignedProcesses();
      if (result.success) {
        const list = Array.isArray(result.data) ? result.data : [];
        setAllProcesses(list);
      } else {
        setError(result.error || "Failed to load processes.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let role = localStorage.getItem("role")?.toLowerCase() || "viewer";
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u.role) role = u.role.toLowerCase();
      setUserRole(role);
    }
    loadProcesses();
  }, [loadProcesses]);

  // Client-side search filter (search is done locally since assigned processes are per-user)
  const filtered = allProcesses.filter((p) => {
    const q = debouncedSearch.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="bg-red-50 rounded-2xl p-8 border border-red-100 max-w-md w-full">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Could not load processes</h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadProcesses}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
          >
            <FiRefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Processes</h1>
          <p className="text-gray-600 mt-1">Workflows you are assigned to</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={loadProcesses}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:border-amber-400 hover:text-amber-600 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <FiRefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          
          {(userRole === "admin" || userRole === "editor") && (
            <Link
              href="/processes/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-500/25 transition-colors text-sm font-medium"
            >
              <FiLayers className="h-4 w-4" />
              Create Process
            </Link>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search processes by name or description..."
            className="pl-10 w-full border border-gray-200 rounded-xl py-2.5 px-4 pr-10 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* View-only notice */}
      {userRole === "viewer" && (
        <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center gap-3 border border-blue-100">
          <FiEye className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            You have view access. To create or edit processes, please contact your workspace admin.
          </p>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <ProcessCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-amber-50 rounded-full p-6 w-fit mx-auto mb-4">
            <FiLayers className="h-12 w-12 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {debouncedSearch ? "No results found" : "No processes assigned yet"}
          </h3>
          <p className="text-gray-500 text-sm">
            {debouncedSearch
              ? "Try adjusting your search query."
              : "Contact your workspace admin to get processes assigned to you."}
          </p>
          {debouncedSearch && (
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((process, idx) => {
            const pid = process._id || process.id;
            const progress = calcProgress(process.steps || []);
            const assigneeNames = (process.assignedTo || [])
              .map((a) => (typeof a === "string" ? a : a?.name || a?.email || ""))
              .filter(Boolean)
              .join(", ") || "—";

            return (
              <div
                key={pid}
                className="bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${processColor(idx)} h-12 w-12 rounded-lg flex items-center justify-center`}>
                      <FiLayers className="h-6 w-6 text-white" />
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(progress === 100 ? "completed" : (process.status || "active"))}`}>
                      {progress === 100 ? "completed" : (process.status || "active")}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{process.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {process.description || "No description provided."}
                  </p>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Updated: {formatTimeAgo(process.updatedAt)}</span>
                    </div>
                    {process.assignedTo?.length > 0 && (
                      <div className="flex items-start text-sm text-gray-500">
                        <FiUsers className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">Assigned: {assigneeNames}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-semibold text-gray-700">
                        {progress}% ({(process.steps || []).filter(s => s.status === "completed").length}/{(process.steps || []).length} steps)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? "bg-green-500" : "bg-amber-500"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link
                      href={`/users/processesUsers/${pid}`}
                      className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium text-sm hover:translate-x-0.5 transition-transform"
                    >
                      <FiEye className="mr-1.5 h-4 w-4" />
                      <span>View Details</span>
                    </Link>
                    {(userRole === "admin" || userRole === "editor") && (
                      <Link
                        href={`/processes/${pid}/edit`}
                        className="inline-flex items-center px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-medium text-xs transition-colors"
                      >
                        <FiEdit2 className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}