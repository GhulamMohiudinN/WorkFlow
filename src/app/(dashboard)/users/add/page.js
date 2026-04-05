"use client";
import { useState } from "react";
import Link from "next/link";

import {
  FiMail,
  FiShield,
  FiCheck,
  FiSend,
  FiHelpCircle,
  FiUser
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import adminAPI from "../../../api/admin"; 

export default function AddUserPage() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "editor",
    price: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setIsSubmitting(true);

    // Validate name
    if (!formData.name.trim()) {
      toast.error("Please enter the member's name");
      setIsSubmitting(false);
      return;
    }

    // Email validation
    if (!formData.email || !emailRegex.test(formData.email)) {
      setEmailError("Invalid email address");
      setIsSubmitting(false);
      return;
    }

    // Validate price
    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error("Please enter a valid rate");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Sending invitation with data:", {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        rate: parseFloat(formData.price)
      });

      const response = await adminAPI.inviteTeamMember({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        rate: parseFloat(formData.price)
      });

      console.log("Invitation response:", response);

      toast.success("Invitation sent successfully!");
      setSuccess(true);
      
      setFormData({
        name: "",
        email: "",
        role: "editor",
        price: "",
      });
      
    } catch (error) {
      console.error("Error sending invitation:", error);
      console.error("Error details:", error.response?.data || error.message);
      
      // Show error message from API if available
      const errorMessage = error.response?.data?.message || "Failed to send invitation. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rolePermissions = {
    editor: {
      description: "Can create and edit processes",
      permissions: ["Create processes", "Edit processes", "View analytics"],
    },
    admin: {
      description: "Full system access except billing and member deletion",
      permissions: ["Create processes", "Edit processes", "Delete processes", "Manage users", "View analytics"],
    },
    viewer: {
      description: "Read-only access to view processes and analytics",
      permissions: ["View processes", "View analytics"],
    },
  };

  return (
    <div className="py-6">
      <Toaster duration={4000} position="top-right" />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Team Member</h1>
        <p className="text-gray-600 mt-2">
          Invite new members to your workspace
        </p>
      </div>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="bg-green-100 rounded-full p-4 w-fit mx-auto mb-4">
            <FiCheck className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invitation Sent!
          </h2>
          <p className="text-gray-600 mb-6">
            An invitation has been sent to{" "}
            <span className="font-semibold">{formData.email}</span>
          </p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  name: "",
                  email: "",
                  role: "editor",
                  price: "",
                });
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-amber-300 hover:text-amber-600 transition-all duration-200"
            >
              Add Another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm mb-8">
                <div className="px-6 py-4 border-b border-amber-100">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Member Details
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
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
                          disabled={isSubmitting}
                          className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="Enter full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
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
                          required
                          disabled={isSubmitting}
                          className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="team.member@company.com"
                        />
                      </div>
                      {emailError && (
                        <p className="text-red-500 text-sm mt-2">{emailError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate ($/hr) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                          step="0.01"
                          min="0"
                          className="block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {["admin", "viewer", "editor"].map((role) => (
                          <div
                            key={role}
                            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              formData.role === role
                                ? "border-amber-500 bg-amber-50"
                                : "border-gray-300 hover:border-amber-300"
                            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => !isSubmitting && setFormData((prev) => ({ ...prev, role }))}
                          >
                            <div className="flex items-center mb-2">
                              <div
                                className={`h-3 w-3 rounded-full mr-2 ${
                                  formData.role === role
                                    ? "bg-amber-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                              <span className="font-medium text-gray-900 capitalize">
                                {role}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {role === "admin" &&
                                "Full system access except billing and member deletion"}
                              {role === "editor" && "Create & edit processes"}
                              {role === "viewer" && "Read-only access"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    Role Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 capitalize">
                        {formData.role} Role
                      </h3>
                      <p className="text-sm text-gray-600">
                        {rolePermissions[formData.role].description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Includes Permissions:
                      </h4>
                      <ul className="space-y-2">
                        {rolePermissions[formData.role].permissions.map(
                          (permission, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-gray-600">{permission}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
                      <div className="flex items-start">
                        <FiHelpCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Invitation Process
                          </p>
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
                          <p className="text-sm font-medium text-gray-900">
                            Security Note
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            Each user gets their own secure login. You can modify
                            permissions or remove access at any time.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
