"use client";
import Link from "next/link";
import {socket} from "../../utils/socket";
import { 
  FiUsers, 
  FiLayers, 
  FiTrendingUp, 
  FiClock, 
  FiUserPlus, 
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
  FiChevronRight,
  FiBarChart2,
  FiCalendar,
  FiEye,
  FiEdit,
  FiSettings
} from "react-icons/fi";
import { useUserStore, useWorkspaceStore } from "../../store";
import { useMemo } from "react";

export default function DashboardPage() {
  const {user} = useUserStore();
  const {workspace, role} = useWorkspaceStore();
  console.log(workspace)
  const company = {
    name: "TechFlow Inc",
    email: "contact@techflow.com",
    members: 8,
    processes: 12
  };
 
  
  const users = [
    { id: 1, name: "John Doe", email: "john@techflow.com", role: "admin", status: "active" },
    { id: 2, name: "Sarah Chen", email: "sarah@techflow.com", role: "editor", status: "active" },
    { id: 3, name: "Mike Wilson", email: "mike@techflow.com", role: "viewer", status: "active" },
    { id: 4, name: "Emma Davis", email: "emma@techflow.com", role: "editor", status: "active" },
    { id: 5, name: "Alex Kim", email: "alex@techflow.com", role: "viewer", status: "inactive" },
  ];

  const stats = {
    totalUsers: 8,
    activeProcesses: 12,
    completedTasks: 48,
    pendingTasks: 5
  };

  const activities = [
    { id: 1, type: "company_created", message: "Workspace created for TechFlow Inc", time: "Today, 9:42 AM" },
    { id: 2, type: "user_added", message: "Sarah Chen added as Editor", time: "Today, 10:15 AM" },
    { id: 3, type: "process_created", message: "New onboarding process created", time: "Today, 11:30 AM" },
    { id: 4, type: "task_completed", message: "Employee handbook review completed", time: "Yesterday, 3:45 PM" },
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-6">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to {company.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your team, create processes, and optimize workflows
            </p>
          </div>
         {role !== 'viewer'&& 
         <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              href="/users/add"
              className="inline-flex items-center px-4 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-amber-500/25"
            >
              <FiUserPlus className="mr-2 h-5 w-5" />
              Add Team Member
            </Link>
            <Link
              href="#"
              className="cursor-not-allowed inline-flex items-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-amber-300 hover:text-amber-600 transition-all duration-200"
            >
              <FiPlus className="mr-2 h-5 w-5" />
              New Process
            </Link>
          </div> }
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{workspace?.members.length}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <FiUsers className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="#" className="cursor-not-allowed inline-flex items-center text-sm text-amber-600 hover:text-amber-700">
              View all members
              <FiChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Processes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeProcesses}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiLayers className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="#" className="cursor-not-allowed inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
              View processes
              <FiChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingTasks}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-yellow-600">
              <FiAlertCircle className="h-4 w-4 mr-1" />
              <span>Awaiting action</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedTasks}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <FiTrendingUp className="h-4 w-4 mr-1" />
              <span>+15% from last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm">
            <div className="px-6 py-4 border-b border-amber-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Link href="#" className="cursor-not-allowed text-sm text-amber-600 hover:text-amber-700 font-medium">
                View all
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'company_created' ? 'bg-amber-100' :
                      activity.type === 'user_added' ? 'bg-blue-100' :
                      activity.type === 'process_created' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      {activity.type === 'company_created' && <FiActivity className="h-5 w-5 text-amber-600" />}
                      {activity.type === 'user_added' && <FiUserPlus className="h-5 w-5 text-blue-600" />}
                      {activity.type === 'process_created' && <FiLayers className="h-5 w-5 text-purple-600" />}
                      {activity.type === 'task_completed' && <FiCheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Overview */}
        <div>
         {workspace?.members?.length > 0 &&
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm">
            <div className="px-6 py-4 border-b border-amber-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Team Overview</h2>
              <Link href="#" className="cursor-not-allowed text-sm text-amber-600 hover:text-amber-700 font-medium">
                View all
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                 {workspace.members.map((memberDetail) => {
          if (memberDetail?.memberId?._id === user?._id) return null;

          return (
            <div
              key={memberDetail?.memberId?._id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {memberDetail?.memberId?.name?.charAt(0)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {memberDetail.memberId?.name}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getRoleColor(
                      memberDetail.role
                    )}`}
                  >
                    {memberDetail.role}
                  </span>
                </div>
              </div>

              <FiChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          );
        })}
                <Link
                  href="/users/add"
                  className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-amber-600 hover:border-amber-300 transition-all duration-200"
                >
                  <FiPlus className="mr-2 h-5 w-5" />
                  Add more members
                </Link>
              </div>
            </div>
          </div>
}
          {/* Quick Actions */}
          <div className="mt-6 bg-linear-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/users/add" className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200">
                <div className="flex items-center">
                  <FiUserPlus className="mr-3 h-5 w-5" />
                  <span>Invite team member</span>
                </div>
                <FiChevronRight className="h-5 w-5" />
              </Link>
              <Link href="#" className="cursor-not-allowed flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200">
                <div className="flex items-center">
                  <FiLayers className="mr-3 h-5 w-5" />
                  <span>Create process</span>
                </div>
                <FiChevronRight className="h-5 w-5" />
              </Link>
              <Link href="#" className="cursor-not-allowed flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200">
                <div className="flex items-center">
                  <FiSettings className="mr-3 h-5 w-5" />
                  <span>Company settings</span>
                </div>
                <FiChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}