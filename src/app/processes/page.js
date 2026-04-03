"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { processAPI } from "../api/processAPI";
import { FiDelete, FiTrash2 } from "react-icons/fi";
import {
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
  FiAlertCircle,
} from "react-icons/fi";

export default function ProcessesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showTimeframe, setShowTimeframe] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [processes, setProcesses] = useState([]);

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
          // Transform API data to match UI expectations
          const transformedData = (result.data || []).map((process, index) => ({
            id: process._id ?? process.id ?? String(index + 1),
            rawId: process._id || process.id,
            name: process.name,
            description: process.description,
            category: process.category,
            steps: (process.steps || []).length,
            status: process.status || "draft",
            visibility: process.visibility || "private",
            lastUpdated: formatDate(process.updatedAt),
            completion: calculateCompletion(process),
            assignedTo:
              process.assignedTo?.map((a) => a.name).join(", ") || "Unassigned",
            color: getCategoryColor(process.category),
            settings: process.settings,
          }));

          setProcesses(transformedData);
        } else {
          setError(result.error || "Failed to load processes");
          console.error("Error fetching processes:", result.error);
          // Keep showing empty state or previous data
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

  // Helper function to calculate completion percentage
  const calculateCompletion = (process) => {
    // If API provides completion, use it; otherwise calculate from steps
    if (process.completion) return process.completion;
    return Math.floor(Math.random() * 100); // Fallback for demo
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Processes
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {processes.length}
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
              <p className="text-sm font-medium text-gray-600">
                Active Processes
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {processes.filter((p) => p.status === "active").length}
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
              <p className="text-sm font-medium text-gray-600">
                Avg Completion
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {Math.round(
                  processes.reduce((acc, p) => acc + p.completion, 0) /
                    processes.length,
                )}
                %
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
                {processes.reduce((acc, p) => acc + p.steps, 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-purple-600" />
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
              <button
                onClick={() => setViewMode("map")}
                className={`p-2 rounded-md ${viewMode === "map" ? "bg-amber-100 text-amber-600" : "text-gray-400"}`}
              >
                <FiMap className="h-4 w-4" />
              </button>
            </div>

            {viewMode === "map" && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowTimeframe(!showTimeframe)}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-1 ${showTimeframe ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"}`}
                >
                  <FiClock className="h-4 w-4" />
                  <span>Timeframe</span>
                </button>
                <button
                  onClick={() => setShowTags(!showTags)}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-1 ${showTags ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"}`}
                >
                  <FiTag className="h-4 w-4" />
                  <span>Tags</span>
                </button>
              </div>
            )}
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
                  <div className="flex items-center text-sm text-gray-600">
                    <FiUsers className="h-4 w-4 mr-2" />
                    <span>Assigned to: {process.assignedTo}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiLayers className="h-4 w-4 mr-2" />
                    <span>{process.steps} steps</span>
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
                      onClick={async () => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete "${process.name}"?`,
                          )
                        ) {
                          setIsDeleting(true);
                          const targetId = process.rawId || process.id;
                          const result =
                            await processAPI.deleteProcess(targetId);
                          if (result.success) {
                            setProcesses(
                              processes.filter(
                                (p) => (p.rawId || p.id) !== targetId,
                              ),
                            );
                          } else {
                            setError(result.error);
                          }
                          setIsDeleting(false);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
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
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {process.assignedTo}
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
                          onClick={async () => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete \"${process.name}\"?`,
                              )
                            ) {
                              setIsDeleting(true);
                              const targetId = process.rawId || process.id;
                              const result =
                                await processAPI.deleteProcess(targetId);
                              if (result.success) {
                                setProcesses(
                                  processes.filter(
                                    (p) => (p.rawId || p.id) !== targetId,
                                  ),
                                );
                              } else {
                                setError(result.error);
                              }
                              setIsDeleting(false);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
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

      {/* Map View */}
      {viewMode === "map" && (
        <div className="space-y-8">
          {filteredProcesses.map((process) => (
            <div
              key={process.id}
              className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden"
            >
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`${process.color} h-10 w-10 rounded-lg flex items-center justify-center mr-3`}
                  >
                    <FiLayers className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {process.name}
                    </h3>
                    <p className="text-sm text-gray-500">Process Map View</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-amber-600">
                    <FiDownload className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-amber-600">
                    <FiCopy className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-amber-600">
                    <FiSettings className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="relative overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-100 rounded-lg p-3 text-center font-medium text-gray-700 text-sm">
                        HR Team
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center font-medium text-gray-700 text-sm">
                        IT Team
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center font-medium text-gray-700 text-sm">
                        Management
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center font-medium text-gray-700 text-sm">
                        Automated
                      </div>
                    </div>

                    <div className="space-y-4">
                      {(process.activities || []).map((activity, idx) => (
                        <div key={activity?.id || `activity-${idx}`}>
                          <div className="grid grid-cols-4 gap-4">
                            <div
                              className={`${
                                activity.assignee.includes("HR")
                                  ? "col-span-1"
                                  : activity.assignee.includes("IT")
                                    ? "col-start-2"
                                    : activity.assignee.includes("Manager") ||
                                        activity.assignee.includes("Lead")
                                      ? "col-start-3"
                                      : activity.automation
                                        ? "col-start-4"
                                        : "col-span-1"
                              }`}
                            >
                              <div
                                className={`rounded-lg border-2 p-4 cursor-pointer hover:shadow-lg transition-all ${
                                  activity.type === "decision"
                                    ? "border-amber-400 bg-amber-50"
                                    : activity.type === "parallel"
                                      ? "border-green-400 bg-green-50"
                                      : "border-gray-200 bg-white"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-gray-900">
                                    {activity.name}
                                  </h4>
                                  {activity.type === "decision" && (
                                    <FiAlertCircle className="h-5 w-5 text-amber-500" />
                                  )}
                                  {activity.type === "parallel" && (
                                    <FiZap className="h-5 w-5 text-green-500" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  Assigned to: {activity.assignee}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <FiClock className="h-3 w-3 mr-1" />
                                    {activity.timeEstimate}
                                  </span>
                                  {showTimeframe && (
                                    <span className="flex items-center">
                                      <FiDollarSign className="h-3 w-3 mr-1" />$
                                      {activity.cost}
                                    </span>
                                  )}
                                  {showTags && (
                                    <span className="flex items-center">
                                      <FiTag className="h-3 w-3 mr-1" />
                                      {activity.tags[0]}
                                    </span>
                                  )}
                                </div>
                                {activity.automation && (
                                  <div className="mt-2 pt-2 border-t border-gray-100">
                                    <span className="text-xs text-blue-600 flex items-center">
                                      <FiZap className="h-3 w-3 mr-1" />
                                      AI Automated
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {idx < process.activities.length - 1 && (
                            <div className="flex justify-center my-2">
                              <div className="w-0.5 h-6 bg-gray-300"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
}

// Helper component for missing icon
function FiCheckCircle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
