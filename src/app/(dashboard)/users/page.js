"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  FiUsers, 
  FiUserPlus, 
  FiSearch, 
  FiFilter,
  FiMail,
  FiUser,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiChevronRight,
  FiShield,
  FiEye
} from "react-icons/fi";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Dummy users data
  const users = [
    { 
      id: 1, 
      name: "John Doe", 
      email: "john@techflow.com", 
      role: "admin", 
      status: "active",
      lastActive: "2 minutes ago",
      joinDate: "Jan 15, 2024",
      avatarColor: "bg-red-500"
    },
    { 
      id: 2, 
      name: "Sarah Chen", 
      email: "sarah@techflow.com", 
      role: "editor", 
      status: "active",
      lastActive: "1 hour ago",
      joinDate: "Feb 3, 2024",
      avatarColor: "bg-blue-500"
    },
    { 
      id: 3, 
      name: "Mike Wilson", 
      email: "mike@techflow.com", 
      role: "viewer", 
      status: "active",
      lastActive: "5 hours ago",
      joinDate: "Feb 10, 2024",
      avatarColor: "bg-green-500"
    },
    { 
      id: 4, 
      name: "Emma Davis", 
      email: "emma@techflow.com", 
      role: "editor", 
      status: "active",
      lastActive: "Yesterday",
      joinDate: "Feb 18, 2024",
      avatarColor: "bg-purple-500"
    },
    { 
      id: 5, 
      name: "Alex Kim", 
      email: "alex@techflow.com", 
      role: "viewer", 
      status: "inactive",
      lastActive: "1 week ago",
      joinDate: "Mar 1, 2024",
      avatarColor: "bg-amber-500"
    },
    { 
      id: 6, 
      name: "Priya Sharma", 
      email: "priya@techflow.com", 
      role: "editor", 
      status: "active",
      lastActive: "3 hours ago",
      joinDate: "Mar 5, 2024",
      avatarColor: "bg-pink-500"
    },
    { 
      id: 7, 
      name: "David Lee", 
      email: "david@techflow.com", 
      role: "admin", 
      status: "active",
      lastActive: "Just now",
      joinDate: "Mar 8, 2024",
      avatarColor: "bg-indigo-500"
    },
    { 
      id: 8, 
      name: "Maria Garcia", 
      email: "maria@techflow.com", 
      role: "viewer", 
      status: "pending",
      lastActive: "Never",
      joinDate: "Mar 12, 2024",
      avatarColor: "bg-teal-500"
    },
  ];

  const filteredUsers = users.filter(user => {
    if (filterRole !== "all" && user.role !== filterRole) return false;
    if (search && !user.name.toLowerCase().includes(search.toLowerCase()) && 
        !user.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleStats = () => {
    const stats = { admin: 0, editor: 0, viewer: 0, total: users.length };
    users.forEach(user => stats[user.role]++);
    return stats;
  };

  const roleStats = getRoleStats();

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-2">Manage your team members and their permissions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href="/users/add"
            className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-amber-500/25"
          >
            <FiUserPlus className="mr-2 h-5 w-5" />
            Add Team Member
          </Link>
        </div>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{roleStats.total}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <FiUsers className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{roleStats.admin}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FiShield className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Editors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{roleStats.editor}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiEdit2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Viewers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{roleStats.viewer}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiEye className="h-6 w-6 text-green-600" />
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
                placeholder="Search team members..."
                className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FiFilter className="h-5 w-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-100">
          <h2 className="text-lg font-semibold text-gray-900">All Team Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full ${user.avatarColor} flex items-center justify-center mr-3`}>
                        <span className="text-white font-semibold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiMail className="h-4 w-4 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-3 py-1 rounded-full ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <FiMoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-amber-50 rounded-full p-6 w-fit mx-auto mb-4">
              <FiUsers className="h-12 w-12 text-amber-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-600 mb-6">
              {search ? "Try a different search term" : "Add your first team member to get started"}
            </p>
            <Link
              href="/users/add"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
            >
              <FiUserPlus className="mr-2 h-5 w-5" />
              Add Team Member
            </Link>
          </div>
        )}
      </div>

      {/* Role Descriptions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <FiShield className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Admin</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Full system access
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Manage users and roles
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Company settings
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Create and edit all processes
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <FiEdit2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Editor</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Create and edit processes
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Manage assigned tasks
            </li>
            <li className="flex items-center">
              <FiXCircle className="h-4 w-4 text-red-500 mr-2" />
              Cannot manage users
            </li>
            <li className="flex items-center">
              <FiXCircle className="h-4 w-4 text-red-500 mr-2" />
              Cannot change settings
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <FiEye className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Viewer</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              View all processes
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Read-only access
            </li>
            <li className="flex items-center">
              <FiXCircle className="h-4 w-4 text-red-500 mr-2" />
              Cannot edit anything
            </li>
            <li className="flex items-center">
              <FiXCircle className="h-4 w-4 text-red-500 mr-2" />
              Cannot create content
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}