"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiLayers, 
  FiClock, 
  FiCheckCircle, 
  FiTrendingUp,
  FiArrowRight,
  FiEye,
  FiUsers
} from "react-icons/fi";

export default function UserDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    assignedProcesses: 0,
    completedTasks: 0,
    pendingTasks: 0,
    recentProcesses: []
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        assignedProcesses: 5,
        completedTasks: 12,
        pendingTasks: 3,
        recentProcesses: [
          { id: 1, name: "Employee Onboarding", status: "in-progress", lastUpdated: "2 hours ago", progress: 60 },
          { id: 2, name: "Expense Approval", status: "pending", lastUpdated: "1 day ago", progress: 30 },
          { id: 3, name: "IT Support Ticket", status: "completed", lastUpdated: "3 days ago", progress: 100 },
          { id: 4, name: "Content Approval", status: "in-progress", lastUpdated: "Yesterday", progress: 45 }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-600 mt-2">Here`s an overview of your assigned workflows</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiLayers className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.assignedProcesses}</span>
          </div>
          <p className="text-gray-600">Assigned Processes</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.completedTasks}</span>
          </div>
          <p className="text-gray-600">Completed Tasks</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</span>
          </div>
          <p className="text-gray-600">Pending Tasks</p>
        </div>
      </div>

      {/* Recent Processes */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-100">
          <h2 className="text-lg font-semibold text-gray-900">My Recent Processes</h2>
          <p className="text-sm text-gray-500 mt-1">Processes you`re assigned to or have worked on</p>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentProcesses.map((process) => (
            <div key={process.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{process.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(process.status)}`}>
                      {process.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Last updated: {process.lastUpdated}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{process.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          process.progress === 100 ? 'bg-green-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${process.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link
                    href={`/processesUsers/${process.id}`}
                    className="inline-flex items-center text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    View Details
                    <FiArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Link
            href="/processesUsers"
            className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center"
          >
            View all processes
            <FiArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Quick Tip */}
      <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <FiTrendingUp className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Need Help?</h3>
            <p className="text-gray-600 text-sm mt-1">
              Click on any process to view details and complete your assigned tasks. 
              If you need assistance, contact your workspace admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}