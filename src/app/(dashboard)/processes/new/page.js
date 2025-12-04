"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  FiLayers, 
  FiPlus, 
  FiArrowLeft, 
  FiSave, 
  FiUsers, 
  FiClock,
  FiAlertCircle,
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiTrash2,
  FiHelpCircle,
  FiZap,
  FiUpload
} from "react-icons/fi";

export default function NewProcessPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Dummy form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    visibility: "private",
    assignedTo: [],
    steps: [
      { id: 1, title: "Initial Review", description: "Review initial requirements", assignee: "john@techflow.com", timeEstimate: "2 hours", order: 1 },
      { id: 2, title: "Approval", description: "Get manager approval", assignee: "sarah@techflow.com", timeEstimate: "1 day", order: 2 },
    ],
    notifications: {
      email: true,
      slack: false,
      inApp: true
    },
    automation: {
      autoAssign: false,
      dueDateReminders: true,
      escalation: false
    }
  });

  // Dummy categories
  const categories = [
    "Onboarding", "HR", "Finance", "IT", "Marketing", "Sales", "Operations", "Customer Support", "Legal", "Other"
  ];

  // Dummy team members for assignment
  const teamMembers = [
    { id: 1, name: "John Doe", email: "john@techflow.com", role: "admin" },
    { id: 2, name: "Sarah Chen", email: "sarah@techflow.com", role: "editor" },
    { id: 3, name: "Mike Wilson", email: "mike@techflow.com", role: "viewer" },
    { id: 4, name: "Emma Davis", email: "emma@techflow.com", role: "editor" },
    { id: 5, name: "Alex Kim", email: "alex@techflow.com", role: "viewer" },
  ];

  const steps = [
    { number: 1, title: "Basic Info", description: "Process details" },
    { number: 2, title: "Steps", description: "Define workflow steps" },
    { number: 3, title: "Assignments", description: "Assign team members" },
    { number: 4, title: "Settings", description: "Configure options" },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStepChange = (stepId, field, value) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, [field]: value } : step
      )
    }));
  };

  const addNewStep = () => {
    const newStepId = formData.steps.length + 1;
    setFormData(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        { 
          id: newStepId, 
          title: `Step ${newStepId}`, 
          description: "Describe this step...",
          assignee: "",
          timeEstimate: "1 hour",
          order: newStepId
        }
      ]
    }));
  };

  const removeStep = (stepId) => {
    if (formData.steps.length > 1) {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps.filter(step => step.id !== stepId)
      }));
    }
  };

  const moveStepUp = (index) => {
    if (index > 0) {
      const newSteps = [...formData.steps];
      [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
      setFormData(prev => ({ ...prev, steps: newSteps }));
    }
  };

  const moveStepDown = (index) => {
    if (index < formData.steps.length - 1) {
      const newSteps = [...formData.steps];
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
      setFormData(prev => ({ ...prev, steps: newSteps }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      console.log("Process created:", formData);
    }, 2000);
  };

  const getStepProgress = () => {
    return `${((activeStep - 1) / (steps.length - 1)) * 100}%`;
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Process Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                placeholder="e.g., Employee Onboarding Process"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="4"
                className="block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                placeholder="Describe what this process accomplishes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {categories.map((category) => (
                  <div
                    key={category}
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all duration-200 ${
                      formData.category === category
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-300 hover:border-amber-300'
                    }`}
                    onClick={() => handleInputChange('category', category)}
                  >
                    <span className="text-sm font-medium text-gray-900">{category}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    formData.visibility === 'private'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-300 hover:border-amber-300'
                  }`}
                  onClick={() => handleInputChange('visibility', 'private')}
                >
                  <div className="flex items-center mb-2">
                    <div className={`h-3 w-3 rounded-full mr-2 ${
                      formData.visibility === 'private' ? 'bg-amber-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="font-medium text-gray-900">Private</span>
                  </div>
                  <p className="text-sm text-gray-600">Only assigned team members can view</p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    formData.visibility === 'public'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-300 hover:border-amber-300'
                  }`}
                  onClick={() => handleInputChange('visibility', 'public')}
                >
                  <div className="flex items-center mb-2">
                    <div className={`h-3 w-3 rounded-full mr-2 ${
                      formData.visibility === 'public' ? 'bg-amber-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="font-medium text-gray-900">Public</span>
                  </div>
                  <p className="text-sm text-gray-600">All workspace members can view</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Process Steps</h3>
              <button
                type="button"
                onClick={addNewStep}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Add Step
              </button>
            </div>

            <div className="space-y-4">
              {formData.steps.map((step, index) => (
                <div key={step.id} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-white border border-gray-300 rounded-lg px-4 py-2 mr-4">
                        <span className="font-bold text-gray-900">Step {step.order}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => moveStepUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-400 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => moveStepDown(index)}
                          disabled={index === formData.steps.length - 1}
                          className="p-2 text-gray-400 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {formData.steps.length > 1 && (
                      <button
                        onClick={() => removeStep(step.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Step Title
                      </label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleStepChange(step.id, 'title', e.target.value)}
                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Estimate
                      </label>
                      <select
                        value={step.timeEstimate}
                        onChange={(e) => handleStepChange(step.id, 'timeEstimate', e.target.value)}
                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      >
                        <option value="30 minutes">30 minutes</option>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        <option value="4 hours">4 hours</option>
                        <option value="1 day">1 day</option>
                        <option value="2 days">2 days</option>
                        <option value="1 week">1 week</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={step.description}
                      onChange={(e) => handleStepChange(step.id, 'description', e.target.value)}
                      rows="2"
                      className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign To (Optional)
                    </label>
                    <select
                      value={step.assignee}
                      onChange={(e) => handleStepChange(step.id, 'assignee', e.target.value)}
                      className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    >
                      <option value="">Select team member</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.email}>
                          {member.name} ({member.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <div className="flex items-start">
                <FiHelpCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Tips for creating steps</p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Keep steps focused on single tasks</li>
                    <li>• Estimate realistic timeframes</li>
                    <li>• Assign specific team members when needed</li>
                    <li>• Use clear, descriptive titles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Team Members</h3>
              <p className="text-gray-600 mb-6">Select team members who can participate in this process</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      formData.assignedTo.includes(member.email)
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-300 hover:border-amber-300'
                    }`}
                    onClick={() => {
                      const newAssignedTo = formData.assignedTo.includes(member.email)
                        ? formData.assignedTo.filter(email => email !== member.email)
                        : [...formData.assignedTo, member.email];
                      handleInputChange('assignedTo', newAssignedTo);
                    }}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        formData.assignedTo.includes(member.email)
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-gray-400'
                      }`}>
                        {formData.assignedTo.includes(member.email) && (
                          <FiCheck className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium capitalize">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
              <div className="flex items-start">
                <FiUsers className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Assignment Notes</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Assigned members will receive notifications about this process. 
                    You can also assign specific team members to individual steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Process Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Notifications</h4>
                  <div className="space-y-4">
                    {Object.entries(formData.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-white p-2 rounded-lg mr-3">
                            <FiAlertCircle className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 capitalize">{key} Notifications</p>
                            <p className="text-sm text-gray-600">
                              {key === 'email' && 'Send email notifications for process updates'}
                              {key === 'slack' && 'Send notifications to Slack'}
                              {key === 'inApp' && 'Show in-app notifications'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleInputChange('notifications', {
                            ...formData.notifications,
                            [key]: !value
                          })}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                            value ? 'bg-amber-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              value ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Automation</h4>
                  <div className="space-y-4">
                    {Object.entries(formData.automation).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-white p-2 rounded-lg mr-3">
                            <FiZap className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-600">
                              {key === 'autoAssign' && 'Automatically assign tasks to available team members'}
                              {key === 'dueDateReminders' && 'Send reminders before due dates'}
                              {key === 'escalation' && 'Escalate overdue tasks to managers'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleInputChange('automation', {
                            ...formData.automation,
                            [key]: !value
                          })}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                            value ? 'bg-amber-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              value ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Attachments (Optional)</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FiUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                    <p className="text-sm text-gray-500">Supports PDF, DOC, XLS up to 10MB each</p>
                    <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const validateStep = () => {
    switch (activeStep) {
      case 1:
        return formData.name.trim() !== "" && formData.category !== "";
      case 2:
        return formData.steps.every(step => step.title.trim() !== "");
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep() && activeStep < steps.length) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        {/* <Link
          href="/dashboard/processes"
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Link> */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Process</h1>
          <p className="text-gray-600 mt-2">Build your workflow step by step</p>
        </div>
      </div>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="bg-green-100 rounded-full p-4 w-fit mx-auto mb-4">
            <FiCheck className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Process Created!</h2>
          <p className="text-gray-600 mb-6">
            {formData.name} has been created successfully
          </p>
          <div className="flex space-x-3 justify-center">
            <Link
              href="/dashboard/processes"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
            >
              View All Processes
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setActiveStep(1);
                setFormData({
                  name: "",
                  description: "",
                  category: "",
                  visibility: "private",
                  assignedTo: [],
                  steps: [
                    { id: 1, title: "Initial Review", description: "Review initial requirements", assignee: "", timeEstimate: "2 hours", order: 1 },
                    { id: 2, title: "Approval", description: "Get manager approval", assignee: "", timeEstimate: "1 day", order: 2 },
                  ],
                  notifications: { email: true, slack: false, inApp: true },
                  automation: { autoAssign: false, dueDateReminders: true, escalation: false }
                });
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-amber-300 hover:text-amber-600 transition-all duration-200"
            >
              Create Another
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-amber-100 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-900">
                Step {activeStep} of {steps.length}: {steps.find(s => s.number === activeStep)?.title}
              </div>
              <div className="text-sm text-gray-500">
                {steps.find(s => s.number === activeStep)?.description}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                style={{ width: getStepProgress() }}
              ></div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="px-6 py-4 border-b border-amber-100 bg-white">
            <div className="flex justify-between">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step.number === activeStep
                      ? 'bg-amber-500 text-white'
                      : step.number < activeStep
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.number < activeStep ? <FiCheck className="w-5 h-5" /> : step.number}
                  </div>
                  <span className={`text-xs font-medium ${
                    step.number === activeStep ? 'text-amber-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={activeStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FiChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {activeStep === steps.length ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Process...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Create Process
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Next Step
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Sidebar (Right Column) */}
      {!success && (
        <div className="mt-8 lg:mt-0 lg:absolute lg:right-8 lg:top-8 lg:w-80">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm sticky top-24">
            <div className="px-6 py-4 border-b border-amber-100">
              <h2 className="text-lg font-semibold text-gray-900">Process Preview</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Basic Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900 truncate ml-2">{formData.name || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">{formData.category || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visibility:</span>
                      <span className="font-medium text-gray-900 capitalize">{formData.visibility}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Workflow</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Steps:</span>
                      <span className="font-medium text-gray-900">{formData.steps.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned to:</span>
                      <span className="font-medium text-gray-900">{formData.assignedTo.length} members</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Steps Preview</h3>
                  <div className="space-y-2">
                    {formData.steps.slice(0, 3).map((step, index) => (
                      <div key={step.id} className="flex items-center text-sm">
                        <div className="bg-gray-200 rounded px-2 py-1 mr-2 text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-gray-900 truncate">{step.title}</span>
                        {step.timeEstimate && (
                          <span className="ml-auto text-gray-500 text-xs">
                            <FiClock className="inline h-3 w-3 mr-1" />
                            {step.timeEstimate}
                          </span>
                        )}
                      </div>
                    ))}
                    {formData.steps.length > 3 && (
                      <div className="text-center text-sm text-gray-500">
                        +{formData.steps.length - 3} more steps
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-amber-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <FiLayers className="h-5 w-5 text-amber-600 mr-2" />
                      <p className="text-sm font-medium text-gray-900">AI Suggestions Ready</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      After creation, get AI-powered optimization suggestions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}