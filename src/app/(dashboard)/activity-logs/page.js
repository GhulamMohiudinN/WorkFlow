"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import workspaceAPI from "../../api/workspaceAPI";
import {
  FiActivity,
  FiClock,
  FiFilter,
  FiLayers,
  FiUserPlus,
  FiEdit,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiInfo,
  FiSearch,
} from "react-icons/fi";

// --- Utilities ---

const formatTimeOnly = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getActivityIcon = (action) => {
  switch (action) {
    case "invite_member":
      return <FiUserPlus className="h-5 w-5 text-blue-600" />;
    case "create_process":
      return <FiLayers className="h-5 w-5 text-purple-600" />;
    case "update_process":
      return <FiEdit className="h-5 w-5 text-amber-600" />;
    case "complete_task":
      return <FiCheckCircle className="h-5 w-5 text-green-600" />;
    case "remove_member":
      return <FiAlertCircle className="h-5 w-5 text-red-600" />;
    default:
      return <FiActivity className="h-5 w-5 text-gray-600" />;
  }
};

const getActivityBgColor = (action) => {
  switch (action) {
    case "invite_member": return "bg-blue-100/60";
    case "create_process": return "bg-purple-100/60";
    case "update_process": return "bg-amber-100/60";
    case "complete_task": return "bg-green-100/60";
    case "remove_member": return "bg-red-100/60";
    default: return "bg-gray-100/60";
  }
};

// --- Components ---

