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

export default function ProcessesLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Single initialization effect - runs once on client mount
  useEffect(() => {
    setIsMounted(true);

    try {
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("role");
      const storedWorkspace = localStorage.getItem("workspace");

      // Set state from localStorage
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setRole(storedRole);
      setWorkspace(storedWorkspace ? JSON.parse(storedWorkspace) : null);
    } catch (err) {
      console.error("Error loading user data from storage:", err);
      setUser(null);
      setRole(null);
      setWorkspace(null);
    }
  }, []);

  // Socket.io registration effect
  useEffect(() => {
    if (!isMounted) return;

    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("register", userId);
    }
  }, [isMounted]);

  const navigation = useMemo(
    () => [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: FiHome,
        current: pathname === "/dashboard",
      },
      {
        name: "Processes",
        href: "/processes",
        icon: FiLayers,
        current: pathname.startsWith("/processes"),
      },
      {
        name: "Users",
        href: "/dashboard/users",
        icon: FiUsers,
        current: pathname.startsWith("/dashboard/users"),
      },
      {
        name: "Company",
        href: "/dashboard/company",
        icon: FaBuilding,
        current: pathname.startsWith("/dashboard/company"),
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: FiSettings,
        current: pathname.startsWith("/dashboard/settings"),
      },
    ],
    [pathname],
  );

  // Render only when mounted on client
  if (!isMounted) {
    return null; // Prevent hydration mismatch
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`lg:hidden ${sidebarOpen ? "fixed inset-0 z-50" : "hidden"}`}
      >
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <FiBriefcase className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">WorkFlow</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-4 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.current
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button
              onClick={signout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <FiBriefcase className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">WorkFlow</span>
          </div>

          <nav className="flex-1 mt-6 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.current
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <FiUser className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ""}
                </p>
              </div>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600"
              >
                <FiChevronDown className="h-4 w-4" />
              </button>
            </div>

            {userMenuOpen && (
              <div className="space-y-1">
                <Link
                  href="/dashboard/settings"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Settings
                </Link>
                <button
                  onClick={signout}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Sign Out
                </button>
              </div>
            )}
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
                <div className="hidden lg:block ml-4">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {workspace?.companyName || "Company Workspace"}
                  </h1>
                  <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
                </div>
                {/* Mobile text version */}
                <div className="lg:hidden ml-4">
                  <h1 className="text-lg font-semibold text-gray-900">
                    WorkFlow
                  </h1>
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
                          {workspace?.adminId?.name?.charAt(0).toUpperCase() || "?"}
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
                        href="/dashboard/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
