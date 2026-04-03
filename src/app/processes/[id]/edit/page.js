"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { processAPI } from "../../../api/processAPI";
import {
  FiLayers,
  FiPlus,
  FiArrowLeft,
  FiSave,
  FiUsers,
  FiClock,
  FiAlertCircle,
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiTrash2,
  FiHelpCircle,
  FiZap,
  FiUpload,
  FiX,
  FiEdit2,
  FiEye,
  FiCopy,
} from "react-icons/fi";

export default function EditProcessPage() {
  const router = useRouter();
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    visibility: "private",
    assignedTo: [],
    steps: [],
    notifications: { email: true, slack: false, inApp: true },
    automation: {
      autoAssign: false,
      dueDateReminders: true,
      escalation: false,
    },
  });

  const categories = [
    "Onboarding",
    "HR",
    "Finance",
    "IT",
    "Marketing",
    "Sales",
    "Operations",
    "Customer Support",
    "Legal",
  ];
  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@company.com",
      role: "admin",
      avatar: "JD",
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah@company.com",
      role: "editor",
      avatar: "SC",
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@company.com",
      role: "viewer",
      avatar: "MW",
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma@company.com",
      role: "editor",
      avatar: "ED",
    },
    {
      id: 5,
      name: "Alex Kim",
      email: "alex@company.com",
      role: "viewer",
      avatar: "AK",
    },
  ];

  const stepsConfig = [
    { number: 1, title: "Basic Info", description: "Process details" },
    { number: 2, title: "Steps", description: "Define workflow steps" },
    { number: 3, title: "Assignments", description: "Assign team members" },
    { number: 4, title: "Settings", description: "Configure options" },
  ];

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError("Missing process id in URL. Unable to load process data.");
      return;
    }

    const loadProcess = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(`[Edit] Loading process with ID: ${id}`);
        const result = await processAPI.getProcess(id);

        console.log(`[Edit] API Result:`, result);

        if (result.success) {
          const process = result.data;
          console.log("[Edit] Process data received:", process);

          const newFormData = {
            name: process.name?.toString() || "",
            description: process.description?.toString() || "",
            category: process.category?.toString() || "",
            visibility: process.visibility?.toString() || "private",
            assignedTo: Array.isArray(process.assignedTo)
              ? process.assignedTo.map((a) =>
                  typeof a === "string" ? a : a._id,
                )
              : [],
            steps: Array.isArray(process.steps)
              ? process.steps.map((step, index) => ({
                  id: step._id || `step-${index}`,
                  _id: step._id || null,
                  title: step.title?.toString() || "",
                  description: step.description?.toString() || "",
                  timeEstimate: step.timeEstimate?.toString() || "1 hour",
                  order: index + 1,
                  notes: step.notes?.toString() || "",
                  status: step.status?.toString() || "pending",
                  assignee: step.assignee?.toString() || "",
                }))
              : [],
            notifications: {
              email: process.settings?.notifications?.email ?? true,
              slack: process.settings?.notifications?.slack ?? false,
              inApp: process.settings?.notifications?.inApp ?? true,
            },
            automation: {
              autoAssign:
                process.settings?.automation?.autoAssignTasks ?? false,
              dueDateReminders:
                process.settings?.automation?.dueDateReminders ?? true,
              escalation:
                process.settings?.automation?.escalateOverdueTasks ?? false,
            },
          };

          console.log("[Edit] Setting formData to:", newFormData);
          setFormData(newFormData);
          console.log("[Edit] FormData set successfully");
        } else {
          const errorMsg = result.error || "Failed to load process";
          setError(errorMsg);
          console.error("[Edit] API Error:", errorMsg);
        }
      } catch (err) {
        console.error("[Edit] Unexpected error loading process:", err);
        setError("An unexpected error occurred. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProcess();
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStepChange = (stepId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((step) =>
        step.id === stepId ? { ...step, [field]: value } : step,
      ),
    }));
  };

  const addNewStep = () => {
    setFormData((prev) => {
      const nextOrder = prev.steps.length + 1;
      return {
        ...prev,
        steps: [
          ...prev.steps,
          {
            id: `step-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            _id: null,
            title: `Step ${nextOrder}`,
            description: "Describe this step...",
            assignee: "",
            timeEstimate: "1 hour",
            order: nextOrder,
            notes: "",
            status: "pending",
          },
        ],
      };
    });
  };

  const removeStep = (stepId) => {
    setFormData((prev) => {
      if (prev.steps.length <= 1) return prev;

      const filtered = prev.steps.filter((step) => step.id !== stepId);
      return {
        ...prev,
        steps: filtered.map((step, index) => ({
          ...step,
          order: index + 1,
        })),
      };
    });
  };

  const moveStepUp = (index) => {
    if (index > 0) {
      setFormData((prev) => {
        const newSteps = [...prev.steps];
        [newSteps[index], newSteps[index - 1]] = [
          newSteps[index - 1],
          newSteps[index],
        ];
        return {
          ...prev,
          steps: newSteps.map((step, idx) => ({ ...step, order: idx + 1 })),
        };
      });
    }
  };

  const moveStepDown = (index) => {
    setFormData((prev) => {
      if (index < prev.steps.length - 1) {
        const newSteps = [...prev.steps];
        [newSteps[index], newSteps[index + 1]] = [
          newSteps[index + 1],
          newSteps[index],
        ];
        return {
          ...prev,
          steps: newSteps.map((step, idx) => ({ ...step, order: idx + 1 })),
        };
      }
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeStep !== stepsConfig.length) {
      setError("Please complete all steps before submitting.");
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      setError("Process name is required.");
      return;
    }
    if (!formData.category) {
      setError("Please select a category.");
      return;
    }
    if (formData.steps.some((step) => !step.title.trim())) {
      setError("All steps must have a title.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage("");

    try {
      const result = await processAPI.updateProcess(id, formData);

      if (result.success) {
        setSuccessMessage(result.message);
        setSuccess(true);
        console.log("Process updated successfully:", result.data);

        setTimeout(() => {
          router.push("/processes");
        }, 2000);
      } else {
        setError(result.error || "Failed to update process. Please try again.");
        console.error("Error updating process:", result.error);
      }
    } catch (err) {
      const errorMessage =
        err.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      console.error("Unexpected error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      console.log(`[Edit] Deleting process with ID: ${id}`);
      const result = await processAPI.deleteProcess(id);

      if (result.success) {
        setSuccessMessage("Process deleted successfully");
        setSuccess(true);
        console.log("Process deleted successfully");

        setTimeout(() => {
          router.push("/processes");
        }, 1500);
      } else {
        setError(result.error || "Failed to delete process. Please try again.");
        console.error("Error deleting process:", result.error);
        setShowDeleteModal(false);
      }
    } catch (err) {
      const errorMessage =
        err.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      console.error("Unexpected error deleting process:", err);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const validateStep = () => {
    switch (activeStep) {
      case 1:
        return formData.name.trim() !== "" && formData.category !== "";
      case 2:
        return formData.steps.every((step) => step.title.trim() !== "");
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep() && activeStep < stepsConfig.length) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderStepContent = () => {
    console.log("Rendering step content with formData:", formData);
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Process Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                placeholder="e.g., Employee Onboarding Process"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows="4"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                placeholder="Describe what this process accomplishes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                      formData.category === cat
                        ? "border-amber-500 bg-amber-50 shadow-sm"
                        : "border-gray-300 hover:border-amber-300 hover:bg-amber-50/50"
                    }`}
                    onClick={() => handleInputChange("category", cat)}
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {cat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    formData.visibility === "private"
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-300 hover:border-amber-300"
                  }`}
                  onClick={() => handleInputChange("visibility", "private")}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${formData.visibility === "private" ? "bg-amber-500" : "bg-gray-300"}`}
                    ></div>
                    <span className="font-medium text-gray-900">Private</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Only assigned team members can view
                  </p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    formData.visibility === "public"
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-300 hover:border-amber-300"
                  }`}
                  onClick={() => handleInputChange("visibility", "public")}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${formData.visibility === "public" ? "bg-amber-500" : "bg-gray-300"}`}
                    ></div>
                    <span className="font-medium text-gray-900">Public</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    All workspace members can view
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Process Steps
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Define each step in your workflow
                </p>
              </div>
              <button
                type="button"
                onClick={addNewStep}
                className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all shadow-sm"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Add Step
              </button>
            </div>

            <div className="space-y-4">
              {formData.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white border-2 border-amber-200 rounded-lg px-4 py-2 shadow-sm">
                        <span className="font-bold text-amber-600">
                          Step {step.order}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveStepUp(index)}
                          disabled={index === 0}
                          className="p-1.5 text-gray-400 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Up"
                        >
                          <FiChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => moveStepDown(index)}
                          disabled={index === formData.steps.length - 1}
                          className="p-1.5 text-gray-400 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Down"
                        >
                          <FiChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {formData.steps.length > 1 && (
                      <button
                        onClick={() => removeStep(step.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove Step"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Step Title
                      </label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) =>
                          handleStepChange(step.id, "title", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter step title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Estimate
                      </label>
                      <select
                        value={step.timeEstimate}
                        onChange={(e) =>
                          handleStepChange(
                            step.id,
                            "timeEstimate",
                            e.target.value,
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="15 min">15 minutes</option>
                        <option value="30 min">30 minutes</option>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        <option value="4 hours">4 hours</option>
                        <option value="1 day">1 day</option>
                        <option value="2 days">2 days</option>
                        <option value="1 week">1 week</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={step.description}
                      onChange={(e) =>
                        handleStepChange(step.id, "description", e.target.value)
                      }
                      rows="2"
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-amber-500"
                      placeholder="Describe what happens in this step"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign To
                      </label>
                      <select
                        value={step.assignee}
                        onChange={(e) =>
                          handleStepChange(step.id, "assignee", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">Select team member</option>
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.email}>
                            {member.name} ({member.role})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={step.notes || ""}
                        onChange={(e) =>
                          handleStepChange(step.id, "notes", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-amber-500"
                        placeholder="Additional notes for this step"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
              <div className="flex items-start gap-3">
                <FiHelpCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Pro Tips</p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>
                      • Keep each step focused on a single task or decision
                    </li>
                    <li>• Assign steps to specific roles for clarity</li>
                    <li>• Add notes to provide helpful context</li>
                    <li>• Drag steps to reorder them as needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Assign Team Members
              </h3>
              <p className="text-gray-600 mb-6">
                Select team members who can view and participate in this process
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      formData.assignedTo.includes(member.email)
                        ? "border-amber-500 bg-amber-50 shadow-sm"
                        : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/30"
                    }`}
                    onClick={() => {
                      const newAssigned = formData.assignedTo.includes(
                        member.email,
                      )
                        ? formData.assignedTo.filter(
                            (email) => email !== member.email,
                          )
                        : [...formData.assignedTo, member.email];
                      handleInputChange("assignedTo", newAssigned);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          formData.assignedTo.includes(member.email)
                            ? "bg-amber-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {formData.assignedTo.includes(member.email) ? (
                          <FiCheck className="h-5 w-5" />
                        ) : (
                          <span className="font-semibold">{member.avatar}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          member.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : member.role === "editor"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <FiUsers className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Assignment Notes</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Assigned members will receive notifications about process
                    updates. You can also assign specific team members to
                    individual steps in the previous section.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Process Settings
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FiBell className="h-4 w-4" />
                    Notifications
                  </h4>
                  <div className="space-y-3">
                    {formData.notifications &&
                      Object.entries(formData.notifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                          >
                            <div>
                              <p className="font-medium text-gray-900 capitalize">
                                {key} Notifications
                              </p>
                              <p className="text-sm text-gray-500">
                                {key === "email" &&
                                  "Receive email notifications for process updates"}
                                {key === "slack" &&
                                  "Get notified in Slack channel"}
                                {key === "inApp" && "Show notifications in-app"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleInputChange("notifications", {
                                  ...formData.notifications,
                                  [key]: !value,
                                })
                              }
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                value ? "bg-amber-500" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  value ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        ),
                      )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FiZap className="h-4 w-4" />
                    Automation Rules
                  </h4>
                  <div className="space-y-3">
                    {formData.automation &&
                      Object.entries(formData.automation).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {key === "autoAssign"
                                  ? "Auto-assign Tasks"
                                  : key === "dueDateReminders"
                                    ? "Due Date Reminders"
                                    : "Escalate Overdue Tasks"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {key === "autoAssign" &&
                                  "Automatically assign tasks to available team members"}
                                {key === "dueDateReminders" &&
                                  "Send reminders before tasks are due"}
                                {key === "escalation" &&
                                  "Escalate overdue tasks to managers"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleInputChange("automation", {
                                  ...formData.automation,
                                  [key]: !value,
                                })
                              }
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                value ? "bg-amber-500" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  value ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        ),
                      )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">
                    Attachments
                  </h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-300 transition-colors">
                    <FiUpload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports PDF, DOC, XLS up to 10MB each
                    </p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                  {/* Existing attachments would show here */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FiFileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">
                            onboarding_checklist.pdf
                          </p>
                          <p className="text-xs text-gray-500">
                            2.4 MB • Uploaded Jan 15, 2024
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-red-500">
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading process data...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="py-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="bg-green-100 rounded-full p-4 w-fit mx-auto mb-4">
            <FiCheck className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {successMessage.includes("deleted")
              ? "Process Deleted!"
              : "Process Updated!"}
          </h2>
          <p className="text-gray-600 mb-6">
            {successMessage.includes("deleted")
              ? "The process has been permanently deleted"
              : `${formData.name} has been updated successfully`}
          </p>
          <div className="flex space-x-3 justify-center">
            {!successMessage.includes("deleted") && (
              <Link
                href={`/processes/${id}`}
                className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all shadow-md"
              >
                View Process
              </Link>
            )}
            <Link
              href="/processes"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-amber-300 hover:text-amber-600 transition-all"
            >
              Back to Processes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/processes/${id}`}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Back to Process
          </Link>
          <div className="h-8 w-px bg-gray-300"></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Edit Process
            </h1>
            <p className="text-gray-600 mt-1">
              Update your workflow configuration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-amber-300 hover:text-amber-600 transition-all flex items-center gap-2"
          >
            <FiEye className="h-4 w-4" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all flex items-center gap-2"
          >
            <FiTrash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className={`${showPreview ? "lg:col-span-2" : "lg:col-span-3"}`}>
          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700 text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
            {/* Progress Bar */}
            <div className="px-6 py-4 border-b border-amber-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-gray-900">
                  Step {activeStep} of {stepsConfig.length}:{" "}
                  {stepsConfig.find((s) => s.number === activeStep)?.title}
                </div>
                <div className="text-sm text-gray-500">
                  {
                    stepsConfig.find((s) => s.number === activeStep)
                      ?.description
                  }
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${((activeStep - 1) / (stepsConfig.length - 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="px-6 py-4 border-b border-amber-100 bg-white">
              <div className="flex justify-between">
                {stepsConfig.map((step) => (
                  <div key={step.number} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 cursor-pointer transition-all ${
                        step.number === activeStep
                          ? "bg-amber-500 text-white shadow-md"
                          : step.number < activeStep
                            ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        step.number < activeStep && setActiveStep(step.number)
                      }
                    >
                      {step.number < activeStep ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        step.number === activeStep
                          ? "text-amber-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={activeStep === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      activeStep === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <FiChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {activeStep === stepsConfig.length ? (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating Process...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-4 h-4" />
                          Update Process
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                    >
                      Next Step
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Preview Sidebar */}
        {showPreview && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm sticky top-24">
              <div className="px-5 py-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiEye className="h-5 w-5 text-amber-500" />
                  Live Preview
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  See how your process will look
                </p>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    Basic Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium text-gray-900 truncate max-w-[180px]">
                        {formData.name || "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium text-gray-900">
                        {formData.category || "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Visibility:</span>
                      <span className="font-medium capitalize text-gray-900">
                        {formData.visibility}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    Workflow
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Steps:</span>
                      <span className="font-medium text-gray-900">
                        {formData.steps.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Assigned Members:</span>
                      <span className="font-medium text-gray-900">
                        {formData.assignedTo.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    Steps Preview
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {formData.steps.slice(0, 4).map((step) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                          {step.order}
                        </div>
                        <span className="text-gray-700 flex-1 truncate">
                          {step.title}
                        </span>
                        <FiClock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {step.timeEstimate}
                        </span>
                      </div>
                    ))}
                    {formData.steps.length > 4 && (
                      <p className="text-xs text-center text-gray-500 mt-2">
                        +{formData.steps.length - 4} more steps
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiZap className="h-5 w-5 text-amber-600" />
                      <p className="text-sm font-semibold text-gray-900">
                        AI Ready
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">
                      After saving, AI will analyze your workflow and suggest
                      optimizations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <FiAlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Delete Process?
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{formData.name}"</span>? This
              action cannot be undone.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="h-4 w-4" />
                    Delete Process
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component
function FiBell(props) {
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
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function FiFileText(props) {
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
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
