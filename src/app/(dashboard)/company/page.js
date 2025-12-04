"use client";
import { useState } from "react";
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
  FiTrendingUp
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

export default function CompanyPage() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Dummy company data
  const [company, setCompany] = useState({
    name: "TechFlow Inc",
    email: "contact@techflow.com",
    website: "https://techflow.com",
    industry: "Technology & Software",
    foundedYear: "2018",
    location: "San Francisco, CA",
    description: "Leading provider of workflow automation solutions for modern enterprises.",
    teamSize: "50-100",
    subscription: "Enterprise Plan",
    status: "Active"
  });

  const handleSave = () => {
    setIsEditing(false);
    // In real app, you would save to backend here
    console.log("Saved company data:", company);
  };

  const handleInputChange = (field, value) => {
    setCompany(prev => ({ ...prev, [field]: value }));
  };

  const stats = [
    { label: "Total Members", value: "8", icon: FiUsers, color: "bg-blue-100 text-blue-600" },
    { label: "Active Processes", value: "12", icon: FiTrendingUp, color: "bg-green-100 text-green-600" },
    { label: "Storage Used", value: "1.2GB", icon: FiDatabase, color: "bg-purple-100 text-purple-600" },
    { label: "Days Active", value: "45", icon: FiCalendar, color: "bg-amber-100 text-amber-600" },
  ];

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-2">Manage your company information and settings</p>
        </div>
        <div className="mt-4 md:mt-0">
          {isEditing ? (
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
              >
                <FiSave className="mr-2 h-5 w-5" />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-all duration-200"
              >
                <FiX className="mr-2 h-5 w-5" />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
            >
              <FiEdit2 className="mr-2 h-5 w-5" />
              Edit Company Info
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Info Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm">
            <div className="px-6 py-4 border-b border-amber-100">
              <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={company.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FaBuilding className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{company.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={company.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FiGlobe className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{company.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={company.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FiGlobe className="h-5 w-5 text-gray-400 mr-3" />
                        <a href={company.website} className="text-amber-600 hover:text-amber-700">
                          {company.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={company.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{company.industry}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Founded Year
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={company.foundedYear}
                        onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{company.foundedYear}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={company.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FiMapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{company.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={company.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{company.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Subscription Status */}
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm">
            <div className="px-6 py-4 border-b border-amber-100">
              <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Plan</span>
                  <span className="font-medium text-gray-900">{company.subscription}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {company.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Team Size</span>
                  <span className="font-medium text-gray-900">{company.teamSize}</span>
                </div>
                <button className="w-full mt-4 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm">
            <div className="px-6 py-4 border-b border-amber-100">
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <FiShield className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Enterprise Security</p>
                    <p className="text-sm text-gray-600">All data encrypted at rest</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FiDatabase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">MongoDB Backend</p>
                    <p className="text-sm text-gray-600">Secure database infrastructure</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FiUsers className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Role-Based Access</p>
                    <p className="text-sm text-gray-600">Fine-grained permissions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}