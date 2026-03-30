"use client";

import { useState } from "react";
import { 
  FiUser, 
  FiMail, 
  FiBriefcase, 
  FiSave,
  FiEdit2,
  FiLock
} from "react-icons/fi";

export default function UserProfilePage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Viewer",
    department: "Marketing",
    joinDate: "March 15, 2024",
    avatar: "JD"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">View and manage your account information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
              {profile.avatar}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-amber-600 font-medium mt-1">{profile.role}</p>
            <p className="text-gray-500 text-sm mt-2">Member since {profile.joinDate}</p>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-3 text-left">
                <p className="text-xs text-blue-800 font-medium">Your Permissions</p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>✓ View all processes</li>
                  <li>✓ Complete assigned tasks</li>
                  <li>✗ Create or edit processes</li>
                  <li>✗ Manage team members</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <FiEdit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <FiSave className="h-4 w-4" />
                  Save Changes
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline mr-2 h-4 w-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-amber-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2.5">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMail className="inline mr-2 h-4 w-4" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-amber-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2.5">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiBriefcase className="inline mr-2 h-4 w-4" />
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-amber-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2.5">{profile.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiLock className="inline mr-2 h-4 w-4" />
                  Role
                </label>
                <p className="text-gray-900 py-2.5 bg-gray-50 px-4 rounded-lg">{profile.role}</p>
                <p className="text-xs text-gray-500 mt-1">Role cannot be changed. Contact admin for role updates.</p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-gray-50 rounded-2xl p-4">
            <p className="text-sm text-gray-600">
              <strong>Need to change your password or update security settings?</strong><br />
              Please contact your workspace administrator for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}