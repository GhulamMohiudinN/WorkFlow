"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiHome, 
  FiLayers, 
  FiUser, 
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiSettings
} from "react-icons/fi";
import Image from "next/image";
import {
  FiBriefcase
} from "react-icons/fi";
import { useRouter } from 'next/navigation';

export default function UserLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboardUsers", icon: FiHome },
    { name: "Processes", href: "/processesUsers", icon: FiLayers },
    { name: "My Profile", href: "/profile", icon: FiUser },
  ];

  const router = useRouter();


  const isActive = (href) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          {/* <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WorkflowPro</span>
          </div> */}
          <div className="flex items-center h-16 px-4 border-b border-amber-100">
                      <div className="flex items-center space-x-3">
                        <div className="bg-linear-to-br from-amber-500 to-amber-600 p-2 rounded-lg">
                          <FiBriefcase className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">WorkflowPro</span>
                        <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded">BETA</span>
                      </div>
                    </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-amber-50 text-amber-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${active ? "text-amber-600" : "text-gray-500"}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button onClick={()=>router.push('/')} className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <FiLogOut className="h-5 w-5 mr-3 text-gray-500" />
            <span className="font-medium hover:cursor-pointer">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <FiBell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Viewer</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}