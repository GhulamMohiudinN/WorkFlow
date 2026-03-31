"use client";
import { useState, useEffect } from "react";
import {
  FiSettings,
  FiSave,
  FiBell,
  FiShield,
  FiGlobe,
  FiDatabase,
  FiUsers,
  FiLock,
  FiZap,
  FiEye,
  FiMail,
  FiClock,
  FiDownload,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { FiCpu } from "react-icons/fi";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    workspaceName: "",
    timezone: "",
    language: "English",
    dateFormat: "",

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "24 hours",
    ipWhitelist: false,
    loginAlerts: false,

    // Notification Settings
    emailNotifications: false,
    pushNotifications: false,
    processUpdates: false,
    teamActivity: false,
    weeklyReports: true,

    // Integration Settings
    slackIntegration: false,
    googleWorkspace: false,
    microsoftTeams: false,

    // Data & Privacy
    dataRetention: "",
    autoBackup: true,
    exportFormat: "",

    // API Settings
    apiEnabled: false,
    apiKey: "sk_live_**************",
    webhookUrl: "https://webhook.techflow.com",
  });
  const [initialSettings, setInitialSettings] = useState(null);

  useEffect(() => {
    // Simulate loading settings
    setTimeout(() => {
      setInitialSettings(settings);
      setLoading(false);
    }, 500);
  }, []);

  const tabs = [
    { id: "general", label: "General", icon: FiSettings },
    { id: "security", label: "Security", icon: FiShield },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "integrations", label: "Integrations", icon: FiGlobe },
    { id: "data", label: "Data & Privacy", icon: FiDatabase },
    { id: "api", label: "API", icon: FiZap },
  ];

  // Function to get changed settings only
  const getChangedSettings = () => {
    if (!initialSettings) return null;

    const changedSettings = {};

    // Helper to extract number from string like "24 hours" -> 24
    const extractNumber = (str) => {
      if (!str) return null;
      const match = str.match(/\d+/);
      return match ? parseInt(match[0]) : null;
    };

    // Check General settings
    if (settings.workspaceName !== initialSettings.workspaceName) {
      changedSettings.general = {
        ...changedSettings.general,
        workspaceName: settings.workspaceName,
      };
    }

    if (settings.timezone !== initialSettings.timezone) {
      changedSettings.general = {
        ...changedSettings.general,
        timezone: settings.timezone,
      };
    }

    if (settings.dateFormat !== initialSettings.dateFormat) {
      changedSettings.general = {
        ...changedSettings.general,
        dateFormat: settings.dateFormat,
      };
    }

    // Check Security settings
    const securityChanges = {};
    if (settings.twoFactorAuth !== initialSettings.twoFactorAuth) {
      securityChanges.twoFactorAuth = settings.twoFactorAuth;
    }

    const sessionTimeoutNumber = extractNumber(settings.sessionTimeout);
    const initialSessionTimeoutNumber = extractNumber(
      initialSettings.sessionTimeout,
    );
    if (sessionTimeoutNumber !== initialSessionTimeoutNumber) {
      securityChanges.sessionTimeoutInHours = sessionTimeoutNumber;
    }

    if (settings.loginAlerts !== initialSettings.loginAlerts) {
      securityChanges.loginAlerts = settings.loginAlerts;
    }

    if (Object.keys(securityChanges).length > 0) {
      changedSettings.security = securityChanges;
    }

    // Check Notification settings
    const notificationChanges = {};
    if (settings.emailNotifications !== initialSettings.emailNotifications) {
      notificationChanges.emailNotifications = settings.emailNotifications;
    }
    if (settings.pushNotifications !== initialSettings.pushNotifications) {
      notificationChanges.pushNotifications = settings.pushNotifications;
    }
    if (settings.processUpdates !== initialSettings.processUpdates) {
      notificationChanges.processUpdates = settings.processUpdates;
    }
    if (settings.teamActivity !== initialSettings.teamActivity) {
      notificationChanges.teamActivity = settings.teamActivity;
    }

    if (Object.keys(notificationChanges).length > 0) {
      changedSettings.notifications = notificationChanges;
    }

    // Check Integration settings
    const integrationChanges = {};
    if (settings.slackIntegration !== initialSettings.slackIntegration) {
      integrationChanges.slackIntegration = settings.slackIntegration;
    }
    if (settings.googleWorkspace !== initialSettings.googleWorkspace) {
      integrationChanges.googleWorkspace = settings.googleWorkspace;
    }
    if (settings.microsoftTeams !== initialSettings.microsoftTeams) {
      integrationChanges.microsoftTeams = settings.microsoftTeams;
    }

    if (Object.keys(integrationChanges).length > 0) {
      changedSettings.integrations = integrationChanges;
    }

    // Check Data & Privacy settings
    const dataChanges = {};
    const retentionNumber = extractNumber(settings.dataRetention);
    const initialRetentionNumber = extractNumber(initialSettings.dataRetention);
    if (retentionNumber !== initialRetentionNumber) {
      dataChanges.dataRetentionPeriodInMonths = retentionNumber;
    }

    if (settings.exportFormat !== initialSettings.exportFormat) {
      dataChanges.exportFormat = settings.exportFormat.toLowerCase();
    }

    if (Object.keys(dataChanges).length > 0) {
      changedSettings.dataPrivacy = dataChanges;
    }

    // Check API settings
    const apiChanges = {};
    if (settings.apiEnabled !== initialSettings.apiEnabled) {
      apiChanges.enableApiAccess = settings.apiEnabled;
    }

    if (Object.keys(apiChanges).length > 0) {
      changedSettings.apiSettings = apiChanges;
    }

    return Object.keys(changedSettings).length > 0 ? changedSettings : null;
  };

  const handleSave = async () => {
    const changedSettings = getChangedSettings();

    if (!changedSettings) {
      toast.success("No changes to save");
      return;
    }

    setSaving(true);
    // Simulate saving settings
    setTimeout(() => {
      toast.success("Settings updated successfully");
      setInitialSettings(settings);
      setSaving(false);
    }, 1000);
  };

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const generateApiKey = () => {
    const newKey = "sk_live_" + Math.random().toString(36).substring(2, 15);
    handleInputChange("apiKey", newKey);
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-amber-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiCpu className="h-6 w-6 text-amber-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Workspace Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Configure your workspace preferences and security
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2 h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-amber-100">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Workspace Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      value={settings.workspaceName}
                      onChange={(e) =>
                        handleInputChange("workspaceName", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      This name appears across your workspace
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) =>
                        handleInputChange("timezone", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    >
                      <option value="America/New_York">
                        Eastern Time (ET)
                      </option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">
                        Pacific Time (PT)
                      </option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Berlin">
                        Central Europe (CET)
                      </option>
                      <option value="Africa/Algiers">Algiers (CET)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) =>
                        handleInputChange("dateFormat", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Workspace Members
                </h3>
                <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiUsers className="h-5 w-5 text-amber-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          8 team members
                        </p>
                        <p className="text-sm text-gray-600">
                          Manage members in the Team section
                        </p>
                      </div>
                    </div>
                    <a
                      href="/users"
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Go to Team →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Security Settings
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FiLock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("twoFactorAuth")}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        settings.twoFactorAuth ? "bg-amber-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.twoFactorAuth
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FiClock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Session Timeout
                        </p>
                        <p className="text-sm text-gray-600">
                          Automatically log out inactive users
                        </p>
                      </div>
                    </div>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) =>
                        handleInputChange("sessionTimeout", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    >
                      <option value="1 hour">1 hour</option>
                      <option value="8 hours">8 hours</option>
                      <option value="24 hours">24 hours</option>
                      <option value="7 days">7 days</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FiShield className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          IP Whitelist
                        </p>
                        <p className="text-sm text-gray-600">
                          Restrict access to specific IP addresses
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("ipWhitelist")}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        settings.ipWhitelist ? "bg-amber-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.ipWhitelist
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FiAlertCircle className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Login Alerts
                        </p>
                        <p className="text-sm text-gray-600">
                          Get notified of new logins to your account
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("loginAlerts")}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        settings.loginAlerts ? "bg-amber-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.loginAlerts
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Security Information
                </h3>
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <div className="flex items-start">
                    <FiShield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Enterprise Security
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Your data is encrypted with AES-256 encryption at rest
                        and TLS 1.3 in transit. All data is stored in MongoDB
                        Atlas with SOC 2 compliance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Email Notifications
                      </p>
                      <p className="text-sm text-gray-600">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle("emailNotifications")}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      settings.emailNotifications
                        ? "bg-amber-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.emailNotifications
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FiBell className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Push Notifications
                      </p>
                      <p className="text-sm text-gray-600">
                        Receive in-app notifications
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle("pushNotifications")}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      settings.pushNotifications
                        ? "bg-amber-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.pushNotifications
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FiZap className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Process Updates
                      </p>
                      <p className="text-sm text-gray-600">
                        Get notified when processes are updated
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle("processUpdates")}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      settings.processUpdates ? "bg-amber-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.processUpdates
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FiUsers className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Team Activity</p>
                      <p className="text-sm text-gray-600">
                        Notifications for team member activities
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle("teamActivity")}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      settings.teamActivity ? "bg-amber-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.teamActivity
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Integration Settings */}
          {activeTab === "integrations" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Third-Party Integrations
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <FiZap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Slack Integration
                      </p>
                      <p className="text-sm text-gray-600">
                        Connect your Slack workspace
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle("slackIntegration")}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      settings.slackIntegration ? "bg-amber-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.slackIntegration
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <FiGlobe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Google Workspace
                      </p>
                      <p className="text-sm text-gray-600">
                        Connect Google Calendar & Drive
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle("googleWorkspace")}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      settings.googleWorkspace ? "bg-amber-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.googleWorkspace
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <FiUsers className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Microsoft Teams
                      </p>
                      <p className="text-sm text-gray-600">
                        Connect Microsoft Teams
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle("microsoftTeams")}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      settings.microsoftTeams ? "bg-amber-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.microsoftTeams
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
                  <div className="flex items-start">
                    <FiAlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Integration Security
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        All integrations use OAuth 2.0 for secure
                        authentication. We never store your third-party
                        passwords.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data & Privacy */}
          {activeTab === "data" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Data & Privacy Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Retention Period
                  </label>
                  <select
                    value={settings.dataRetention}
                    onChange={(e) =>
                      handleInputChange("dataRetention", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  >
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                    <option value="24 months">24 months</option>
                    <option value="36 months">36 months</option>
                    <option value="Indefinitely">Indefinitely</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    How long we keep your inactive data
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <select
                    value={settings.exportFormat}
                    onChange={(e) =>
                      handleInputChange("exportFormat", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  >
                    <option value="JSON">JSON</option>
                    <option value="CSV">CSV</option>
                    <option value="EXCEL">Excel</option>
                    <option value="PDF">PDF</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Format for data exports
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Data Export
                </h3>
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiDownload className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Export Your Data
                        </p>
                        <p className="text-sm text-gray-600">
                          Download all your workspace data
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 hover:cursor-not-allowed bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Settings */}
          {activeTab === "api" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                API Settings
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FiZap className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">API Access</p>
                      <p className="text-sm text-gray-600">
                        Enable API access for your workspace
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle("apiEnabled")}
                    className={`hover:cursor-not-allowed relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      settings.apiEnabled ? "bg-amber-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none  inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.apiEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-red-200 bg-red-50">
          <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Delete Workspace</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Permanently delete your workspace and all data. This action
                  cannot be undone.
                </p>
              </div>
              <button className="mt-4 md:mt-0 px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium">
                Delete Workspace
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Export All Data</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Download a complete archive of all your workspace data.
                </p>
              </div>
              <button className="hover:cursor-not-allowed mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
