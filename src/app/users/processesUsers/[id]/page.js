"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  FiArrowLeft, 
  FiLayers, 
  FiClock, 
  FiUser, 
  FiEye,
  FiInfo,
  FiAlertCircle
} from "react-icons/fi";

export default function UserProcessDetailPage() {
  const { id } = useParams();
  const [process, setProcess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProcess({
        id: parseInt(id),
        name: "Employee Onboarding",
        description: "Complete onboarding process for new hires",
        status: "active",
        progress: 60,
        steps: [
          { id: 1, name: "Initial HR Review", assignee: "HR Manager", status: "completed", timeEstimate: "2 hours" },
          { id: 2, name: "IT Account Setup", assignee: "IT Team", status: "in-progress", timeEstimate: "4 hours" },
          { id: 3, name: "Manager Introduction", assignee: "Team Lead", status: "pending", timeEstimate: "1 hour" },
          { id: 4, name: "Training Assignment", assignee: "HR Manager", status: "pending", timeEstimate: "30 min" }
        ],
        assignedTo: "HR Team",
        lastUpdated: "2 hours ago",
        processExpert: "Sarah Johnson",
        processOwner: "Michael Chen"
      });
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const getStepStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><FiCheck className="h-3 w-3 text-white" /></div>;
      case 'in-progress': return <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-white animate-pulse"></div></div>;
      default: return <div className="w-6 h-6 rounded-full bg-gray-300"></div>;
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/users/processes" className="flex items-center text-gray-600 hover:text-gray-900">
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Back to Processes
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{process.name}</h1>
          <p className="text-gray-600 mt-1">{process.description}</p>
        </div>
      </div>

      {/* Read-only notice */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center gap-3">
        <FiEye className="h-5 w-5 text-blue-600" />
        <p className="text-sm text-blue-800">
          View-only mode. You can see process details but cannot make changes.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Steps */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Process Steps</h2>
              <p className="text-sm text-gray-500 mt-1">Your assigned tasks and progress</p>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {process.steps.map((step, idx) => (
                    <div key={step.id} className="relative flex gap-4">
                      <div className="relative z-10">
                        {getStepStatusIcon(step.status)}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{step.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">Assigned to: {step.assignee}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiClock className="h-4 w-4" />
                            <span>{step.timeEstimate}</span>
                          </div>
                        </div>
                        {step.status === 'in-progress' && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                              Mark as Complete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-amber-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiInfo className="h-5 w-5 text-amber-500" />
              Process Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Progress:</span>
                <span className="font-medium">{process.progress}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">{process.lastUpdated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Process Expert:</span>
                <span className="font-medium">{process.processExpert}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Process Owner:</span>
                <span className="font-medium">{process.processOwner}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Need Help?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Contact your process owner or workspace admin for assistance with this workflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FiCheck(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}