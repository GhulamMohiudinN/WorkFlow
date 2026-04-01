"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  FiGlobe,
  FiUsers,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiShield,
  FiDatabase,
  FiTrendingUp,
  FiBriefcase,
  FiCheck,
  FiAlertCircle,
  FiHash,
  FiPhone,
  FiToggleLeft,
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import { authAPI } from "../../api/auth";
import {
  COMPANY_TYPES,
  INDUSTRIES,
  EMPLOYEE_RANGES,
  workflowTypes,
} from "../../(auth)/workspaceCreation/content";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"];
const TIMEZONES =
  typeof Intl !== "undefined" && Intl.supportedValuesOf
    ? Intl.supportedValuesOf("timeZone").sort()
    : ["UTC"];
const INITIAL_TEAM_SIZES = [
  "Just me (Admin)",
  "2-5 team members",
  "6-20 team members",
  "21-50 team members",
  "50+ team members",
];
const EXPECTED_WORKFLOW_RANGES = [
  "1-10 workflows",
  "11-50 workflows",
  "51-200 workflows",
  "200+ workflows",
];
const TABS = {
  BASIC: "basic",
  DETAILS: "details",
  WORKFLOWS: "workflows",
  NOTIFICATIONS: "notifications",
};

// Reusable Field Component
function FormField({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  placeholder = "",
  options = [],
}) {
  if (!isEditing) {
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {label}
        </label>
        <p className="text-sm text-gray-900 font-medium">
          {value || <span className="text-gray-400">—</span>}
        </p>
      </div>
    );
  }

  if (type === "select") {
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {label}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {label}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows="3"
          className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
      />
    </div>
  );
}

