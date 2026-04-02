"use client";
import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { socket } from "../utils/socket";
import api from "../api/axios";

import {
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiLayers,
  FiSettings,
  FiLogOut,
  FiBriefcase,
  FiUser,
  FiBell,
  FiChevronDown,
  FiBarChart2,
  FiHelpCircle,
  FiGlobe,
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isBrowser = typeof window !== "undefined";
  const user = isBrowser ? JSON.parse(localStorage.getItem("user") || "null") : null;
  const role = isBrowser ? localStorage.getItem("role") : null;
  const workspace = isBrowser ? JSON.parse(localStorage.getItem("workspace") || "null") : null;

  useEffect(() => {
    if (!isBrowser) return;

    if (!user || !role || !workspace) {
      router.push("/login");
      return;
    }

    if (role !== "admin") {
      router.push("/users/dashboardUsers");
      return;
    }

    setLoading(false);
  }, [isBrowser, user, role, workspace, router]);

  // connected with socket.io
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      if (userId) {
        socket.emit("register", userId);
      }
    }
  }, []);

  // update workspaceIfMember is added in workspace
  useEffect(() => {
    // Removed socket listener since we removed store
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Since no profile API, load from localStorage
        const storedUser = localStorage.getItem("user");
        const storedRole = localStorage.getItem("role");
        const storedWorkspace = localStorage.getItem("workspace");

        if (storedUser && storedRole && storedWorkspace) {
          if (storedRole !== "admin") {
            // Members are not allowed in admin/dashboard area
            router.push("/users/dashboardUsers");
            return;
          }
          setUser(JSON.parse(storedUser));
          setRole(storedRole);
          setWorkspace(JSON.parse(storedWorkspace));
        } else {
          // If not found, redirect to login
          router.push("/login");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error loading user data:", err);
        router.push("/login");
        setLoading(false);
      }
    };

    if (isClient) {
      fetchUserData();
    }
  }, [isClient, router]);

  if (!isBrowser || loading) {
    return null; // Prevent SSR and show loading
  }

  if (!user || !workspace) {
    return null; // Or show error
  }

  const signout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("workspace");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setUser(null);
    setRole(null);
    setWorkspace(null);
    router.push("/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: FiHome,
      current: pathname.includes ("/dashboard"),
    },
    {
      name: "Company",
      href: "company",
      icon: FaBuilding,
      current: pathname.includes ("/company"),
    },
    {
      name: "Processes",
      href: "processes",
      icon: FiLayers,
      current: pathname.includes ("/processes"),
    },
    {
      name: "Users",
      href: "users",
      icon: FiUsers,
      current: pathname.includes ("/users"),
    },
    // { name: 'Analytics', href: '/dashboard/analytics', icon: FiBarChart2, current: pathname === '/dashboard/analytics' },
    {
      name: "Settings",
      href: "/settings",
      icon: FiSettings,
      current: pathname.includes ("/settings"),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white">
      {/* Mobile sidebar */}
      <div
        className={`lg:hidden ${sidebarOpen ? "fixed inset-0 z-50" : "hidden"}`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-br from-amber-500 to-amber-600 p-2 rounded-lg">
                <FiBriefcase className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-gray-900">WorkflowPro</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
                  item.current
                    ? "text-amber-600 bg-amber-50"
                    : "text-gray-700 hover:text-amber-600 hover:bg-amber-50"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${item.current ? "text-amber-500" : "text-gray-400"}`}
                />
                {item.name}
              </a>
            ))}
          </nav>
          <div className="p-4 border-t border-amber-100">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {workspace?.adminId?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {workspace?.companyEmail}
                </p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col grow bg-white border-r border-amber-100 shadow-sm">
          <div className="flex items-center h-16 px-4 border-b border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-br from-amber-500 to-amber-600 p-2 rounded-lg">
                <FiBriefcase className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-gray-900">WorkflowPro</span>
              <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                BETA
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
            <nav className="flex-1 px-4 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    item.current
                      ? "text-amber-600 bg-amber-50"
                      : "text-gray-700 hover:text-amber-600 hover:bg-amber-50"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-colors ${
                      item.current ? "text-amber-500" : "text-gray-400"
                    }`}
                  />
                  {item.name}
                </a>
              ))}
            </nav>
            <div className="mt-auto px-4">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center">
                  <FiHelpCircle className="h-5 w-5 text-amber-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Need help?
                    </p>
                    <a
                      href="#"
                      className="text-xs text-amber-600 hover:text-amber-700"
                    >
                      View documentation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-amber-100">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  type="button"
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
                  onClick={() => setSidebarOpen(true)}
                >
                  <FiMenu className="h-6 w-6" />
                </button>
                <div className="ml-4">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {workspace?.companyName || "Company Workspace"}
                  </h1>
                  <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="cursor-not-allowed p-2 text-gray-400 hover:text-gray-500 relative">
                  <FiBell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-amber-500 rounded-full"></span>
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="shrink-0">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {workspace?.adminId?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.email}
                      </p>
                      <p className="text-xs text-gray-500">{role}</p>
                    </div>
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <a
                        href="#"
                        className="cursor-not-allowed flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiUser className="mr-3 h-4 w-4" />
                        Your Profile
                      </a>
                      <a
                        href="#"
                        className="cursor-not-allowed flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiSettings className="mr-3 h-4 w-4" />
                        Settings
                      </a>
                      <div className="border-t border-gray-100"></div>
                      <p
                        onClick={signout}
                        className="cursor-pointer flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-amber-100 bg-white mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4">
                <FiGlobe className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {workspace?.companyName} • Private Workspace
                </span>
              </div>
              <div className="mt-2 md:mt-0">
                <p className="text-xs text-gray-400">
                  Powered by MongoDB • Enterprise Security •{" "}
                  {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
