"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaBuilding } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import AUTH from "../../axios/auth";
import WORKSPACE from "../../axios/workspace";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {COMPANY_TYPES, INDUSTRIES, EMPLOYEE_RANGES, workflowTypes, integrationOptions } from "./content"
import { step1Schema, step2Schema, step3Schema, step4Schema } from "../../formValidationScheme/authSchema";
import { useUserStore, useWorkspaceStore } from "../../store";
import {
  FiBriefcase,
  FiGlobe,
  FiUsers,
  FiMapPin,
  FiHash,
  FiCalendar,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiHelpCircle,
  FiTrendingUp,
  FiLayers,
  FiShield,
  FiZap
} from "react-icons/fi";

export default function CompanySetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [workflowError,setWorkflowError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const {setUser} = useUserStore()
  const {setWorkspace} = useWorkspaceStore()
  const token = useSearchParams().get("token");
  const schemas = {
    1: step1Schema,
    2: step2Schema,
    3: step3Schema,
    4: step4Schema
  }
  const totalSteps = 4;
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schemas[currentStep]),
    defaultValues:{
      primaryWorkflowTypes:[],
      automationPriority:"medium",
      foundedYear:"",
      expectedWorkflows:"",
      notificationPreferences: {
      email: true,
      slack: false,
      teams: false,
      inApp: true
    }
    }
  });
  const formData =  getValues();

  // functionality start here-----------
  useEffect(() => {
    const fetchTokenData = async () => {
      const { error, data } = await AUTH.verifyToken(token)
      if (error) {
        toast.error("Your token has been expired please try again");
        router.push('/signup');
      }
      if (data) {
        const { password, email } = data.payload.sub
        setPassword(password)
        setValue("companyEmail",email)
        setValue("adminEmail",email)
      }
    }
    fetchTokenData()
  }, [token])

const handleInputChange = (e) => {
  const { name, value, type } = e.target;
  if (type === "radio") {
    setValue(name, value, { shouldValidate: true, shouldDirty: true });
  } else {
    setValue(name, value, { shouldValidate: true, shouldDirty: true });
  }
};


const handleArrayChange = (arrayName, value) => {
 setWorkflowError("")
  const currentArray = watch(arrayName) || [];

  const updatedArray = currentArray.includes(value)
    ? currentArray.filter(item => item !== value) 
    : [...currentArray, value]; 
  setValue(arrayName, updatedArray, { shouldValidate: true, shouldDirty: true });
};

const handleNotificationChange = (channel) => {
  const currentPrefs = watch("notificationPreferences") || {};
  const updatedPrefs = {
    ...currentPrefs,
    [channel]: !currentPrefs[channel],
  };
  setValue("notificationPreferences", updatedPrefs, {
    shouldValidate: true,
    shouldDirty: true,
  });
  setLoading(false);
};

