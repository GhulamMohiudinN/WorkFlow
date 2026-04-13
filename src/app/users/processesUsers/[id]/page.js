"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiArrowLeft,
  FiLayers,
  FiClock,
  FiUser,
  FiEye,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
  FiUsers,
  FiCalendar,
  FiX,
  FiCheck,
  FiLoader,
} from "react-icons/fi";
import { processAPI } from "../../../api/processAPI";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTimeAgo(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatAssignee(assignee) {
  if (!assignee) return "";
  if (typeof assignee === "string") return assignee;
  return assignee.name || assignee.email || "";
}

function calcProgress(steps = []) {
  if (!steps.length) return 0;
  const done = steps.filter((s) => s.status === "completed").length;
  return Math.round((done / steps.length) * 100);
}

// ─── Step status indicator ───────────────────────────────────────────────────

function StepStatusIcon({ status }) {
  if (status === "completed") {
    return (
      <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0 ring-4 ring-green-50">
        <FiCheckCircle className="h-3.5 w-3.5 text-white" />
      </div>
    );
  }
  if (status === "active" || status === "in-progress") {
    return (
      <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shrink-0 ring-4 ring-amber-50">
        <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-gray-300 shrink-0" />
  );
}

function stepStatusBadge(status) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "active":
    case "in-progress":
      return "bg-amber-100 text-amber-800";
    case "draft":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

// ─── Info row ────────────────────────────────────────────────────────────────

function InfoRow({ label, value, valueClass = "text-gray-900" }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 shrink-0 mr-4">{label}</span>
      <span className={`text-sm font-semibold ${valueClass} text-right`}>
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function UserProcessDetailPage() {
  const { id } = useParams();
  const [process, setProcess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const loadProcess = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await processAPI.getProcess(id);
      if (result.success) {
        setProcess(result.data);
      } else {
        setError(result.error || "Failed to load process details.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Mark step as completed (SENIOR APPROACH: API call with optimistic UI update) ───
  const handleCompleteStep = async () => {
    if (!selectedStep) return;

    setIsCompleting(true);
    try {
      // Optimistically update UI
      const updatedSteps = process.steps.map((s) =>
        s._id === selectedStep._id ? { ...s, status: "completed" } : s,
      );
      setProcess({ ...process, steps: updatedSteps });

      const result = await processAPI.completeStep(selectedStep._id);

      if (!result.success) {
        throw new Error(result.error || "Failed to complete step");
      }

      // Reload to sync with server
      await loadProcess();
      setSelectedStep(null);
    } catch (err) {
      console.error("Error completing step:", err);
      // Revert optimistic update on error
      await loadProcess();
    } finally {
      setIsCompleting(false);
    }
  };

  useEffect(() => {
    loadProcess();
  }, [id]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-32 h-5 rounded bg-gray-200" />
          <div className="flex-1">
            <div className="w-64 h-7 rounded bg-gray-200 mb-2" />
            <div className="w-80 h-4 rounded bg-gray-100" />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-amber-100 p-6 space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="w-40 h-4 rounded bg-gray-200" />
                  <div className="w-24 h-3 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-amber-100 p-6 h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="bg-red-50 rounded-2xl p-8 border border-red-100 max-w-md w-full">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Could not load process
          </h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/users/processesUsers"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              <FiArrowLeft className="h-4 w-4" /> Go Back
            </Link>
            <button
              onClick={loadProcess}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition-colors"
            >
              <FiRefreshCw className="h-4 w-4" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!process) return null;

  const steps = process.steps || [];
  const progress = calcProgress(steps);
  const assigneeNames = (process.assignedTo || [])
    .map((a) => (typeof a === "string" ? a : a?.name || a?.email || ""))
    .filter(Boolean);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <Link
          href="/users/processesUsers"
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm font-medium mt-1 shrink-0 transition-colors"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {process.name}
          </h1>
          {process.description && (
            <p className="text-gray-500 mt-1 text-sm">{process.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                process.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : process.status === "active"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {process.status || "active"}
            </span>
            {process.category && (
              <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                {process.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Read-only notice */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center gap-3 border border-blue-100">
        <FiEye className="h-5 w-5 text-blue-600 shrink-0" />
        <p className="text-sm text-blue-800">
          View-only mode — you can see all process details but cannot make
          changes.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Steps timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Process Steps
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {steps.filter((s) => s.status === "completed").length} of{" "}
                  {steps.length} completed
                </p>
              </div>
              {steps.length > 0 && (
                <span className="text-sm font-bold text-amber-600">
                  {progress}%
                </span>
              )}
            </div>

            <div className="p-6">
              {steps.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FiLayers className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No steps defined yet.</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Vertical connector line */}
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100" />
                  <div className="space-y-5">
                    {steps.map((step, idx) => {
                      const stepOrder = step.order ?? idx + 1;
                      const assignee = formatAssignee(step.assignee);

                      return (
                        <div
                          key={step._id || idx}
                          className="relative flex gap-4 cursor-pointer group"
                          onClick={() => setSelectedStep(step)}
                        >
                          <div className="relative z-10 mt-0.5">
                            <StepStatusIcon status={step.status} />
                          </div>
                          <div
                            className={`flex-1 rounded-xl p-4 border transition-all group-hover:border-amber-300 group-hover:shadow-md ${
                              step.status === "completed"
                                ? "bg-green-50 border-green-100"
                                : step.status === "active" ||
                                    step.status === "in-progress"
                                  ? "bg-amber-50 border-amber-100"
                                  : "bg-gray-50 border-gray-100"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                  Step {stepOrder}
                                </span>
                                <h3 className="font-semibold text-gray-900 mt-0.5">
                                  {step.title}
                                </h3>
                                {step.description && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    {step.description}
                                  </p>
                                )}
                              </div>
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${stepStatusBadge(step.status)}`}
                              >
                                {step.status || "pending"}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                              {assignee && (
                                <span className="flex items-center gap-1.5">
                                  <FiUser className="h-3.5 w-3.5" />
                                  {assignee}
                                </span>
                              )}
                              {step.timeEstimate && (
                                <span className="flex items-center gap-1.5">
                                  <FiClock className="h-3.5 w-3.5" />
                                  {step.timeEstimate}
                                </span>
                              )}
                            </div>

                            {step.notes && (
                              <p className="mt-2 text-xs text-gray-400 italic border-t border-gray-200 pt-2">
                                Note: {step.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Info panel */}
        <div className="space-y-6">
          {/* Overall progress */}
          {steps.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                Overall Progress
              </h3>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Completion</span>
                <span className="font-bold text-gray-900">{progress}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${progress === 100 ? "bg-green-500" : "bg-amber-500"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">
                {steps.filter((s) => s.status === "completed").length} /{" "}
                {steps.length} steps done
              </p>
            </div>
          )}

          {/* Process info */}
          <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiInfo className="h-4 w-4 text-amber-500" />
              Process Details
            </h3>
            <div className="space-y-0.5">
              <InfoRow
                label="Status"
                value={process.status}
                valueClass={
                  process.status === "completed"
                    ? "text-green-600"
                    : process.status === "active"
                      ? "text-blue-600"
                      : "text-gray-700"
                }
              />
              <InfoRow label="Category" value={process.category} />
              <InfoRow label="Visibility" value={process.visibility} />
              <InfoRow
                label="Last Updated"
                value={formatTimeAgo(process.updatedAt)}
              />
              <InfoRow label="Created" value={formatDate(process.createdAt)} />
              {assigneeNames.length > 0 && (
                <InfoRow label="Assigned To" value={assigneeNames.join(", ")} />
              )}
            </div>
          </div>

          {/* Help box */}
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Need Help?
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Contact your process owner or workspace admin for assistance
                  with this workflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Detail Modal */}
      {selectedStep && (
        <StepDetailModal
          step={selectedStep}
          isCompleting={isCompleting}
          onClose={() => setSelectedStep(null)}
          onComplete={handleCompleteStep}
        />
      )}
    </div>
  );
}

// ─── Step Detail Modal ───────────────────────────────────────────────────────

function StepDetailModal({ step, isCompleting, onClose, onComplete }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-white border-2 border-amber-100 rounded-xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
                <FiLayers className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Step Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-5">
            {/* Step Title */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Step Title
              </p>
              <p className="text-base font-semibold text-gray-900">
                {step.title}
              </p>
            </div>

            {/* Step Description */}
            {step.description && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Description
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </div>
            )}

            {/* Step Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Assignee */}
              {formatAssignee(step.assignee) && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Assigned To
                  </p>
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-blue-600 shrink-0" />
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {formatAssignee(step.assignee)}
                    </p>
                  </div>
                </div>
              )}

              {/* Time Estimate */}
              {step.timeEstimate && (
                <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Time Estimate
                  </p>
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-orange-600 shrink-0" />
                    <p className="text-sm font-medium text-gray-900">
                      {step.timeEstimate}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step Notes */}
            {step.notes && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Notes
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {step.notes}
                </p>
              </div>
            )}

            {/* Status Badge */}
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <FiInfo className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-900">
                Current Status:{" "}
                <span className="font-semibold capitalize">{step.status}</span>
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-amber-100 bg-gray-50">
            <button
              onClick={onClose}
              disabled={isCompleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onComplete}
              disabled={isCompleting || step.status === "completed"}
              className="px-5 py-2 text-sm font-medium text-white bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition-all"
            >
              {isCompleting ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Completing...
                </>
              ) : step.status === "completed" ? (
                <>
                  <FiCheck className="w-4 h-4" />
                  Completed
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  Mark Complete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