const LogItem = ({ log }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChanges = log.data?.changes && log.data.changes.length > 0;

  return (
    <div className="transition-all duration-300 border-b border-gray-100 last:border-0 hover:bg-white/60">
      <div className="p-6 flex items-start space-x-5">
        {/* Icon */}
        <div className={`shrink-0 p-3 rounded-2xl ${getActivityBgColor(log.action)} shadow-sm`}>
          {getActivityIcon(log.action)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
              {log.action.split('_').join(' ')}
            </span>
            <span className="text-xs text-gray-400 font-medium flex items-center">
              <FiClock className="mr-1.5 h-3.5 w-3.5" />
              {formatTimeOnly(log.createdAt)}
            </span>
          </div>

          <p className="text-sm font-semibold text-gray-800 leading-snug mb-3">
            {log.message}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center text-[11px] text-gray-500 bg-white/50 border border-gray-200 rounded-xl px-2.5 py-1.5 shadow-sm">
              <FiUser className="mr-2 h-3.5 w-3.5 text-amber-500" />
              <span className="font-bold text-gray-700">{log.userName || "System"}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-medium opacity-70">{log.userEmail}</span>
            </div>
            
            {hasChanges && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[10px] uppercase font-black text-amber-600 hover:text-amber-800 transition-all flex items-center bg-amber-50 rounded-xl px-3 py-1.5 ring-1 ring-amber-100"
              >
                <FiMaximize2 className="mr-1.5 h-3 w-3" />
                {isExpanded ? "Collapse Details" : "View Changes"}
              </button>
            )}
          </div>

          {/* Expanded Data Changes */}
          {isExpanded && hasChanges && (
            <div className="mt-5 bg-white rounded-2xl border border-amber-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300 shadow-xl shadow-amber-500/5">
              <div className="px-5 py-3 bg-amber-50/50 border-b border-amber-100 flex items-center">
                <FiInfo className="h-4 w-4 text-amber-600 mr-2.5" />
                <span className="text-[11px] font-black text-amber-700 uppercase tracking-widest">Modified Properties</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-400 font-bold uppercase tracking-tighter">
                      <th className="pb-3 pl-2">Field</th>
                      <th className="pb-3">Base State</th>
                      <th className="pb-3 text-right pr-2">Modified State</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {log.data.changes.map((change, idx) => (
                      <tr key={idx} className="border-t border-amber-50 first:border-0 hover:bg-amber-50/20 transition-colors">
                        <td className="py-3 pl-2 font-bold text-amber-600 italic">#{change.field}</td>
                        <td className="py-3">
                          <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-lg line-through font-medium border border-red-100/50">
                            {String(change.oldValue)}
                          </span>
                        </td>
                        <td className="py-3 text-right pr-2">
                          <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-lg font-black border border-green-100/50">
                            {String(change.newValue)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Interface ---

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 20
  });

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await workspaceAPI.getActivityLogs(page, 20);
      if (response.success) {
        setLogs(response.logs);
        setPagination({
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
          limit: response.limit
        });
      } else {
        throw new Error("Synchronization protocol failed");
      }
    } catch (err) {
      console.error("Audit Fetch Error:", err);
      setError("System cannot reach the activity database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  // Real-time Search Logic
  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;
    const term = searchTerm.toLowerCase();
    return logs.filter(log => 
      log.message.toLowerCase().includes(term) ||
      (log.userName && log.userName.toLowerCase().includes(term)) ||
      log.userEmail.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term)
    );
  }, [logs, searchTerm]);

  // Hierarchical Grouping
  const groupedLogs = useMemo(() => {
    return filteredLogs.reduce((groups, log) => {
      const date = new Date(log.createdAt).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const today = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

      let groupTitle = date;
      if (date === today) groupTitle = "Today";
      else if (date === yesterday) groupTitle = "Yesterday";

      if (!groups[groupTitle]) groups[groupTitle] = [];
      groups[groupTitle].push(log);
      return groups;
    }, {});
  }, [filteredLogs]);

  if (loading && logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-sans">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-100 border-t-amber-600"></div>
          <FiActivity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-amber-600 animate-pulse" />
        </div>
        <div className="mt-8 text-center space-y-2">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Accessing Audit Vault</h3>
          <p className="text-gray-500 font-medium opacity-60">Reconstructing history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4 font-sans">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] border border-red-50 shadow-2xl shadow-red-500/5 text-center">
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-red-50/50">
            <FiAlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">System Error</h2>
          <p className="text-gray-600 mb-10 font-medium leading-relaxed">{error}</p>
          <button
            onClick={() => fetchLogs(pagination.page)}
            className="w-full h-16 flex items-center justify-center bg-gray-900 text-white rounded-3xl font-black hover:bg-amber-600 transition-all active:scale-[0.97] shadow-xl shadow-amber-500/10 group"
          >
            <FiRefreshCw className="mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-700" />
            RE-SYNC
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-6 pb-24 font-sans">
      <div className="w-full">
        {/* Design Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-5">
              
              <h1 className="text-4xl font-bold text-gray-900 tracking-tighter ">System Activity Log</h1>
            </div>
            <p className="text-gray-500 font-semibold text-lg opacity-80 pl-1">
              Real-time audit trail of all operations within your workspace.
            </p>
          </div>
          
          <div className="flex items-center h-20 bg-white p-2 rounded-2xl border border-amber-100/50 shadow-xl shadow-amber-500/5">
            <div className="px-8 py-3 h-full border-r border-amber-50 text-center flex flex-col justify-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Logs</p>
              <p className="text-2xl font-black text-amber-600 leading-none">{pagination.total}</p>
            </div>
          
          </div>
        </div>

        {/* Real-time Search Integration */}
        <div className="mb-10 relative group">
          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
            <FiSearch className="h-6 w-6 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search activity by user, message or action..."
            className="w-full h-18 pl-20 pr-10 bg-white border-2 border-amber-100/30 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none font-bold text-gray-800 transition-all shadow-xl shadow-amber-500/5 placeholder:text-gray-300 placeholder:font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Log Chronology */}
        <div className="space-y-12">
          {Object.entries(groupedLogs).length > 0 ? (
            Object.entries(groupedLogs).map(([date, dayLogs]) => (
              <section key={date} className="relative">
                <div className="sticky top-20 z-10 flex mb-6">
                  <span className="bg-amber-50/90 backdrop-blur-xl px-5 py-2 rounded-xl border border-amber-200/50 shadow-lg shadow-amber-500/5 text-[11px] font-black text-amber-700 flex items-center uppercase tracking-widest">
                    <FiClock className="mr-2.5 h-4 w-4" />
                    {date}
                  </span>
                </div>
                
                <div className="bg-white rounded-[2rem] border border-amber-100/50 shadow-2xl shadow-amber-500/5 overflow-hidden">
                  {dayLogs.map((log) => (
                    <LogItem key={log._id} log={log} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="bg-white rounded-[3rem] p-24 border-4 border-dashed border-amber-50 text-center shadow-inner">
              <div className="h-32 w-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 ring-[12px] ring-amber-50/30">
                <FiActivity className="h-16 w-16 text-amber-200" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter">No Results</h3>
              <p className="text-gray-500 max-w-sm mx-auto font-bold opacity-60">Try searching for something else.</p>
            </div>
          )}
        </div>

        {/* Specialized Pagination Navigation */}
        {!searchTerm && pagination.totalPages > 1 && (
          <div className="mt-16 flex items-center justify-between bg-white px-8 py-5 rounded-2xl border border-amber-100 shadow-2xl shadow-amber-500/10">
            <div className="hidden md:flex items-center text-xs font-black text-gray-400 uppercase tracking-widest">
              <span>Showing</span>
              <span className="px-3 text-amber-600 bg-amber-50 rounded-lg mx-2 italic font-black">
                {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>
              <span>of</span>
              <span className="px-3 text-gray-900 font-bold">{pagination.total}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchLogs(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`p-4 rounded-xl transition-all ${
                  pagination.page === 1 
                    ? "text-gray-200 bg-gray-50 cursor-not-allowed" 
                    : "text-amber-600 hover:bg-amber-50 bg-white ring-2 ring-amber-50 active:scale-90"
                }`}
              >
                <FiChevronLeft className="h-6 w-6" />
              </button>
              
              <div className="flex gap-2">
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (Math.abs(pagination.page - pageNum) > 1 && pageNum !== 1 && pageNum !== pagination.totalPages) {
                    if (Math.abs(pagination.page - pageNum) === 2) return <span key={pageNum} className="w-10 text-center text-gray-300 self-end font-black">...</span>;
                    return null;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchLogs(pageNum)}
                      className={`h-11 w-11 rounded-xl font-black text-sm transition-all ${
                        pagination.page === pageNum
                          ? "bg-amber-500 text-white shadow-xl shadow-amber-500/40"
                          : "bg-white text-gray-400 hover:bg-amber-50 hover:text-amber-600 ring-1 ring-amber-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => fetchLogs(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={`p-4 rounded-xl transition-all ${
                  pagination.page === pagination.totalPages 
                    ? "text-gray-200 bg-gray-50 cursor-not-allowed" 
                    : "text-amber-600 hover:bg-amber-50 bg-white ring-2 ring-amber-50 active:scale-90"
                }`}
              >
                <FiChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