// Tab Button Component
function TabButton({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
        active
          ? "border-amber-500 text-amber-600 bg-amber-50"
          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

export default function CompanyPage() {
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.BASIC);
  const [isEditing, setIsEditing] = useState(false);

  // Initial data state
  const initializeCompanyData = () => ({
    name: "",
    email: "",
    website: "",
    industry: "",
    foundedYear: "",
    headquarters: "",
    phoneNumber: "",
    companyType: "",
    employeeCount: "",
    currency: "USD",
    timezone: "",
    taxId: "",
    registrationNumber: "",
    automationPriority: "medium",
    initialTeamSize: "",
    expectedWorkflows: "",
    primaryWorkflowTypes: [],
    notificationPreferences: {
      email: true,
      slack: false,
      teams: false,
      inApp: true,
    },
  });

  const [company, setCompany] = useState(initializeCompanyData());

  // Load workspace data from localStorage
  useEffect(() => {
    setIsClient(true);

    const storedWorkspace = localStorage.getItem("workspace");
    if (storedWorkspace) {
      try {
        const parsed = JSON.parse(storedWorkspace);
        setCompany((prev) => ({
          ...prev,
          name: parsed.companyName || "",
          email: parsed.companyEmail || "",
          companyType: parsed.companyType || "",
          headquarters: parsed.headquarters || "",
          foundedYear: parsed.foundedYear || "",
          industry: parsed.industry || "",
          employeeCount: parsed.employeeCount || "",
          currency: parsed.currency || "USD",
          automationPriority: parsed.automationPriority || "medium",
          initialTeamSize: parsed.initialTeamSize || "",
          expectedWorkflows: parsed.expectedWorkflows || "",
          taxId: parsed.taxId || "",
          registrationNumber: parsed.registrationNumber || "",
          timezone: parsed.timezone || "",
          website: parsed.website || "",
          phoneNumber: parsed.phoneNumber || "",
          primaryWorkflowTypes: parsed.primaryWorkflowTypes || [],
          notificationPreferences: parsed.notificationPreferences || {
            email: true,
            slack: false,
            teams: false,
            inApp: true,
          },
        }));
      } catch (error) {
        console.error("Error parsing stored workspace:", error);
      }
    }
  }, []);

  // Handle input changes
  const handleInputChange = useCallback((field, value) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Toggle workflow type
  const toggleWorkflowType = useCallback((type) => {
    setCompany((prev) => {
      const exists = prev.primaryWorkflowTypes.includes(type);
      return {
        ...prev,
        primaryWorkflowTypes: exists
          ? prev.primaryWorkflowTypes.filter((item) => item !== type)
          : [...prev.primaryWorkflowTypes, type],
      };
    });
  }, []);

  // Toggle notification preference
  const toggleNotificationPref = useCallback((key) => {
    setCompany((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key],
      },
    }));
  }, []);

  // Save workspace
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validation
      if (!company.name || !company.email) {
        toast.error("Company name and email are required");
        return;
      }

      const payload = {
        companyName: company.name,
        companyEmail: company.email,
        companyType: company.companyType,
        headquarters: company.headquarters,
        foundedYear: company.foundedYear,
        industry: company.industry,
        employeeCount: company.employeeCount,
        currency: company.currency,
        automationPriority: company.automationPriority,
        initialTeamSize: company.initialTeamSize,
        expectedWorkflows: company.expectedWorkflows,
        taxId: company.taxId,
        registrationNumber: company.registrationNumber,
        timezone: company.timezone,
        website: company.website,
        phoneNumber: company.phoneNumber,
        primaryWorkflowTypes: company.primaryWorkflowTypes,
        notificationPreferences: company.notificationPreferences,
      };

      const data = await authAPI.updateWorkspace(payload);
      toast.success("Workspace updated successfully!");

      if (data.workspace) {
        localStorage.setItem("workspace", JSON.stringify(data.workspace));
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Workspace update error:", error);
      const message =
        error?.response?.data?.message ||
        "Failed to update workspace. Please try again.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const stats = [
    {
      label: "Total Members",
      value: "8",
      icon: FiUsers,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Processes",
      value: "12",
      icon: FiTrendingUp,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Storage Used",
      value: "1.2GB",
      icon: FiDatabase,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Days Active",
      value: "45",
      icon: FiCalendar,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Company Profile
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {isEditing
                ? "Edit your company information"
                : "View and manage your company settings"}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-amber-500/25"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-3 rounded-lg text-gray-700 font-medium border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  <FiX className="mr-2 h-5 w-5" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-amber-500/25"
              >
                <FiEdit2 className="mr-2 h-5 w-5" />
                Edit Information
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-2xl border-b border-gray-200 px-6">
          <div className="flex flex-wrap gap-1">
            <TabButton
              active={activeTab === TABS.BASIC}
              label="Basic Information"
              onClick={() => setActiveTab(TABS.BASIC)}
            />
            <TabButton
              active={activeTab === TABS.DETAILS}
              label="Company Details"
              onClick={() => setActiveTab(TABS.DETAILS)}
            />
            <TabButton
              active={activeTab === TABS.WORKFLOWS}
              label="Workflows"
              onClick={() => setActiveTab(TABS.WORKFLOWS)}
            />
            <TabButton
              active={activeTab === TABS.NOTIFICATIONS}
              label="Notifications"
              onClick={() => setActiveTab(TABS.NOTIFICATIONS)}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl border border-t-0 border-gray-200 shadow-lg">
          <div className="p-8">
            {/* Tab: Basic Information */}
            {activeTab === TABS.BASIC && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Company Basics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Company Name"
                      value={company.name}
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange("name", val)}
                      placeholder="Enter company name"
                    />
                    <FormField
                      label="Company Email"
                      value={company.email}
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange("email", val)}
                      type="email"
                      placeholder="contact@company.com"
                    />
                    <FormField
                      label="Industry"
                      value={company.industry}
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange("industry", val)}
                      type="select"
                      options={INDUSTRIES}
                    />
                    <FormField
                      label="Founded Year"
                      value={company.foundedYear}
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange("foundedYear", val)}
                      type="number"
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Website"
                      value={company.website}
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange("website", val)}
                      type="url"
                      placeholder="https://company.com"
                    />
                    <FormField
                      label="Phone Number"
                      value={company.phoneNumber}
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange("phoneNumber", val)}
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                    />
                    <FormField
                      label="Headquarters"
                      value={company.headquarters}
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange("headquarters", val)}
                      placeholder="City, Country"
                    />
                    <FormField
                      label="Company Type"
                      value={company.companyType}
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange("companyType", val)}
                      type="select"
                      options={COMPANY_TYPES}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Company Details */}
            {activeTab === TABS.DETAILS && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Compliance & Legal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Registration Number"
                      value={company.registrationNumber}
                      isEditing={isEditing}
                      onChange={(val) =>
                        handleInputChange("registrationNumber", val)
                      }
                      placeholder="e.g., REG-ACME-001"
                    />
                    <FormField
                      label="Tax ID / VAT Number"
                      value={company.taxId}
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange("taxId", val)}
                      placeholder="e.g., TAX-ACME-2026"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Business Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Employee Count"
                      value={company.employeeCount}
                      isEditing={isEditing}
                      onChange={(val) =>
                        handleInputChange("employeeCount", val)
                      }
                      type="select"
                      options={EMPLOYEE_RANGES}
                    />
                    <FormField
                      label="Primary Currency"
                      value={company.currency}
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange("currency", val)}
                      type="select"
                      options={CURRENCIES}
                    />
                    <FormField
                      label="Timezone"
                      value={company.timezone}
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange("timezone", val)}
                      type="select"
                      options={TIMEZONES}
                    />
                    <FormField
                      label="Automation Priority"
                      value={company.automationPriority}
                      isEditing={isEditing}
                      onChange={(val) =>
                        handleInputChange("automationPriority", val)
                      }
                      type="select"
                      options={["low", "medium", "high"]}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Team Setup
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Initial Team Size"
                      value={company.initialTeamSize}
                      isEditing={isEditing}
                      onChange={(val) =>
                        handleInputChange("initialTeamSize", val)
                      }
                      type="select"
                      options={INITIAL_TEAM_SIZES}
                    />
                    <FormField
                      label="Expected Workflows"
                      value={company.expectedWorkflows}
                      isEditing={isEditing}
                      onChange={(val) =>
                        handleInputChange("expectedWorkflows", val)
                      }
                      type="select"
                      options={EXPECTED_WORKFLOW_RANGES}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Workflows */}
            {activeTab === TABS.WORKFLOWS && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Primary Workflow Types
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Select the types of workflows your organization will manage.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {workflowTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleWorkflowType(type)}
                        disabled={!isEditing}
                        className={`p-4 rounded-lg border-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                          company.primaryWorkflowTypes.includes(type)
                            ? "bg-amber-50 border-amber-500 text-amber-700"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        } ${!isEditing && "cursor-not-allowed opacity-60"}`}
                      >
                        {company.primaryWorkflowTypes.includes(type) && (
                          <FiCheck className="h-4 w-4" />
                        )}
                        <span className="capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Workflow Details
                  </h3>
                  <FormField
                    label="Expected Workflows Description"
                    value={company.expectedWorkflows}
                    isEditing={isEditing}
                    onChange={(val) =>
                      handleInputChange("expectedWorkflows", val)
                    }
                    type="textarea"
                    placeholder="Describe the workflows you plan to automate (e.g., Sales onboarding and invoice processing)"
                  />
                </div>
              </div>
            )}

            {/* Tab: Notifications */}
            {activeTab === TABS.NOTIFICATIONS && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Notification Channels
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Choose how you would like to receive notifications.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(company.notificationPreferences).map(
                      ([channel, enabled]) => (
                        <div
                          key={channel}
                          className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  enabled ? "bg-amber-100" : "bg-gray-100"
                                }`}
                              >
                                <FiToggleLeft
                                  className={`h-5 w-5 ${
                                    enabled ? "text-amber-600" : "text-gray-400"
                                  }`}
                                />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 capitalize">
                                  {channel === "inApp" ? "In-App" : channel}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {channel === "email" && "Email notifications"}
                                  {channel === "slack" && "Slack notifications"}
                                  {channel === "teams" && "Microsoft Teams"}
                                  {channel === "inApp" &&
                                    "In-app notifications"}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleNotificationPref(channel)}
                              disabled={!isEditing}
                              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                                enabled ? "bg-amber-500" : "bg-gray-300"
                              } ${!isEditing && "cursor-not-allowed"}`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ${
                                  enabled ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <FiAlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    These notification preferences apply to your workspace.
                    Individual notification settings can be configured in your
                    user profile.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subscription & Security Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Subscription Status */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiBriefcase className="h-5 w-5 text-amber-600" />
              Subscription Status
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Current Plan
                </span>
                <span className="text-sm font-bold text-gray-900">
                  Enterprise
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Status
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <FiCheck className="h-4 w-4" />
                  Active
                </span>
              </div>
              <button className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200">
                Upgrade Plan
              </button>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiShield className="h-5 w-5 text-amber-600" />
              Security Features
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <FiShield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Enterprise Encryption
                  </p>
                  <p className="text-xs text-gray-600">
                    All data encrypted at rest and in transit
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <FiDatabase className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Secure Backend
                  </p>
                  <p className="text-xs text-gray-600">
                    MongoDB with enterprise-grade security
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <FiUsers className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Role-Based Access
                  </p>
                  <p className="text-xs text-gray-600">
                    Fine-grained permission controls
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
