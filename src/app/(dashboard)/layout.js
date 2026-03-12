"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspaceStore, useUserStore } from "../store";
import { socket } from "../utils/socket";
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
  FiHelpCircle,
  FiGlobe
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import AUTH from "../axios/auth";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { workspace, role, clearWorkspace, setWorkspace } = useWorkspaceStore();
  const { user, clearUser } = useUserStore();

  const router = useRouter();
  const pathname = usePathname();

  const signout = async () => {
    socket.disconnect();
    router.push("/");
    AUTH.logout();
    clearWorkspace();
    clearUser();
  };

  // Socket connect when user exists
  useEffect(() => {
    if (!user?._id) return;

    socket.auth = {
      userId: user._id,
    };

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  // Member added listener
  useEffect(() => {
    if (!workspace?._id) return;

    const eventName = `workspace:${workspace._id}:memberAdded`;

    const handleMemberAdded = (newWorkspace) => {
      console.log("New member added:", newWorkspace);
      setWorkspace(newWorkspace);
    };

    socket.on(eventName, handleMemberAdded);

    return () => {
      socket.off(eventName, handleMemberAdded);
    };
  }, [workspace?._id, setWorkspace]);

  // User online/offline listener
  useEffect(() => {
    const handleUserStatusChanged = ({ userId, status, lastActiveAt }) => {
      setWorkspace((prevWorkspace) => {
        if (!prevWorkspace) return prevWorkspace;

        return {
          ...prevWorkspace,
          members: (prevWorkspace.members || []).map((member) => {
            const memberUserId =
              member?.memberId?._id || member?.memberId || null;

            if (memberUserId?.toString() !== userId?.toString()) {
              return member;
            }

            if (typeof member.memberId === "object" && member.memberId !== null) {
              return {
                ...member,
                memberId: {
                  ...member.memberId,
                  isOnline: status === "online",
                  lastActiveAt,
                },
              };
            }

            return member;
          }),
        };
      });
    };

    socket.on("userStatusChanged", handleUserStatusChanged);

    return () => {
      socket.off("userStatusChanged", handleUserStatusChanged);
    };
  }, [setWorkspace]);
  useEffect(() => {
  if (!workspace?._id || !socket.connected) return;

  socket.emit("joinWorkspace", workspace._id);
}, [workspace?._id, user?._id]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: FiHome, current: pathname === "/dashboard" },
    { name: "Company", href: "#", icon: FaBuilding, current: pathname === "/company" },
    { name: "Processes", href: "#", icon: FiLayers, current: pathname === "/processes" },
    { name: "Users", href: "#", icon: FiUsers, current: pathname === "/users" },
    { name: "Settings", href: "#", icon: FiSettings, current: pathname === "/settings" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white">
      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? "fixed inset-0 z-50" : "hidden"}`}>
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
                  className={`mr-3 h-5 w-5 ${
                    item.current ? "text-amber-500" : "text-gray-400"
                  }`}
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
                    {workspace?.ownerId?.name?.charAt(0)?.toUpperCase() || "W"}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{workspace?.companyEmail}</p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
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
                    <p className="text-sm font-medium text-gray-900">Need help?</p>
                    <a href="#" className="text-xs text-amber-600 hover:text-amber-700">
                      View documentation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="lg:pl-64">
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

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="shrink-0">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {workspace?.ownerId?.name?.charAt(0)?.toUpperCase() || "W"}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                      <p className="text-xs text-gray-500">{role}</p>
                    </div>
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

        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>

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
                  Powered by MongoDB • Enterprise Security • {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}