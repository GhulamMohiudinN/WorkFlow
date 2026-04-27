"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { templateAPI } from "../api/templateAPI";
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
  FiCopy,
} from "react-icons/fi";

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const filters = {};
        if (search) filters.search = search;
        if (filter !== "all") filters.status = filter;

        const result = await templateAPI.listTemplates(filters);

        if (result.success) {
          if (result.analytics) setAnalytics(result.analytics);

          const transformedData = (result.data || []).map((template, index) => ({
            id: template._id ?? template.id ?? String(index + 1),
            rawId: template._id || template.id,
            name: template.name,
            description: template.description || "",
            category: template.category,
            steps: (template.steps || []).length,
            status: template.status || "draft",
            lastUpdated: formatDate(template.updatedAt),
            color: getCategoryColor(template.category),
            createdBy: template.createdBy || null,
          }));

          setTemplates(transformedData);
        } else {
          setError(result.error || "Failed to load templates");
          console.error("Error fetching templates:", result.error);
          setTemplates([]);
        }
      } catch (err) {
        console.error("Unexpected error fetching templates:", err);
        setError("An unexpected error occurred. Please refresh the page.");
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
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
    const result = await templateAPI.deleteTemplate(targetId);
    if (result.success) {
      setTemplates(templates.filter((p) => (p.rawId || p.id) !== targetId));
      setDeleteConfirm(null);
    } else {
      setError(result.error);
    }
    setIsDeleting(false);
  };

  const filteredTemplates = templates
    .filter((template) => {
      if (filter === "all") return true;
      return template.status === filter;
    })
    .filter(
      (template) =>
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.description.toLowerCase().includes(search.toLowerCase()),
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
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
              Error Loading Templates
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
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600 mt-2">
            Manage your reusable process frameworks
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href="/processes/new"
            className="inline-flex items-center px-4 py-3 bg-white text-gray-800 font-medium border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200 mr-3"
          >
            <FiCopy className="mr-2 h-5 w-5 text-amber-500" />
            Create from Template
          </Link>
          <Link
            href="/processes/new"
            className="inline-flex items-center px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-lg shadow-amber-500/25"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            New Blank Process
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Templates</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics?.total ?? templates.length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiCopy className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Library</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {templates.filter((p) => p.status === "active" || p.status === "draft").length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Standard Steps</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {templates.reduce((acc, p) => acc + p.steps, 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiLayers className="h-6 w-6 text-purple-600" />
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
                placeholder="Search templates..."
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
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all overflow-hidden relative group"
            >
              {/* Decorative top border */}
              <div className={`h-1.5 w-full ${template.color}`}></div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`${template.color} bg-opacity-10 h-10 w-10 text-xl font-bold flex items-center justify-center rounded-lg text-gray-800 border`}
                    style={{ borderColor: "rgba(0,0,0,0.05)" }}
                  >
                    <FiCopy className="h-5 w-5 opacity-70" />
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(template.status)}`}
                  >
                    {template.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-5 h-10 line-clamp-2">
                  {template.description || "No description provided."}
                </p>
                
                <div className="space-y-3 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiClock className="h-4 w-4 mr-2" />
                    <span className="text-xs">Updated: {template.lastUpdated}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiLayers className="h-4 w-4 mr-2" />
                    <span className="text-xs font-medium">{template.steps} predefined steps</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex space-x-1 text-gray-400">
                    {template.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-amber-50 text-amber-600 rounded">
                        {template.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {template.rawId || template.id ? (
                      <>
                        <Link
                          href={`/templates/${template.rawId || template.id}`}
                          className="p-2 text-gray-400 hover:text-amber-600 rounded-md hover:bg-amber-50 transition-colors"
                          title="View Template"
                        >
                          <FiEye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/templates/${template.rawId || template.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                          title="Edit Template"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/processes/new?templateId=${template.rawId || template.id}`}
                          className="p-2 text-amber-500 hover:bg-amber-50 rounded-md transition-colors border border-amber-200 hover:border-amber-400 ml-1"
                          title="Create Process from Template"
                        >
                          <FiPlus className="h-4 w-4" />
                        </Link>
                      </>
                    ) : (
                      <span className="text-[10px] text-red-500 mr-2">ID missing</span>
                    )}

                    <div className="w-px h-4 bg-gray-200 mx-1"></div>

                    <button
                      onClick={() => setDeleteConfirm(template)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                      disabled={isDeleting}
                      title="Delete Template"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="bg-amber-50 rounded-full p-6 w-fit mx-auto mb-4">
            <FiCopy className="h-12 w-12 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No templates found
          </h3>
          <p className="text-gray-600 mb-6">
            Create a process and save it as a template to build your library.
          </p>
          <Link
            href="/processes/new"
            className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Create Process
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteTemplateModal
          template={deleteConfirm}
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

function DeleteTemplateModal({ template, loading, onClose, onConfirm }) {
  return (
    <ModalShell title="Delete Template" onClose={onClose} accentFrom="from-red-500" accentTo="to-red-600">
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Template?</h3>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          Are you sure you want to delete <span className="font-semibold">"{template.name}"</span>? Processes already created using this template will not be affected.
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
              <><FiTrash2 className="h-4 w-4" /> Delete Template</>
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
