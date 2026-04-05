"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiLayers, 
  FiSearch, 
  FiClock, 
  FiUsers, 
  FiEye,
  FiChevronRight,
  FiFilter
} from "react-icons/fi";

export default function UserProcessesPage() {
  const [processes, setProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setProcesses([
        { 
          id: 1, 
          name: "Employee Onboarding", 
          description: "Complete onboarding process for new hires",
          status: "active",
          assignedTo: "HR Team",
          lastUpdated: "2 hours ago",
          progress: 60,
          color: "bg-blue-500"
        },
        { 
          id: 2, 
          name: "Expense Approval", 
          description: "Employee expense submission and approval",
          status: "active",
          assignedTo: "Finance Team",
          lastUpdated: "1 day ago",
          progress: 30,
          color: "bg-purple-500"
        },
        { 
          id: 3, 
          name: "IT Support Ticket", 
          description: "IT issue reporting and resolution",
          status: "active",
          assignedTo: "IT Department",
          lastUpdated: "5 hours ago",
          progress: 45,
          color: "bg-amber-500"
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredProcesses = processes.filter(process =>
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
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Processes</h1>
        <p className="text-gray-600 mt-2">View workflows you have access to</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm mb-8">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search processes..."
            className="pl-10 w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Note: No Create Process button for regular users */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center gap-3">
        <FiEye className="h-5 w-5 text-blue-600" />
        <p className="text-sm text-blue-800">
          You have view-only access. To create or edit processes, please contact your workspace admin.
        </p>
      </div>

      {/* Processes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProcesses.map((process) => (
          <div key={process.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${process.color} h-12 w-12 rounded-lg flex items-center justify-center`}>
                  <FiLayers className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800">
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
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{process.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${process.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <Link
                href={`/processesUsers/${process.id}`}
                className="flex items-center justify-between pt-4 border-t border-gray-100 text-amber-600 hover:text-amber-700 font-medium"
              >
                <span>View Details</span>
                <FiChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredProcesses.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-amber-50 rounded-full p-6 w-fit mx-auto mb-4">
            <FiLayers className="h-12 w-12 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No processes found</h3>
          <p className="text-gray-600">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}