const handleFormData = async () => {
  const isStepValid = await trigger();
  setWorkflowError("")

  if (isStepValid) {
    if(currentStep === 3 && formData.primaryWorkflowTypes.length === 0){
      setWorkflowError("Please select at least one workflow type");
      return
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit(async (formData) => {
        try {
          setLoading(true); 

          const userPayload = {
            name: formData.userName,
            email: formData.companyEmail,
            password: password, 
            isEmailVerified: true,
          };

          // Create user
          const { data, error } = await AUTH.createUser(userPayload);

          if (error) {
            setLoading(false);
            toast.error("Email already in use. Try another one.");
            router.push("/signup");
            return;
          }
          localStorage.setItem("accessToken", data.tokens.access.token);
          localStorage.setItem("refreshToken", data.tokens.refresh.token);

          const { data: workspaceData, error: workspaceError } =
            await WORKSPACE.createWorkspace({
              ...formData,
              adminId: data.user._id,
            });

          if (workspaceError) {
            setLoading(false);
            toast.error("Something went wrong! Please try again.");
            router.push("/signup");
            return;
          }
          setUser(data.user)
          setWorkspace(workspaceData.workspace)
          setLoading(false); 
          router.push("/dashboard");
        } catch (err) {
          setLoading(false);
          toast.error("Unexpected error occurred.");
          console.error(err);
        }
      })();
    }
  }
};



  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getStepProgress = () => {
    return `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white">
      <Toaster duration={4000} position="top-right" />

      {/* Header */}
      <header className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <FiBriefcase className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WorkflowPro</h1>
                <p className="text-sm text-gray-600">Company Setup Wizard</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-linear-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                style={{ width: getStepProgress() }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Headers */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {currentStep === 1 && "Company Information"}
            {currentStep === 2 && "Company Details"}
            {currentStep === 3 && "Workflow Setup"}
            {currentStep === 4 && "Team Configuration"}
          </h2>
          <p className="text-gray-600">
            {currentStep === 1 && "Tell us about your company"}
            {currentStep === 2 && "Complete your company profile"}
            {currentStep === 3 && "Configure your workflow preferences"}
            {currentStep === 4 && "Set up your team and notifications"}
          </p>
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 sm:p-8">
          {/* Step 1: Basic Company Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="userName"
                      {...register("userName")}
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      placeholder="Enter company name"
                      required
                    />
                  </div>
               <p className="text-red-500 text-sm mt-2">{errors.userName?.message}</p>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="companyName"
                      {...register("companyName")}
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                 <p className="text-red-500 text-sm mt-2">{errors.companyName?.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Type *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBriefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="companyType"
                      {...register("companyType")}
                      value={formData.companyType}
                      onChange={handleInputChange}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select company type</option>
                      {COMPANY_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                 <p className="text-red-500 text-sm mt-2">{errors.companyType?.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTrendingUp className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="industry"
                      {...register("industry")}
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select industry</option>
                      {INDUSTRIES.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                 <p className="text-red-500 text-sm mt-2">{errors.industry?.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHash className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="companyEmail"
                      disabled
                      value={formData.companyEmail || " "}
                      onChange={handleInputChange}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      placeholder="contact@company.com"
                      required
                    />
                  </div>
                 <p className="text-red-500 text-sm mt-2">{errors.companyEmail?.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    {...register("phoneNumber")}
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                 <p className="text-red-500 text-sm mt-2">{errors.phoneNumber?.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="website"
                      {...register("website")}
                      value={formData.website}
                      onChange={handleInputChange}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      placeholder="https://company.com"
                    />
                  </div>
                 <p className="text-red-500 text-sm mt-2">{errors.website?.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Founded
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="foundedYear"
                      {...register("foundedYear")}
                      value={formData.foundedYear}
                      onChange={handleInputChange}
                      min="1800"
                      max={new Date().getFullYear()}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      placeholder="2020"
                    />
                  </div>
                 <p className="text-red-500 text-sm mt-2">{errors.foundedYear?.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Company Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Count *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUsers className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="employeeCount"
                      {...register("employeeCount")}
                      value={formData.employeeCount}
                      onChange={handleInputChange}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select range</option>
                      {EMPLOYEE_RANGES.map(range => (
                        <option key={range} value={range}>{range} employees</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-red-500 text-sm mt-2">{errors.employeeCount?.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headquarters Location *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="headquarters"
                      {...register("headquarters")}
                      value={formData.headquarters}
                      onChange={handleInputChange}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      placeholder="City, Country"
                      required
                    />
                  </div>
                  <p className="text-red-500 text-sm mt-2">{errors.headquarters?.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  >
                    {Intl.supportedValuesOf('timeZone').map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                 <p className="text-red-500 text-sm mt-2">{errors.timezone?.message}</p>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Currency *
                  </label>
                  <select
                    name="currency"
                    {...register("currency")}
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                  <p className="text-red-500 text-sm mt-2">{errors.currency?.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID / VAT Number
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    placeholder="Enter tax identification number"
                  />
                 <p className="text-red-500 text-sm mt-2">{errors.taxId?.message}</p>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Registration Number
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    placeholder="Enter registration number"
                  />
                </div>
                 <p className="text-red-500 text-sm mt-2">{errors.registrationNumber?.message}</p>

              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start space-x-3">
                  <FiShield className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">
                      Your company information is stored securely in MongoDB with enterprise-grade encryption.
                      This data helps us customize your workflow management experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Workflow Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  What types of workflows will you be managing? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {workflowTypes.map(type => (
                    <div
                      key={type}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${formData.primaryWorkflowTypes?.includes(type)
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-300 hover:border-amber-300'
                        }`}
                      onClick={() => handleArrayChange('primaryWorkflowTypes', type)}
                    >
                      <div className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${formData.primaryWorkflowTypes?.includes(type)
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-gray-400'
                        }`}>
                        {formData.primaryWorkflowTypes?.includes(type) && (
                          <FiCheck className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{type}</span>
                    </div>
                  ))}
                </div>
                <p className="text-red-500 text-sm mt-2">{workflowError}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected number of workflows
                  </label>
                  <select
                    {...register("expectedWorkflows")}
                    name="expectedWorkflows"
                    value={formData.expectedWorkflows}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  >
                    <option value="">Select range</option>
                    <option value="1-10">1-10 workflows</option>
                    <option value="11-50">11-50 workflows</option>
                    <option value="51-200">51-200 workflows</option>
                    <option value="200+">200+ workflows</option>
                  </select>
                 <p className="text-red-500 text-sm mt-2">{errors.expectedWorkflows?.message}</p>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Automation Priority
                  </label>
                  <div className="flex space-x-4">
                    {['low', 'medium', 'high'].map(level => (
                      <label key={level} className="flex items-center">
                        <input
                          type="radio"
                          name="automationPriority"
                          value={level}
                          defaultChecked={level === 'medium'}
                          checked={formData.automationPriority === level}
                          onChange={handleInputChange}
                          // {...register("automationPriority")}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{level}</span>
                      </label>
                    ))}
                  </div>

                </div>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Integration Needs (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {integrationOptions.map(integration => (
                    <button
                      key={integration}
                      type="button"
                      onClick={() => handleArrayChange('integrationNeeds', integration)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${formData.integrationNeeds?.includes(integration)
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        }`}
                    >
                      {integration}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* <div className="flex items-center">
                <input
                  id="complianceRequired"
                  name="complianceRequired"
                  type="checkbox"
                  checked={formData.complianceRequired}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="complianceRequired" className="ml-2 block text-sm text-gray-700">
                  We require compliance tracking (GDPR, HIPAA, SOC2, etc.)
                </label>
              </div> */}

              <div className="p-4 bg-linear-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                <div className="flex items-start space-x-3">
                  <FiZap className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">AI-Powered Suggestions</p>
                    <p className="text-xs text-gray-600">
                      Based on your selections, our AI will suggest optimal workflow structures and automation opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Team Setup */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Team Size
                  </label>
                  <select
                    name="initialTeamSize"
                    value={formData.initialTeamSize}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  >
                    <option value="1">Just me (Admin)</option>
                    <option value="2-5">2-5 team members</option>
                    <option value="6-20">6-20 team members</option>
                    <option value="21-50">21-50 team members</option>
                    <option value="50+">50+ team members</option>
                  </select>
                 <p className="text-red-500 text-sm mt-2">{errors.initialTeamSize?.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email for Notifications *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHash className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="adminEmail"
                      disabled
                      value={formData.adminEmail}
                      onChange={handleInputChange}
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      placeholder="admin@company.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Notification Preferences
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  { }
                  {Object.entries(formData?.notificationPreferences || {}).map(([channel, enabled]) => (
                    <div
                      key={channel}
                      className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-amber-300 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${enabled ? 'bg-amber-100' : 'bg-gray-100'
                          }`}>
                          <FiLayers className={`h-5 w-5 ${enabled ? 'text-amber-600' : 'text-gray-400'
                            }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 capitalize">{channel}</p>
                          <p className="text-xs text-gray-500">
                            {channel === 'email' && 'Email notifications'}
                            {channel === 'slack' && 'Slack notifications'}
                            {channel === 'teams' && 'Microsoft Teams'}
                            {channel === 'inApp' && 'In-app notifications'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange(channel)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${enabled ? 'bg-amber-600' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-3">
                  <FiHelpCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">
                      Don&apos;t worry about getting everything perfect now. You can always invite more team members,
                      change notification settings, and add new workflows from your dashboard later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <FiArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              type="button"
              onClick={handleFormData}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting up...
                </>
              ) : currentStep === totalSteps ? (
                <>
                  Complete Setup
                  <FiCheck className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next Step
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="mt-8">
          <div className="flex justify-between">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step === currentStep
                  ? 'bg-amber-500 text-white'
                  : step < currentStep
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-gray-100 text-gray-400'
                  }`}>
                  {step < currentStep ? <FiCheck className="w-5 h-5" /> : step}
                </div>
                <span className={`text-xs font-medium ${step === currentStep ? 'text-amber-600' : 'text-gray-500'
                  }`}>
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Details'}
                  {step === 3 && 'Workflows'}
                  {step === 4 && 'Team'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            Your data is securely stored in MongoDB with enterprise encryption.
            All information is used solely to enhance your workflow management experience.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            WorkflowPro • Enterprise Workflow Management Platform
          </p>
        </div>
      </footer>
    </div>
  );
}