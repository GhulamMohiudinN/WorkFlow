"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  FiLayers, 
  FiPlus, 
  FiFilter, 
  FiSearch, 
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiUsers,
  FiEdit2,
  FiEye,
  FiTrash2,
  FiTrendingUp,
  FiBarChart2,
  FiChevronRight
} from "react-icons/fi";

export default function ProcessesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Dummy processes data
  const processes = [
    { 
      id: 1, 
      name: "Employee Onboarding", 
      description: "Complete onboarding process for new hires",
      steps: 8,
      assignedTo: "HR Team",
      status: "active",
      lastUpdated: "2 hours ago",
      completion: 85,
      color: "bg-blue-500"
    },
    { 
      id: 2, 
      name: "Content Approval", 
      description: "Marketing content review and approval workflow",
      steps: 6,
      assignedTo: "Marketing Dept",
      status: "active",
      lastUpdated: "1 day ago",
      completion: 60,
      color: "bg-green-500"
    },
    { 
      id: 3, 
      name: "Expense Approval", 
      description: "Employee expense submission and approval",
      steps: 5,
      assignedTo: "Finance Team",
      status: "draft",
      lastUpdated: "3 days ago",
      completion: 30,
      color: "bg-purple-500"
    },
    { 
      id: 4, 
      name: "IT Support Ticket", 
      description: "IT issue reporting and resolution process",
      steps: 7,
      assignedTo: "IT Department",
      status: "active",
      lastUpdated: "5 hours ago",
      completion: 45,
      color: "bg-amber-500"
    },
    { 
      id: 5, 
      name: "Client Onboarding", 
      description: "New client account setup and integration",
      steps: 10,
      assignedTo: "Sales Team",
      status: "archived",
      lastUpdated: "1 week ago",
      completion: 100,
      color: "bg-red-500"
    },
    { 
      id: 6, 
      name: "Social Media Posting", 
      description: "Content creation and social media publishing",
      steps: 4,
      assignedTo: "Social Media Team",
      status: "active",
      lastUpdated: "Yesterday",
      completion: 75,
      color: "bg-pink-500"
    },
  ];

  const filteredProcesses = processes.filter(process => {
    if (filter === "all") return true;
    return process.status === filter;
  }).filter(process => 
    process.name.toLowerCase().includes(search.toLowerCase()) ||
    process.description.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Processes</h1>
          <p className="text-gray-600 mt-2">Create and manage your workflow processes</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href="/processes/new"
            className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-amber-500/25"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Create New Process
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Processes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiLayers className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Processes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiTrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Completion</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">68%</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <FiBarChart2 className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search processes..."
                className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FiFilter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
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

      {/* Processes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProcesses.map((process) => (
          <div key={process.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${process.color} h-12 w-12 rounded-lg flex items-center justify-center`}>
                  <FiLayers className="h-6 w-6 text-white" />
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(process.status)}`}>
                  {process.status}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{process.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{process.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <FiClock className="h-4 w-4 mr-2" />
                  <span>Last updated: {process.lastUpdated}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiUsers className="h-4 w-4 mr-2" />
                  <span>Assigned to: {process.assignedTo}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiLayers className="h-4 w-4 mr-2" />
                  <span>{process.steps} steps</span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium text-gray-900">{process.completion}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${process.completion >= 80 ? 'bg-green-500' : process.completion >= 50 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${process.completion}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-amber-600 transition-colors duration-200">
                    <FiEye className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                </div>
                <Link
                  href={`/processes/${process.id}`}
                  className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  View Details
                  <FiChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProcesses.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-amber-50 rounded-full p-6 w-fit mx-auto mb-4">
            <FiLayers className="h-12 w-12 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No processes found</h3>
          <p className="text-gray-600 mb-6">Create your first process to get started</p>
          <Link
            href="/processes/new"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Create New Process
          </Link>
        </div>
      )}
    </div>
  );
}