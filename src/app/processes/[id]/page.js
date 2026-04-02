"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  FiArrowLeft, 
  FiLayers, 
  FiClock, 
  FiDollarSign, 
  FiTag, 
  FiZap, 
  FiAlertCircle,
  FiDownload,
  FiCopy,
  FiSettings,
  FiEdit2,
  FiUsers,
  FiInfo,
  FiPlus,
  FiMinus,
  FiMaximize,
  FiMinimize,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiUser,
  FiCalendar,
  FiFileText,
  FiLink
} from "react-icons/fi";

export default function ProcessDetailPage() {
  const { id } = useParams();
  const [process, setProcess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimeframe, setShowTimeframe] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    changeLog: true,
    documents: true,
    costs: true,
    systems: true
  });
  const [viewMode, setViewMode] = useState("timeline"); // timeline, list, grid

  useEffect(() => {
    setTimeout(() => {
      setProcess({
        id: parseInt(id),
        name: "Employee Onboarding",
        description: "Complete onboarding process for new hires including orientation, training, and system access",
        steps: 5,
        activities: [
          { 
            id: 1, 
            name: "Initial HR Review", 
            description: "Review new hire paperwork and initiate background check", 
            type: "activity", 
            assignee: "HR Manager", 
            assigneeAvatar: "HJ",
            timeEstimate: "2 hours", 
            cost: 50, 
            tags: ["HR", "Paperwork"], 
            automation: false, 
            notes: "Ensure all documents are signed", 
            faq: "Background check takes 3-5 business days",
            status: "completed",
            dueDate: "2024-03-01"
          },
          { 
            id: 2, 
            name: "IT Account Setup", 
            description: "Create email, system accounts, and assign hardware", 
            type: "activity", 
            assignee: "IT Team", 
            assigneeAvatar: "IT",
            timeEstimate: "4 hours", 
            cost: 100, 
            tags: ["IT", "Automated"], 
            automation: true, 
            notes: "Use automated provisioning system", 
            faq: "Laptop setup requires manager approval",
            status: "in-progress",
            dueDate: "2024-03-02"
          },
          { 
            id: 3, 
            name: "Manager Introduction", 
            description: "Schedule meeting with team and assign mentor", 
            type: "activity", 
            assignee: "Team Lead", 
            assigneeAvatar: "TL",
            timeEstimate: "1 hour", 
            cost: 30, 
            tags: ["HR", "Meeting"], 
            automation: false, 
            notes: "Prepare welcome package", 
            faq: "Mentor assigned for first 30 days",
            status: "pending",
            dueDate: "2024-03-03"
          },
          { 
            id: 4, 
            name: "Training Assignment", 
            description: "Assign required training modules", 
            type: "decision", 
            assignee: "HR Manager", 
            assigneeAvatar: "HM",
            timeEstimate: "30 min", 
            cost: 20, 
            tags: ["Training"], 
            automation: false, 
            notes: "Based on role and department", 
            faq: "Compliance training mandatory",
            status: "pending",
            dueDate: "2024-03-04"
          },
          { 
            id: 5, 
            name: "Equipment Setup", 
            description: "Configure desk, phone, and hardware", 
            type: "activity", 
            assignee: "Facilities", 
            assigneeAvatar: "FC",
            timeEstimate: "2 hours", 
            cost: 150, 
            tags: ["IT", "Hardware"], 
            automation: false, 
            notes: "Check inventory availability", 
            faq: "Equipment list provided by IT",
            status: "pending",
            dueDate: "2024-03-05"
          }
        ],
        assignedTo: "HR Team",
        status: "active",
        lastUpdated: "2 hours ago",
        completion: 85,
        color: "bg-blue-500",
        processExpert: "Sarah Johnson",
        processOwner: "Michael Chen",
        objective: "Streamline new hire integration to reduce time-to-productivity by 40%",
        nextReviewDate: "2024-06-15",
        background: "Current onboarding process takes 2 weeks, goal to reduce to 1 week",
        searchKeywords: "onboarding, hiring, new employee, orientation",
        leanTags: ["Value Stream", "Standard Work"],
        cycleCost: 490,
        annualVolume: 120,
        totalAnnualCost: 58800,
        systems: ["HRIS", "Active Directory", "Slack"],
        documents: [
          { name: "Onboarding Checklist.pdf", type: "PDF", date: "2024-01-15", size: "2.4 MB" },
          { name: "IT Setup Guide.docx", type: "Word", date: "2024-01-10", size: "1.2 MB" },
          { name: "Welcome Package.pptx", type: "PowerPoint", date: "2024-01-05", size: "3.1 MB" }
        ],
        changeLog: [
          { user: "Sarah Johnson", avatar: "SJ", status: "Published v2.0", description: "Added automated IT setup", date: "2024-03-01" },
          { user: "Michael Chen", avatar: "MC", status: "Draft v1.5", description: "Updated training requirements", date: "2024-02-15" }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const zoomIn = () => {
    if (zoomLevel < 150) setZoomLevel(prev => prev + 10);
  };

  const zoomOut = () => {
    if (zoomLevel > 70) setZoomLevel(prev => prev - 10);
  };

  const resetZoom = () => setZoomLevel(100);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading process details...</p>
        </div>
      </div>
    );
  }

  if (!process) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 rounded-full p-6 w-fit mx-auto mb-4"><FiAlertCircle className="h-12 w-12 text-red-500" /></div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Process not found</h3>
        <Link href="/processes" className="text-amber-500 hover:underline">Back to Processes</Link>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center">
          <Link href="/processes" className="flex items-center text-gray-600 hover:text-gray-900 mr-4 transition-colors">
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className={`${process.color} h-12 w-12 rounded-xl flex items-center justify-center shadow-lg`}>
                <FiLayers className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{process.name}</h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">{process.status}</span>
            </div>
            <p className="text-gray-600">{process.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href={`/processes/${process.id}/edit`} 
            className="px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <FiEdit2 className="h-4 w-4" />
            Edit Process
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-amber-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FiUsers className="h-5 w-5 text-amber-500" />
            <span className="text-xs text-gray-400">Assigned</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{process.assignedTo}</p>
          <p className="text-xs text-gray-500 mt-1">Team Members</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FiLayers className="h-5 w-5 text-amber-500" />
            <span className="text-xs text-gray-400">Steps</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{process.steps}</p>
          <p className="text-xs text-gray-500 mt-1">Total Activities</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FiClock className="h-5 w-5 text-amber-500" />
            <span className="text-xs text-gray-400">Progress</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{process.completion}%</p>
          <div className="h-1.5 bg-gray-200 rounded-full mt-2">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${process.completion}%` }}></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-amber-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FiCalendar className="h-5 w-5 text-amber-500" />
            <span className="text-xs text-gray-400">Updated</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{process.lastUpdated}</p>
          <p className="text-xs text-gray-500 mt-1">Last modified</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-xl border border-amber-100 shadow-sm mb-6 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === "timeline" ? "bg-amber-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"}`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === "list" ? "bg-amber-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"}`}
              >
                List View
              </button>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowTimeframe(!showTimeframe)}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all ${showTimeframe ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                <FiDollarSign className="h-4 w-4" />
                Show Costs
              </button>
              <button 
                onClick={() => setShowTags(!showTags)}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all ${showTags ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                <FiTag className="h-4 w-4" />
                Show Tags
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button onClick={zoomOut} className="p-1.5 hover:bg-white rounded-md transition-colors" title="Zoom Out">
                <FiMinus className="h-4 w-4" />
              </button>
              <button onClick={resetZoom} className="px-2 py-1 text-sm font-medium hover:bg-white rounded-md transition-colors">
                {zoomLevel}%
              </button>
              <button onClick={zoomIn} className="p-1.5 hover:bg-white rounded-md transition-colors" title="Zoom In">
                <FiPlus className="h-4 w-4" />
              </button>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <button className="p-2 text-gray-400 hover:text-amber-600 transition-colors" title="Download Map">
              <FiDownload className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-amber-600 transition-colors" title="Copy Process">
              <FiCopy className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900">Process Activities</h2>
              <p className="text-sm text-gray-500 mt-0.5">Click any activity to view detailed information</p>
            </div>
            <div 
              className="p-6 transition-all duration-300"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top left" }}
            >
              {viewMode === "timeline" ? (
                // Timeline View
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {process.activities.map((activity, idx) => (
                      <div key={activity.id} className="relative flex items-start gap-4">
                        <div className="relative z-10">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all hover:scale-105 ${activity.status === 'completed' ? 'bg-green-500' : activity.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'}`}
                               onClick={() => setSelectedActivity(activity)}>
                            {activity.status === 'completed' ? (
                              <FiCheckCircle className="h-6 w-6 text-white" />
                            ) : (
                              <span className="text-white font-semibold">{idx + 1}</span>
                            )}
                          </div>
                        </div>
                        <div 
                          className="flex-1 bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all hover:border-amber-200"
                          onClick={() => setSelectedActivity(activity)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(activity.status)}`}>
                                  {getStatusText(activity.status)}
                                </span>
                                {activity.automation && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                                    <FiZap className="h-3 w-3" />
                                    AI Auto
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                            <FiEye className="h-5 w-5 text-gray-400 hover:text-amber-500" />
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <FiUser className="h-4 w-4" />
                              <span>{activity.assignee}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <FiClock className="h-4 w-4" />
                              <span>{activity.timeEstimate}</span>
                            </div>
                            {showTimeframe && (
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <FiDollarSign className="h-4 w-4" />
                                <span>${activity.cost}</span>
                              </div>
                            )}
                            {showTags && activity.tags.map(tag => (
                              <div key={tag} className="flex items-center gap-1.5 text-xs bg-gray-100 px-2 py-1 rounded-full">
                                <FiTag className="h-3 w-3" />
                                <span>{tag}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Grid View
                <div className="grid md:grid-cols-2 gap-4">
                  {process.activities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all hover:border-amber-200"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.status === 'completed' ? 'bg-green-100' : activity.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <span className="text-xs font-semibold">{activity.id}</span>
                          </div>
                          <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                        </div>
                        {activity.automation && <FiZap className="h-4 w-4 text-blue-500" />}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiUser className="h-3 w-3" />
                          <span>{activity.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="h-3 w-3" />
                          <span>{activity.timeEstimate}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(activity.status)}`}>
                          {getStatusText(activity.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Process Attributes */}
        <div className="space-y-4">
          {/* Summary Section */}
          <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => toggleSection('summary')}
              className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiInfo className="h-5 w-5 text-amber-500" />
                Summary
              </h3>
              {expandedSections.summary ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.summary && (
              <div className="px-5 pb-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Process Expert</p>
                    <p className="font-medium text-gray-900">{process.processExpert}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Process Owner</p>
                    <p className="font-medium text-gray-900">{process.processOwner}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Objective</p>
                  <p className="text-sm text-gray-900">{process.objective}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Next Review Date</p>
                  <p className="text-sm font-medium text-gray-900">{process.nextReviewDate}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Background</p>
                  <p className="text-sm text-gray-600">{process.background}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Keywords</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {process.searchKeywords.split(', ').map(kw => (
                      <span key={kw} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Change Log */}
          <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => toggleSection('changeLog')}
              className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Change Log</h3>
              {expandedSections.changeLog ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.changeLog && (
              <div className="px-5 pb-4 space-y-3">
                {process.changeLog.map((log, idx) => (
                  <div key={idx} className="border-l-2 border-amber-500 pl-3">
                    <p className="text-sm font-medium text-gray-900">{log.status}</p>
                    <p className="text-xs text-gray-500">{log.user} • {log.date}</p>
                    <p className="text-xs text-gray-600 mt-1">{log.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => toggleSection('documents')}
              className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiFileText className="h-5 w-5 text-amber-500" />
                Documents ({process.documents.length})
              </h3>
              {expandedSections.documents ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.documents && (
              <div className="px-5 pb-4 space-y-2">
                {process.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} • {doc.size} • {doc.date}</p>
                    </div>
                    <button className="text-amber-500 hover:text-amber-600 text-sm flex items-center gap-1">
                      <FiEye className="h-4 w-4" />
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cycle Costs */}
          <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => toggleSection('costs')}
              className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiDollarSign className="h-5 w-5 text-green-500" />
                Cycle Costs
              </h3>
              {expandedSections.costs ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.costs && (
              <div className="px-5 pb-4 space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Cost per Cycle</span>
                  <span className="font-semibold text-gray-900">${process.cycleCost}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Annual Volume</span>
                  <span className="font-semibold text-gray-900">{process.annualVolume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700 font-medium">Total Annual Cost</span>
                  <span className="font-bold text-gray-900 text-lg">${process.totalAnnualCost.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Systems & Tags */}
          <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => toggleSection('systems')}
              className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Systems & Tags</h3>
              {expandedSections.systems ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.systems && (
              <div className="px-5 pb-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Connected Systems</p>
                  <div className="flex flex-wrap gap-2">
                    {process.systems.map(system => (
                      <span key={system} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-center gap-1">
                        <FiLink className="h-3 w-3" />
                        {system}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Lean Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {process.leanTags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-sm rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedActivity(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(selectedActivity.status)}`}>
                  {selectedActivity.type === 'decision' ? <FiAlertCircle /> : <FiLayers />}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedActivity.name}</h3>
              </div>
              <button onClick={() => setSelectedActivity(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                <p className="text-gray-800 mt-1">{selectedActivity.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned To</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-amber-600">{selectedActivity.assigneeAvatar || selectedActivity.assignee.charAt(0)}</span>
                    </div>
                    <p className="font-medium text-gray-900">{selectedActivity.assignee}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time Estimate</label>
                  <div className="flex items-center gap-2 mt-1">
                    <FiClock className="h-4 w-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{selectedActivity.timeEstimate}</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</label>
                <div className="flex items-center gap-2 mt-1">
                  <FiCalendar className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-800">{selectedActivity.dueDate || "Not set"}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">{selectedActivity.notes || "No additional notes"}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">FAQ / Help</label>
                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg mt-1">{selectedActivity.faq || "No FAQs available"}</p>
              </div>
              {selectedActivity.automation && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiZap className="h-5 w-5 text-blue-600" />
                    <p className="font-semibold text-blue-800">AI Automation Available</p>
                  </div>
                  <p className="text-sm text-blue-700">This step can be automated using AI to reduce manual effort by up to 80%.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component
function FiCheckCircle(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}