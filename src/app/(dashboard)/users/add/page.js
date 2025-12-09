"use client";
import { use, useState } from "react";
import Link from "next/link";
import WORKSPACE from "../../../axios/workspace";
import { useUserStore, useWorkspaceStore } from "../../../store";

import {
  FiMail,
  FiShield,
  FiCheck,
  FiSend,
  FiHelpCircle
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
export default function AddUserPage() {
  const {user} = useUserStore()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [permissionError, setPermissionError] = useState("");
  const { workspace } = useWorkspaceStore();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "editor",
    customMessage: "",
    permissions: {
      createProcesses: true,
      editProcesses: true,
      deleteProcesses: false,
      manageUsers: false,
      viewAnalytics: true
    }
  });


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const handleSubmit = async (e) => {
    setEmailError("")
    setPermissionError("")
    setIsSubmitting(true);
    const allPermissionsFalse =
      Object.values(formData.permissions).every((value) => value === false);

    // Email validation
    if (!formData.email || !emailRegex.test(formData.email)) {
      setEmailError("Invalid email address");
      setIsSubmitting(false);
      return;
    }
    
    if(user?.email?.trim().toLowerCase() === formData.email.trim().toLowerCase()){
      setEmailError("You cannot add yourself as a member");
      setIsSubmitting(false);
      return
    }

    // Permission validation
    if (formData.role === "editor" && allPermissionsFalse) {
      setPermissionError("Please assign at least one permission to the member");
      setIsSubmitting(false);
      return;
    }
    const Payload = {
      workspaceId: workspace._id,
      memberEmail: formData.email,
      role: formData.role,
      customMessage: formData.customMessage,
      permissions: formData.permissions,
    }
    const { data, error } = await WORKSPACE.sendAddMemberEmail(Payload)
    if (error) {
      toast.error("The member already exists in this workspace.");
      setIsSubmitting(false);
      return
    }
    toast.success(data.message);
    setSuccess(true);
    setIsSubmitting(false);

  };

  const rolePermissions = {
    editor: {
      description: "Can create and edit processes, but cannot manage users",
      permissions: [
        formData.permissions.editProcesses && 'Modify existing processes',
        formData.permissions.createProcesses && 'Create new workflow processes',
        formData.permissions.viewAnalytics && 'View workspace analytics',
        formData.permissions.manageUsers && 'Add/remove team members',
        formData.permissions.deleteProcesses && 'Delete processes and data'
      ]
    },
    viewer: {
      description: "Read-only access to view processes and analytics",
      permissions: ["View processes", "View analytics"]
    }
  };

  return (
    <div className="py-6">
      <Toaster duration={4000} position="top-right" />   
      {/* Header with Back Button */}
      <div className="flex items-center mb-8">
        {/* <Link
          href="/dashboard/users"
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Link> */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Team Member</h1>
          <p className="text-gray-600 mt-2">Invite new members to your workspace</p>
        </div>
      </div>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="bg-green-100 rounded-full p-4 w-fit mx-auto mb-4">
            <FiCheck className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation Sent!</h2>
          <p className="text-gray-600 mb-6">
            An invitation has been sent to <span className="font-semibold">{formData.email}</span>
          </p>
          <div className="flex space-x-3 justify-center">
            <Link
              disabled
              href="#"
              className="cursor-not-allowed px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
            >
              Back to Team
            </Link>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-amber-300 hover:text-amber-600 transition-all duration-200"
            >
              Add Another
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm mb-8">
              <div className="px-6 py-4 border-b border-amber-100">
                <h2 className="text-lg font-semibold text-gray-900">Member Details</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                          placeholder="Enter full name"
                        />
                      </div>
                    </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                        placeholder="team.member@company.com"
                      />
                    </div>
                    <p className="text-red-500 text-sm mt-2">{emailError}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['viewer', 'editor'].map((role) => (
                        <div
                          key={role}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${formData.role === role
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-gray-300 hover:border-amber-300'
                            }`}
                          onClick={() => setFormData(prev => ({ ...prev, role }))}
                        >
                          <div className="flex items-center mb-2">
                            <div className={`h-3 w-3 rounded-full mr-2 ${formData.role === role ? 'bg-amber-500' : 'bg-gray-300'
                              }`}></div>
                            <span className="font-medium text-gray-900 capitalize">{role}</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {/* {role === 'admin' && 'Full system access'} */}
                            {role === 'editor' && 'Create & edit processes'}
                            {role === 'viewer' && 'Read-only access'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Invitation Message (Optional)
                    </label>
                    <textarea
                      name="customMessage"
                      value={formData.customMessage}
                      onChange={handleInputChange}
                      rows="3"
                      className="block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      placeholder="Add a personal message to the invitation email..."
                    />
                  </div>

                  {/* <div className="flex items-center">
                      <input
                        id="sendInvitation"
                        name="sendInvitation"
                        type="checkbox"
                        checked={formData.sendInvitation}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sendInvitation" className="ml-2 block text-sm text-gray-700">
                        Send email invitation immediately
                      </label>
                    </div> */}
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            {formData.role === 'editor' &&
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm mb-8">
                <div className="px-6 py-4 border-b border-amber-100">
                  <h2 className="text-lg font-semibold text-gray-900">Permissions</h2>
                  <p className="text-sm text-gray-600 mt-1">Customize user permissions</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formData.permissions).map(([key, value]) => (
                      <div
                        key={key}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${value ? 'border-amber-500 bg-amber-50' : 'border-gray-300'
                          }`}
                        onClick={() => handlePermissionChange(key)}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${value ? 'border-amber-500 bg-amber-500' : 'border-gray-400'
                          }`}>
                          {value && <FiCheck className="h-3 w-3 text-white" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {key === 'createProcesses' && 'Create new workflow processes'}
                            {key === 'editProcesses' && 'Modify existing processes'}
                            {key === 'deleteProcesses' && 'Delete processes and data'}
                            {key === 'manageUsers' && 'Add/remove team members'}
                            {key === 'viewAnalytics' && 'View workspace analytics'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-red-500 text-sm mt-2">{permissionError}</div>
              </div>}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                // type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-amber-500/25 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2 h-5 w-5" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Role Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm sticky top-24">
              <div className="px-6 py-4 border-b border-amber-100">
                <h2 className="text-lg font-semibold text-gray-900">Role Information</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 capitalize">{formData.role} Role</h3>
                    <p className="text-sm text-gray-600">
                      {rolePermissions[formData.role].description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Includes Permissions:</h4>
                    <ul className="space-y-2">
                      {rolePermissions[formData.role]?.permissions.map((permission, index) => (
                        permission && (
                          <li key={index} className="flex items-center text-sm">
                            <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-gray-600">{permission}</span>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
                    <div className="flex items-start">
                      <FiHelpCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Invitation Process</p>
                        <ul className="text-xs text-gray-600 mt-2 space-y-1">
                          <li>• User receives email invitation</li>
                          <li>• They create their account</li>
                          <li>• Automatically added to your workspace</li>
                          <li>• Can access based on assigned role</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <div className="flex items-start">
                      <FiShield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Security Note</p>
                        <p className="text-xs text-gray-600 mt-2">
                          Each user gets their own secure login. You can modify permissions or remove access at any time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-2xl border border-amber-100 shadow-sm">
              <div className="px-6 py-4 border-b border-amber-100">
                <h2 className="text-lg font-semibold text-gray-900">Workspace Stats</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Members</span>
                    <span className="font-semibold text-gray-900">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Available Seats</span>
                    <span className="font-semibold text-gray-900">12 / 20</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Invitations</span>
                    <span className="font-semibold text-gray-900">2</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href="/dashboard/users"
                      className="block text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      View All Members
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}