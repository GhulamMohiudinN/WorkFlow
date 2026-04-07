"use client";

import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiSave,
  FiEdit2,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";
import { authAPI } from "../../api/auth";
import { userAPI } from "../../api/userAPI";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";
}

// ─── Inline toast notification ───────────────────────────────────────────────

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-800"
      : "bg-red-50 border-red-200 text-red-800";

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border mb-4 text-sm font-medium ${colors}`}>
      {type === "success"
        ? <FiCheckCircle className="h-4 w-4 flex-shrink-0" />
        : <FiAlertCircle className="h-4 w-4 flex-shrink-0" />}
      {message}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function UserProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [formData, setFormData] = useState({ name: "" });
  const [error, setError] = useState(null);

  // ── Load profile ───────────────────────────────────────────────────────────
  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Try real API first, fall back to localStorage
      let userData = null;
      try {
        const result = await authAPI.getProfile();
        userData = result?.user || result;
      } catch {
        // API failed – use localStorage snapshot
        const stored = localStorage.getItem("user");
        if (stored) userData = JSON.parse(stored);
      }

      if (userData) {
        setProfile(userData);
        setFormData({ name: userData.name || "" });
      } else {
        setError("Could not load profile information.");
      }
    } catch {
      setError("Something went wrong. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ── Save profile ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setToast({ message: "Name must be at least 2 characters.", type: "error" });
      return;
    }
    if (trimmedName === profile?.name) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const result = await userAPI.updateUser({ name: trimmedName });
      const updatedUser = { ...profile, name: trimmedName, ...(result?.user || {}) };
      setProfile(updatedUser);
      // Sync localStorage so other parts of the app see the updated name
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setToast({
        message: err?.response?.data?.message || "Failed to update profile. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: profile?.name || "" });
    setIsEditing(false);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="mb-8">
          <div className="w-40 h-7 rounded bg-gray-200 mb-2" />
          <div className="w-64 h-4 rounded bg-gray-100" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl border border-amber-100 p-8 flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-200" />
            <div className="w-32 h-5 rounded bg-gray-200" />
            <div className="w-20 h-4 rounded bg-gray-100" />
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl border border-amber-100 p-6 space-y-5">
            {[1,2,3,4].map(i => (
              <div key={i}>
                <div className="w-24 h-3 rounded bg-gray-100 mb-2" />
                <div className="w-full h-10 rounded-xl bg-gray-100" />
              </div>
            ))}
          </div>
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
          <h2 className="text-lg font-bold text-gray-900 mb-2">Could not load profile</h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadProfile}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
          >
            <FiRefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const initials = getInitials(profile?.name);
  const userRole = profile?.role || profile?.userType || "member";

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-2">View and manage your account information</p>
      </div>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── Profile Card ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8 text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-amber-500/25">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{profile?.name || "—"}</h2>
            <p className="text-amber-600 font-medium mt-1 capitalize">{userRole}</p>
            {profile?.email && (
              <p className="text-gray-500 text-sm mt-1 truncate">{profile.email}</p>
            )}
            {profile?.createdAt && (
              <p className="text-gray-400 text-xs mt-2">Member since {formatDate(profile.createdAt)}</p>
            )}

            {/* Verification badge */}
            {profile?.isEmailVerified != null && (
              <div className={`mt-4 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${
                profile.isEmailVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                <FiCheckCircle className="h-3.5 w-3.5" />
                {profile.isEmailVerified ? "Email Verified" : "Email Unverified"}
              </div>
            )}

            {/* Permissions box */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="bg-blue-50 rounded-xl p-4 text-left border border-blue-100">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-2">Your Access</p>
                <ul className="text-sm text-blue-700 space-y-1.5">
                  <li className="flex items-center gap-2"><FiCheckCircle className="h-3.5 w-3.5" /> View all processes</li>
                  <li className="flex items-center gap-2"><FiCheckCircle className="h-3.5 w-3.5" /> Complete assigned tasks</li>
                  <li className="flex items-center gap-2 opacity-50 line-through"><span>Create or edit processes</span></li>
                  <li className="flex items-center gap-2 opacity-50 line-through"><span>Manage team members</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <FiEdit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 shadow-md shadow-amber-500/25"
                  >
                    {isSaving
                      ? (<><div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />Saving...</>)
                      : (<><FiSave className="h-4 w-4" />Save Changes</>)
                    }
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiUser className="inline mr-1.5 h-4 w-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm transition-all"
                    placeholder="Enter your full name"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="text-gray-900 py-2.5 text-sm font-medium">{profile?.name || "—"}</p>
                )}
              </div>

              {/* Email — read-only */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiMail className="inline mr-1.5 h-4 w-4" />
                  Email Address
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 py-2.5 text-sm font-medium">{profile?.email || "—"}</p>
                  {profile?.isEmailVerified && (
                    <FiCheckCircle className="h-4 w-4 text-green-500" title="Verified" />
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Email cannot be changed from here.</p>
              </div>

              {/* Username */}
              {profile?.username && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <p className="text-gray-900 py-2.5 text-sm font-medium">@{profile.username}</p>
                </div>
              )}

              {/* Role — read-only */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiShield className="inline mr-1.5 h-4 w-4" />
                  Role
                </label>
                <div className="py-2.5 px-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 font-medium capitalize">
                  {userRole}
                </div>
                <p className="text-xs text-gray-400 mt-1">Role is assigned by your workspace admin.</p>
              </div>

              {/* User Type */}
              {profile?.userType && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FiLock className="inline mr-1.5 h-4 w-4" />
                    Account Type
                  </label>
                  <div className="py-2.5 px-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 font-medium capitalize">
                    {profile.userType}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-600">
              <strong className="text-gray-800">Need to change your password or security settings?</strong>
              <br />
              Please contact your workspace administrator for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}