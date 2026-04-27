"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { processAPI } from "../api/processAPI";
import {
  FiX,
  FiCheckCircle as FiCheck,
  FiTrash2,
  FiAlertCircle,
  FiLayers,
  FiPlus,
  FiFilter,
  FiSearch,
  FiClock,
  FiUsers,
  FiEdit2,
  FiEye,
  FiTrendingUp,
  FiBarChart2,
  FiChevronRight,
  FiGrid,
  FiList,
  FiMap,
  FiDownload,
  FiCopy,
  FiSettings,
  FiTag,
  FiDollarSign,
  FiZap,
} from "react-icons/fi";

export default function ProcessesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showTimeframe, setShowTimeframe] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [processes, setProcesses] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const filters = {};
        if (search) filters.search = search;
        if (filter !== "all") filters.status = filter;

        // Use workspace processes endpoint
        const result = await processAPI.getWorkspaceProcesses(filters);

        if (result.success) {
          // Store server-side analytics (total, active, avgCompletion, totalSteps)
          if (result.analytics) setAnalytics(result.analytics);

          // Transform API data to match UI expectations
          const transformedData = (result.data || []).map((process, index) => ({
            id: process._id ?? process.id ?? String(index + 1),
            rawId: process._id || process.id,
            name: process.name,
            description: process.description || "",
            category: process.category,
            steps: (process.steps || []).length,
            status: process.status || "draft",
            visibility: process.visibility || "private",
            lastUpdated: formatDate(process.updatedAt),
            completion: calculateCompletion(process),
            // DB field is `assignees` (array of populated user objects)
            assignees: process.assignees || [],
            color: getCategoryColor(process.category),
            settings: process.settings,
            createdBy: process.createdBy || null,
          }));

          setProcesses(transformedData);
        } else {
          setError(result.error || "Failed to load processes");
          console.error("Error fetching processes:", result.error);
          setProcesses([]);
        }
      } catch (err) {
        console.error("Unexpected error fetching processes:", err);
        setError("An unexpected error occurred. Please refresh the page.");
        setProcesses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcesses();
  }, [filter, search]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Calculate completion from completed steps vs total steps
  const calculateCompletion = (process) => {
    const allSteps = process.steps || [];
    if (!allSteps.length) return 0;
    const done = allSteps.filter((s) => s.status === "completed").length;
    return Math.round((done / allSteps.length) * 100);
  };

  // Helper function to get category color
  const getCategoryColor = (category) => {
    const colors = {
      Onboarding: "bg-blue-500",
      HR: "bg-purple-500",
      Finance: "bg-green-500",
      IT: "bg-amber-500",
      Marketing: "bg-pink-500",
      Sales: "bg-indigo-500",
      Operations: "bg-cyan-500",
      "Customer Support": "bg-red-500",
      Legal: "bg-slate-500",
    };
    return colors[category] || "bg-gray-500";
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    const targetId = deleteConfirm.rawId || deleteConfirm.id;
    const result = await processAPI.deleteProcess(targetId);
    if (result.success) {
      setProcesses(processes.filter((p) => (p.rawId || p.id) !== targetId));
      setDeleteConfirm(null);
    } else {
      setError(result.error);
    }
    setIsDeleting(false);
  };

  const filteredProcesses = processes
    .filter((process) => {
      if (filter === "all") return true;
      return process.status === filter;
    })
    .filter(
      (process) =>
        process.name.toLowerCase().includes(search.toLowerCase()) ||
        process.description.toLowerCase().includes(search.toLowerCase()),
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading processes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-6">
      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-red-900">
              Error Loading Processes
            </h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Processes</h1>
          <p className="text-gray-600 mt-2">
            Create and manage your workflow processes
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href="/processes/new"
            className="inline-flex items-center px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-lg shadow-amber-500/25"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Create New Process
          </Link>
        </div>
      </div>

      {/* Stats — driven by server analytics when available */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Processes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics?.total ?? processes.length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiLayers className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Processes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics?.active ?? processes.filter((p) => p.status === "inprogress").length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiTrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Completion</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics?.avgCompletion ?? (
                  processes.length
                    ? Math.round(
                        processes.reduce((acc, p) => acc + p.completion, 0) / processes.length,
                      )
                    : 0
                )}%
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <FiBarChart2 className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Steps</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics?.totalSteps ?? processes.reduce((acc, p) => acc + p.steps, 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiCheck className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search processes..."
                className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FiFilter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${viewMode === "grid" ? "bg-amber-100 text-amber-600" : "text-gray-400"}`}
              >
                <FiGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${viewMode === "list" ? "bg-amber-100 text-amber-600" : "text-gray-400"}`}
              >
                <FiList className="h-4 w-4" />
              </button>
             
            </div>

          
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcesses.map((process) => (
            <div
              key={process.id}
              className="bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`${process.color} h-12 w-12 rounded-lg flex items-center justify-center`}
                  >
                    <FiLayers className="h-6 w-6 text-white" />
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(process.status)}`}
                  >
                    {process.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {process.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {process.description}
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiClock className="h-4 w-4 mr-2" />
                    <span>Updated: {process.lastUpdated}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiUsers className="h-4 w-4 flex-shrink-0" />
                    <AssigneeStack assignees={process.assignees} />
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiLayers className="h-4 w-4 mr-2" />
                    <span>{process.steps} steps</span>
                  </div>
                </div>
                
                {/* Creator Info */}
                <div className="flex items-center gap-2 mb-6 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <Avatar name={process.createdBy?.name || "User"} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-0.5">Created By</p>
                    <p className="text-xs font-semibold text-gray-700 truncate">{process.createdBy?.name || "Talha"}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-gray-900">
                      {process.completion}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${process.completion >= 80 ? "bg-green-500" : process.completion >= 50 ? "bg-amber-500" : "bg-blue-500"}`}
                      style={{ width: `${process.completion}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    {process.rawId || process.id ? (
                      <>
                        <Link
                          href={`/processes/${process.rawId || process.id}`}
                          className="p-2 text-gray-400 hover:text-amber-600"
                        >
                          <FiEye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/processes/${process.rawId || process.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </Link>
                      </>
                    ) : (
                      <span className="text-xs text-red-500">ID missing</span>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(process)}
                      className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                      disabled={isDeleting}
                      title="Delete process"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                  {process.rawId || process.id ? (
                    <Link
                      href={`/processes/${process.rawId || process.id}/edit`}
                      className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Edit
                      <FiChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="text-xs text-red-500">ID missing</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Process
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Steps
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Completion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProcesses.map((process) => (
                  <tr key={process.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`${process.color} h-10 w-10 rounded-lg flex items-center justify-center mr-3`}
                        >
                          <FiLayers className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {process.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {process.description.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(process.status)}`}
                      >
                        {process.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {process.steps} steps
                    </td>
                    <td className="px-6 py-4">
                      <AssigneeStack assignees={process.assignees} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">
                            {process.completion}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${process.completion >= 80 ? "bg-green-500" : process.completion >= 50 ? "bg-amber-500" : "bg-blue-500"}`}
                            style={{ width: `${process.completion}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          href={`/processes/${process.rawId || process.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(process)}
                          className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                          disabled={isDeleting}
                          title="Delete process"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

     

      {filteredProcesses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="bg-amber-50 rounded-full p-6 w-fit mx-auto mb-4">
            <FiLayers className="h-12 w-12 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No processes found
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first process to get started
          </p>
          <Link
            href="/processes/new"
            className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Create New Process
          </Link>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteProcessModal
          process={deleteConfirm}
          loading={isDeleting}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UI Components
// ─────────────────────────────────────────────────────────────────────────────

function DeleteProcessModal({ process, loading, onClose, onConfirm }) {
  return (
    <ModalShell title="Delete Process" onClose={onClose} accentFrom="from-red-500" accentTo="to-red-600">
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Process?</h3>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          Are you sure you want to delete <span className="font-semibold">"{process.name}"</span>? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all flex items-center justify-center gap-2 shadow-md shadow-red-500/20"
          >
            {loading ? (
              <><Spinner size="h-4 w-4" cls="border-white" /> Deleting...</>
            ) : (
              <><FiTrash2 className="h-4 w-4" /> Delete Process</>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({ title, accentFrom, accentTo, onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm shadow-inner" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className={`bg-gradient-to-r ${accentFrom} ${accentTo} px-6 py-4 flex items-center justify-between`}>
          <h2 className="text-white font-bold">{title}</h2>
          <button onClick={onClose} className="text-white/75 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Spinner({ size = "h-5 w-5", cls = "border-amber-500" }) {
  return (
    <div className={`${size} animate-spin rounded-full border-2 ${cls} border-t-transparent`} />
  );
}

function Avatar({ name = "", size = "h-8 w-8", textCls = "text-[10px]" }) {
  // Simple hash for consistent colors
  const colors = ["bg-amber-500", "bg-blue-500", "bg-emerald-500", "bg-rose-500", "bg-indigo-500", "bg-purple-500"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const color = colors[Math.abs(hash) % colors.length];

  return (
    <div className={`${size} ${color} rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm`}>
      <span className={`text-white font-bold leading-none ${textCls}`}>
        {name?.charAt(0)?.toUpperCase() || "?"}
      </span>
    </div>
  );
}

/**
 * Shows an avatar stack for assignment display.
 * Handles: populated objects ({ _id, name }), raw strings (IDs), and empty arrays.
 */
function AssigneeStack({ assignees = [], max = 3 }) {
  if (!assignees.length) {
    return <span className="text-gray-400 italic text-xs">Unassigned</span>;
  }

  const visible = assignees.slice(0, max);
  const overflow = assignees.length - max;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-2">
        {visible.map((a, i) => {
          const name = typeof a === "string" ? "?" : a.name || a.email || "?";
          return (
            <div key={a._id || a.id || i} title={name}>
              <Avatar name={name} size="h-6 w-6" textCls="text-[9px]" />
            </div>
          );
        })}
      </div>
      {overflow > 0 && (
        <span className="text-xs text-gray-500 font-medium">+{overflow}</span>
      )}
      {assignees.length === 1 && (
        <span className="text-xs text-gray-600 truncate max-w-[120px]">
          {typeof assignees[0] === "string"
            ? assignees[0]
            : assignees[0].name || assignees[0].email}
        </span>
      )}
    </div>
  );
}

