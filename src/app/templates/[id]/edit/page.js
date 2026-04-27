"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { templateAPI } from "../../../api/templateAPI";
import {
  FiArrowLeft,
  FiSave,
  FiPlus,
  FiTrash2,
  FiSettings,
  FiLayers,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

const CATEGORIES = [
  "Onboarding", "HR", "Finance", "IT", "Marketing", "Sales", "Operations", "Customer Support", "Legal"
];

export default function EditTemplatePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    status: "draft",
    steps: []
  });

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        const result = await templateAPI.getTemplate(id);
        if (result.success) {
          const t = result.data;
          setFormData({
            name: t.name || "",
            description: t.description || "",
            category: t.category || "",
            status: t.status || "draft",
            steps: (t.steps || []).map((s, i) => ({
              ...s,
              id: Math.random().toString(36).substr(2, 9),
              order: s.sequence || s.order || i + 1
            }))
          });
        } else {
          setError(result.error || "Failed to load template");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchTemplate();
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: Math.random().toString(36).substr(2, 9),
          title: "",
          description: "",
          timeEstimate: "1d",
          order: prev.steps.length + 1
        }
      ]
    }));
  };

  const removeStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    newSteps.forEach((s, idx) => s.order = idx + 1);
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const moveStep = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === formData.steps.length - 1) return;
    
    const newSteps = [...formData.steps];
    const targetIndex = index + direction;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    
    newSteps.forEach((s, idx) => s.order = idx + 1);
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      setError("Template name is required");
      return;
    }
    if (!formData.category) {
      setError("Category is required");
      return;
    }
    if (formData.steps.some((s) => !s.title)) {
      setError("All steps must have a title");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await templateAPI.updateTemplate(id, formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push(`/templates/${id}`), 1000);
      } else {
        setError(result.error || "Failed to update template");
      }
    } catch(err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href={`/templates/${id}`} className="text-sm font-medium text-gray-500 hover:text-amber-600 flex items-center mb-2">
            <FiArrowLeft className="mr-1" /> Back to Template
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Template</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg shadow-md hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 transition-all"
        >
          {isSaving ? <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <FiSave />}
          Save Changes
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200">
          Template updated successfully! Redirecting...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Basics */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiSettings className="text-amber-500" /> Basic Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                >
                  <option value="draft">Draft (Hidden from Library)</option>
                  <option value="active">Active (Available to use)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Steps */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiLayers className="text-amber-500" /> Predefined Steps
              </h2>
              <button
                onClick={addStep}
                className="text-sm flex items-center gap-1 text-amber-600 font-medium hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors border border-amber-200"
              >
                <FiPlus /> Add Step
              </button>
            </div>

            <div className="space-y-4">
              {formData.steps.map((step, index) => (
                <div key={step.id} className="relative p-5 border border-gray-200 rounded-xl bg-gray-50 flex gap-4">
                  <div className="flex flex-col items-center gap-2 border-r border-gray-200 pr-4">
                    <button onClick={() => moveStep(index, -1)} disabled={index === 0} className="text-gray-400 hover:text-amber-600 disabled:opacity-30">
                      <FiChevronUp size={20} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-white border border-amber-200 flex items-center justify-center font-bold text-amber-600">
                      {step.order}
                    </div>
                    <button onClick={() => moveStep(index, 1)} disabled={index === formData.steps.length - 1} className="text-gray-400 hover:text-amber-600 disabled:opacity-30">
                      <FiChevronDown size={20} />
                    </button>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between gap-3">
                       <input
                        type="text"
                        placeholder="Step Title"
                        value={step.title}
                        onChange={(e) => handleStepChange(index, "title", e.target.value)}
                        className="flex-1 border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Est. Time (e.g. 1d, 4h)"
                        value={step.timeEstimate}
                        onChange={(e) => handleStepChange(index, "timeEstimate", e.target.value)}
                        className="w-32 border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                      <button onClick={() => removeStep(index)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded transition-colors">
                        <FiTrash2 />
                      </button>
                    </div>
                     <textarea
                      placeholder="Step Description..."
                      value={step.description}
                      onChange={(e) => handleStepChange(index, "description", e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                    />
                  </div>
                </div>
              ))}
              {formData.steps.length === 0 && (
                <div className="text-center py-10 text-gray-500 border border-dashed rounded-xl">
                  No steps defined. Add a step to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
