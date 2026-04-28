"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  FiZap, 
  FiSave, 
  FiSearch, 
  FiMaximize2, 
  FiMinimize2, 
  FiMousePointer, 
  FiLayers,
  FiPlay,
  FiCheckCircle,
  FiMinus,
  FiMaximize,
  FiUser,
  FiClock,
  FiGrid,
  FiChevronDown,
  FiPlus,
  FiActivity,
  FiArrowRight
} from "react-icons/fi";
import { processAPI } from "../../api/processAPI";
import toast from "react-hot-toast";

// ─── Sortable Node Component (Horizontal) ──────────────────────────────────────

function StepNode({ step, index, totalSteps }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex items-center shrink-0"
    >
      {/* Node Card */}
      <div 
        {...attributes} 
        {...listeners}
        className={`w-[320px] bg-[#1a1c1e] border-2 ${isDragging ? 'border-amber-500 ring-8 ring-amber-500/10' : 'border-gray-800 hover:border-amber-500/50'} rounded-[2rem] p-6 shadow-2xl transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden`}
      >
        {/* Progress Glow */}
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
               <span className="text-xs font-black text-white">{step.order}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-amber-500">Node Logic</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase">Sequence Segment</span>
            </div>
          </div>
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
        </div>

        <h4 className="font-black text-gray-100 text-base mb-2 group-hover:text-amber-400 transition-colors uppercase tracking-tight italic">
          {step.title || "Undefined Process"}
        </h4>
        
        <div className="bg-black/40 rounded-xl p-3 border border-white/5 mb-6">
           <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-2">
             {step.description || "Deploying administrative governance protocols for this segment."}
           </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
           <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-white/10 shadow-inner">
                 <FiUser className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Assignee</span>
                 <span className="text-[11px] font-black text-gray-300 truncate w-24">
                   {typeof step.assignee === 'object' ? step.assignee.name : "Core System"}
                 </span>
              </div>
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/5 rounded-lg border border-amber-500/20">
              <FiClock className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] font-black text-amber-400">{step.timeEstimate || "60M"}</span>
           </div>
        </div>
      </div>

      {/* Senior-Level Complete Arrow (Horizontal) */}
      {index < totalSteps - 1 && (
        <div className="w-24 flex items-center justify-center">
           <div className="w-full h-[3px] bg-gradient-to-r from-amber-500 to-amber-500/10 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-[#1a1c1e] border-2 border-amber-500/50 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                 <FiArrowRight className="w-2 h-2 text-amber-500" />
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default function ProcessBuilderPage() {
  const [processes, setProcesses] = useState([]);
  const [selectedProcessId, setSelectedProcessId] = useState("");
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.1, 0.5));

  useEffect(() => {
    const fetchProcesses = async () => {
      const result = await processAPI.getWorkspaceProcesses();
      if (result.success) setProcesses(result.data);
    };
    fetchProcesses();
  }, []);

  useEffect(() => {
    if (!selectedProcessId) return;
    const loadDetails = async () => {
      setIsLoading(true);
      const result = await processAPI.getProcess(selectedProcessId);
      if (result.success) {
        const proc = result.data;
        setSelectedProcess(proc);
        const formattedSteps = (proc.steps || []).map((s, idx) => ({
          ...s,
          id: s._id || `step-${idx}-${Date.now()}`,
          order: s.sequenceNo || s.order || idx + 1
        })).sort((a,b) => a.order - b.order);
        setSteps(formattedSteps);
      }
      setIsLoading(false);
    };
    loadDetails();
  }, [selectedProcessId]);

  const handleDragStart = (e) => setActiveId(e.active.id);

  const handleDragEnd = (e) => {
    const { active, over } = e;
    setActiveId(null);
    if (active.id !== over?.id) {
      setSteps((items) => {
        const oldIdx = items.findIndex((i) => i.id === active.id);
        const newIdx = items.findIndex((i) => i.id === over.id);
        const newOrder = arrayMove(items, oldIdx, newIdx);
        return newOrder.map((step, idx) => ({ ...step, order: idx + 1 }));
      });
    }
  };

  const saveSequence = async () => {
    if (!selectedProcessId) return;
    setIsSaving(true);
    try {
      const updatedData = {
        ...selectedProcess,
        steps: steps.map(s => ({ ...s, sequenceNo: s.order }))
      };
      const result = await processAPI.updateProcess(selectedProcessId, updatedData);
      if (result.success) toast.success("Neural architecture saved!");
      else toast.error(result.error || "Save failed");
    } catch (e) { toast.error("Sync error"); }
    finally { setIsSaving(false); }
  };

  const activeStep = useMemo(() => steps.find(s => s.id === activeId), [activeId, steps]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-[#0a0a0b] -m-8 p-8 overflow-hidden font-sans">
      {/* HUD Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 relative z-20">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.4)] border border-amber-400/20">
              <FiZap className="w-8 h-8 text-white" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">Process Canvas <span className="text-amber-500">Pro</span></h1>
              <div className="flex items-center gap-3 mt-2">
                 <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgb(245,158,11)]" />
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">Admin Authorization Active</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4 bg-[#141416] p-2.5 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-3xl">
          <div className="relative group min-w-[320px]">
            <FiLayers className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" />
            <select 
              value={selectedProcessId}
              onChange={(e) => setSelectedProcessId(e.target.value)}
              className="w-full pl-14 pr-12 py-4 bg-black/20 text-gray-200 font-black text-xs uppercase tracking-widest outline-none cursor-pointer appearance-none rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all"
            >
              <option value="" className="bg-[#141416]">Initialize Logic Core...</option>
              {processes.map(p => (
                <option key={p._id} value={p._id} className="bg-[#141416]">{p.name}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600" />
          </div>

          <button 
            onClick={saveSequence}
            disabled={!selectedProcessId || isSaving}
            className="flex items-center gap-3 px-8 py-4 bg-amber-500 text-black rounded-2xl hover:bg-amber-400 transition-all font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20 disabled:opacity-30"
          >
            {isSaving ? <FiActivity className="animate-spin" /> : <FiSave className="w-4 h-4" />}
            Sync Workflow
          </button>
        </div>
      </div>

      {/* Main Visual Arena */}
      <div className="flex-1 relative bg-[#0d0d0f] rounded-[4rem] border border-white/5 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Premium Grid Suite */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: `60px 60px`,
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
            backgroundSize: `12px 12px`,
          }}
        />

        {/* Global Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
        
        {/* Floating Side Tools (Aligned with your image) */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
          <button className="w-12 h-12 bg-[#1a1c1e] border border-white/10 rounded-2xl flex items-center justify-center text-gray-500 hover:text-amber-500 transition-all shadow-2xl">
             <FiMousePointer className="w-5 h-5" />
          </button>
          <button onClick={handleZoomIn} className="w-12 h-12 bg-[#1a1c1e] border border-white/10 rounded-2xl flex items-center justify-center text-amber-500 hover:bg-amber-500/10 transition-all shadow-2xl">
             <FiPlus className="w-5 h-5" />
          </button>
          <button onClick={handleZoomOut} className="w-12 h-12 bg-[#1a1c1e] border border-white/10 rounded-2xl flex items-center justify-center text-gray-500 hover:text-amber-500 transition-all shadow-2xl">
             <FiMinus className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-[#1a1c1e] border border-white/10 rounded-2xl flex items-center justify-center text-gray-500 hover:text-amber-500 transition-all shadow-2xl">
             <FiMaximize className="w-5 h-5" />
          </button>
        </div>

        {/* The Node Canvas (Horizontal Scroller) */}
        <div className="absolute inset-0 overflow-x-auto overflow-y-hidden p-16 lg:p-32 scrollbar-none flex items-center relative">
          <div 
            className="flex items-center gap-0 transition-transform duration-300"
            style={{ transform: `scale(${zoomScale})`, transformOrigin: 'center left' }}
          >
          {!selectedProcessId ? (
            <div className="w-full flex flex-col items-center justify-center text-center">
              <div className="w-40 h-40 bg-white/5 rounded-[3rem] flex items-center justify-center mb-10 border-2 border-dashed border-white/10 relative group">
                 <FiLayers className="w-16 h-16 text-white/10 group-hover:text-amber-500/20 transition-colors" />
                 <div className="absolute inset-0 bg-amber-500/[0.03] blur-3xl rounded-full" />
              </div>
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Structural Canvas</h3>
              <p className="max-w-md text-gray-600 mt-6 text-xs font-bold uppercase tracking-[0.3em] leading-loose">Deploy a logic object from the header terminal to begin reordering neural pathways.</p>
            </div>
          ) : isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
               <div className="w-24 h-24 border-[6px] border-amber-500/5 border-t-amber-500 rounded-full animate-spin mb-10 shadow-[0_0_50px_rgba(245,158,11,0.2)]" />
               <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.6em]">Syncing Logical Matrix...</p>
            </div>
          ) : (
            <div className="flex items-center gap-0">
               {/* Start Terminal */}
               <div className="flex items-center shrink-0">
                  <div className="flex flex-col items-center">
                     <div className="w-20 h-20 bg-green-500/5 border border-green-500/20 rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                        <FiPlay className="text-green-500 h-8 w-8 fill-green-500/10" />
                     </div>
                     <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-green-500/50">Initiate</span>
                  </div>
                  <div className="w-20 h-[3px] bg-gradient-to-r from-green-500/20 to-amber-500/20" />
               </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <SortableContext items={steps.map(s => s.id)} strategy={horizontalListSortingStrategy}>
                  <div className="flex items-center">
                    {steps.map((step, index) => (
                      <StepNode key={step.id} step={step} index={index} totalSteps={steps.length} />
                    ))}
                  </div>
                </SortableContext>
                
                <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.3' } } }) }}>
                  {activeId ? (
                    <div className="w-[320px] bg-[#1a1c1e] border-2 border-amber-500 rounded-[2rem] p-6 shadow-[0_0_60px_rgba(245,158,11,0.4)] ring-8 ring-amber-500/20 cursor-grabbing">
                       <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-black text-white text-xs">{activeStep?.order}</div>
                          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-amber-500">Node Decoupled</span>
                       </div>
                       <h4 className="font-black text-gray-100 text-base italic uppercase tracking-tighter">
                         {activeStep?.title}
                       </h4>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>

               {/* Finish Terminal */}
               <div className="flex items-center shrink-0">
                  <div className="w-20 h-[3px] bg-gradient-to-r from-amber-500/20 to-purple-500/20" />
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-purple-500/5 border border-purple-500/20 rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.1)] group">
                       <FiCheckCircle className="text-purple-500 h-8 w-8 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-purple-500/50">Terminal</span>
                  </div>
               </div>
            </div>
          )}
          </div>
        </div>

        {/* Smaller Node Diagnostics HUD (Bottom Right) */}
        {selectedProcessId && !isLoading && (
          <div className="absolute right-8 bottom-8 bg-[#141416]/90 backdrop-blur-2xl border border-white/5 rounded-2xl p-5 shadow-3xl min-w-[220px] transition-all z-40">
             <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Diagnostics</span>
                <FiActivity className="text-amber-500 w-4 h-4 animate-pulse" />
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">Nodes</span>
                      <span className="text-xl font-black text-white leading-none mt-1 italic">{steps.length}</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">Time</span>
                      <span className="text-md font-black text-amber-500 leading-none mt-1 italic">14.5h</span>
                   </div>
                </div>
                
                <div className="space-y-1.5">
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
