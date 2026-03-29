"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiLayers, 
  FiPlus, 
  FiFilter, 
  FiSearch, 
  FiClock,
  FiUsers,
  FiEdit2,
  FiEye,
  FiTrendingUp,
  FiBarChart2,
  FiChevronRight,
  FiGrid,
  FiList,
  FiMap,
  FiDownload,
  FiCopy,
  FiSettings,
  FiTag,
  FiDollarSign,
  FiZap,
  FiAlertCircle
} from "react-icons/fi";

export default function ProcessesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showTimeframe, setShowTimeframe] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProcesses([
        { 
          id: 1, 
          name: "Employee Onboarding", 
          description: "Complete onboarding process for new hires including orientation, training, and system access",
          steps: 8,
          activities: [
            { id: 1, name: "Initial HR Review", type: "activity", assignee: "HR Manager", timeEstimate: "2 hours", cost: 50, tags: ["HR"], automation: false },
            { id: 2, name: "IT Account Setup", type: "activity", assignee: "IT Team", timeEstimate: "4 hours", cost: 100, tags: ["IT"], automation: true },
            { id: 3, name: "Manager Introduction", type: "activity", assignee: "Team Lead", timeEstimate: "1 hour", cost: 30, tags: ["HR"], automation: false },
            { id: 4, name: "Training Assignment", type: "decision", assignee: "HR Manager", timeEstimate: "30 min", cost: 20, tags: ["Training"], automation: false },
            { id: 5, name: "Equipment Setup", type: "activity", assignee: "Facilities", timeEstimate: "2 hours", cost: 150, tags: ["IT"], automation: false }
          ],
          assignedTo: "HR Team",
          status: "active",
          lastUpdated: "2 hours ago",
          completion: 85,
          color: "bg-blue-500",
          processExpert: "Sarah Johnson",
          processOwner: "Michael Chen",
          objective: "Reduce time-to-productivity by 40%",
          nextReviewDate: "2024-06-15",
          background: "Current onboarding takes 2 weeks",
          searchKeywords: "onboarding, hiring, new employee",
          leanTags: ["Value Stream", "Standard Work"],
          cycleCost: 490,
          annualVolume: 120,
          totalAnnualCost: 58800,
          systems: ["HRIS", "Active Directory"]
        },
        { 
          id: 2, 
          name: "Content Approval", 
          description: "Marketing content review and approval workflow for blog posts and social media",
          steps: 6,
          activities: [
            { id: 1, name: "Content Creation", type: "activity", assignee: "Copywriter", timeEstimate: "4 hours", cost: 200, tags: ["Marketing"], automation: false },
            { id: 2, name: "Initial Review", type: "activity", assignee: "Editor", timeEstimate: "1 hour", cost: 75, tags: ["Review"], automation: false },
            { id: 3, name: "Legal Check", type: "decision", assignee: "Legal Team", timeEstimate: "30 min", cost: 100, tags: ["Legal"], automation: false }
          ],
          assignedTo: "Marketing Dept",
          status: "active",
          lastUpdated: "1 day ago",
          completion: 60,
          color: "bg-green-500",
          processExpert: "Emma Watson",
          processOwner: "David Miller",
          objective: "Reduce approval time from 3 days to 24 hours",
          nextReviewDate: "2024-05-20",
          background: "Current bottlenecks cause delays",
          searchKeywords: "content, marketing, approval",
          leanTags: ["Lead Time Reduction"],
          cycleCost: 635,
          annualVolume: 240,
          totalAnnualCost: 152400,
          systems: ["WordPress", "Asana"]
        },
        { 
          id: 3, 
          name: "Expense Approval", 
          description: "Employee expense submission and approval workflow",
          steps: 5,
          activities: [
            { id: 1, name: "Submit Expense", type: "activity", assignee: "Employee", timeEstimate: "15 min", cost: 25, tags: ["Finance"], automation: false },
            { id: 2, name: "Auto Validation", type: "parallel", assignee: "System", timeEstimate: "5 min", cost: 0, tags: ["Automated"], automation: true },
            { id: 3, name: "Manager Review", type: "activity", assignee: "Manager", timeEstimate: "10 min", cost: 40, tags: ["Approval"], automation: false }
          ],
          assignedTo: "Finance Team",
          status: "draft",
          lastUpdated: "3 days ago",
          completion: 30,
          color: "bg-purple-500",
          processExpert: "Lisa Wong",
          processOwner: "Robert Taylor",
          objective: "Automate expense processing",
          nextReviewDate: "2024-04-10",
          background: "Manual processing causes delays",
          searchKeywords: "expense, reimbursement",
          leanTags: ["Automation"],
          cycleCost: 140,
          annualVolume: 500,
          totalAnnualCost: 70000,
          systems: ["Expensify", "QuickBooks"]
        },
        { 
          id: 4, 
          name: "IT Support Ticket", 
          description: "IT issue reporting and resolution process",
          steps: 7,
          activities: [
            { id: 1, name: "Submit Ticket", type: "activity", assignee: "Employee", timeEstimate: "5 min", cost: 10, tags: ["IT"], automation: false },
            { id: 2, name: "Auto Categorization", type: "parallel", assignee: "AI System", timeEstimate: "2 min", cost: 0, tags: ["AI"], automation: true },
            { id: 3, name: "L1 Support", type: "activity", assignee: "IT Support", timeEstimate: "30 min", cost: 45, tags: ["Support"], automation: false }
          ],
          assignedTo: "IT Department",
          status: "active",
          lastUpdated: "5 hours ago",
          completion: 45,
          color: "bg-amber-500",
          processExpert: "James Wilson",
          processOwner: "Patricia Brown",
          objective: "Resolve 90% of tickets within SLA",
          nextReviewDate: "2024-05-01",
          background: "Current SLA compliance at 65%",
          searchKeywords: "IT, support, ticket",
          leanTags: ["SLA", "Automation"],
          cycleCost: 385,
          annualVolume: 1500,
          totalAnnualCost: 577500,
          systems: ["Jira", "Slack"]
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProcesses = processes.filter(process => {
    if (filter === "all") return true;
    return process.status === filter;
  }).filter(process => 
    process.name.toLowerCase().includes(search.toLowerCase()) ||
    process.description.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading processes...</p>
        </div>
      </div>
    );
  }

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
            className="inline-flex items-center px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-lg shadow-amber-500/25"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Create New Process
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Processes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{processes.length}</p>
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
              <p className="text-3xl font-bold text-gray-900 mt-2">{processes.filter(p => p.status === 'active').length}</p>
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
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {Math.round(processes.reduce((acc, p) => acc + p.completion, 0) / processes.length)}%
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <FiBarChart2 className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Steps</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {processes.reduce((acc, p) => acc + p.steps, 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search processes..."
                className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FiFilter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${viewMode === "grid" ? "bg-amber-100 text-amber-600" : "text-gray-400"}`}
              >
                <FiGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${viewMode === "list" ? "bg-amber-100 text-amber-600" : "text-gray-400"}`}
              >
                <FiList className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-2 rounded-md ${viewMode === "map" ? "bg-amber-100 text-amber-600" : "text-gray-400"}`}
              >
                <FiMap className="h-4 w-4" />
              </button>
            </div>

            {viewMode === "map" && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowTimeframe(!showTimeframe)}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-1 ${showTimeframe ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"}`}
                >
                  <FiClock className="h-4 w-4" />
                  <span>Timeframe</span>
                </button>
                <button
                  onClick={() => setShowTags(!showTags)}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-1 ${showTags ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"}`}
                >
                  <FiTag className="h-4 w-4" />
                  <span>Tags</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcesses.map((process) => (
            <div key={process.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
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
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{process.description}</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiClock className="h-4 w-4 mr-2" />
                    <span>Updated: {process.lastUpdated}</span>
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
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-gray-900">{process.completion}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${process.completion >= 80 ? 'bg-green-500' : process.completion >= 50 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${process.completion}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Link href={`/processes/${process.id}`} className="p-2 text-gray-400 hover:text-amber-600">
                      <FiEye className="h-5 w-5" />
                    </Link>
                    <Link href={`/processes/${process.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600">
                      <FiEdit2 className="h-5 w-5" />
                    </Link>
                  </div>
                  <Link href={`/processes/${process.id}`} className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700 font-medium">
                    View Details
                    <FiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Process</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Steps</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProcesses.map((process) => (
                  <tr key={process.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`${process.color} h-10 w-10 rounded-lg flex items-center justify-center mr-3`}>
                          <FiLayers className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{process.name}</p>
                          <p className="text-sm text-gray-500">{process.description.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(process.status)}`}>
                        {process.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{process.steps} steps</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{process.assignedTo}</td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{process.completion}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${process.completion >= 80 ? 'bg-green-500' : process.completion >= 50 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${process.completion}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link href={`/processes/${process.id}`} className="p-2 text-gray-400 hover:text-amber-600">
                          <FiEye className="h-5 w-5" />
                        </Link>
                        <Link href={`/processes/${process.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600">
                          <FiEdit2 className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Map View */}
      {viewMode === "map" && (
        <div className="space-y-8">
          {filteredProcesses.map((process) => (
            <div key={process.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`${process.color} h-10 w-10 rounded-lg flex items-center justify-center mr-3`}>
                    <FiLayers className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{process.name}</h3>
                    <p className="text-sm text-gray-500">Process Map View</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-amber-600">
                    <FiDownload className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-amber-600">
                    <FiCopy className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-amber-600">
                    <FiSettings className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="relative overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-100 rounded-lg p-3 text-center font-medium text-gray-700 text-sm">HR Team</div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center font-medium text-gray-700 text-sm">IT Team</div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center font-medium text-gray-700 text-sm">Management</div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center font-medium text-gray-700 text-sm">Automated</div>
                    </div>

                    <div className="space-y-4">
                      {process.activities.map((activity, idx) => (
                        <div key={activity.id}>
                          <div className="grid grid-cols-4 gap-4">
                            <div className={`${
                              activity.assignee.includes('HR') ? 'col-span-1' : 
                              activity.assignee.includes('IT') ? 'col-start-2' : 
                              activity.assignee.includes('Manager') || activity.assignee.includes('Lead') ? 'col-start-3' : 
                              activity.automation ? 'col-start-4' : 'col-span-1'
                            }`}>
                              <div className={`rounded-lg border-2 p-4 cursor-pointer hover:shadow-lg transition-all ${
                                activity.type === 'decision' ? 'border-amber-400 bg-amber-50' :
                                activity.type === 'parallel' ? 'border-green-400 bg-green-50' :
                                'border-gray-200 bg-white'
                              }`}>
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-gray-900">{activity.name}</h4>
                                  {activity.type === 'decision' && <FiAlertCircle className="h-5 w-5 text-amber-500" />}
                                  {activity.type === 'parallel' && <FiZap className="h-5 w-5 text-green-500" />}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">Assigned to: {activity.assignee}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <FiClock className="h-3 w-3 mr-1" />
                                    {activity.timeEstimate}
                                  </span>
                                  {showTimeframe && (
                                    <span className="flex items-center">
                                      <FiDollarSign className="h-3 w-3 mr-1" />
                                      ${activity.cost}
                                    </span>
                                  )}
                                  {showTags && (
                                    <span className="flex items-center">
                                      <FiTag className="h-3 w-3 mr-1" />
                                      {activity.tags[0]}
                                    </span>
                                  )}
                                </div>
                                {activity.automation && (
                                  <div className="mt-2 pt-2 border-t border-gray-100">
                                    <span className="text-xs text-blue-600 flex items-center">
                                      <FiZap className="h-3 w-3 mr-1" />
                                      AI Automated
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {idx < process.activities.length - 1 && (
                            <div className="flex justify-center my-2">
                              <div className="w-0.5 h-6 bg-gray-300"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProcesses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="bg-amber-50 rounded-full p-6 w-fit mx-auto mb-4">
            <FiLayers className="h-12 w-12 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No processes found</h3>
          <p className="text-gray-600 mb-6">Create your first process to get started</p>
          <Link href="/processes/new" className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
            <FiPlus className="mr-2 h-5 w-5" />
            Create New Process
          </Link>
        </div>
      )}
    </div>
  );
}

// Helper component for missing icon
function FiCheckCircle(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}