import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  ArrowRight, 
  Settings, 
  Sparkles, 
  DollarSign, 
  Wrench, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  X,
  Play
} from 'lucide-react';
import { IndustryData, FrictionPoint, FrictionCategory } from '../data/mockData';
import { cn } from './ui/utils';

interface FrictionListProps {
  data: IndustryData;
  filterCategory?: FrictionCategory | null;
  onOpenChatWithTopic?: (topic: string) => void;
}

export function FrictionList({ data, filterCategory, onOpenChatWithTopic }: FrictionListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedToolPoint, setSelectedToolPoint] = useState<FrictionPoint | null>(null);

  // Filter if category is selected in the Heatmap
  const filteredPoints = filterCategory
    ? data.frictionPoints.filter((p) => p.category === filterCategory)
    : data.frictionPoints;

  // Sort by opportunity score descending
  const sortedPoints = [...filteredPoints].sort((a, b) => b.opportunityScore - a.opportunityScore);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8">
      {/* Enhancement 5: Top 3 High ROI Fixes */}
      {data.topHighRoiFixes && data.topHighRoiFixes.length > 0 && !filterCategory && (
        <div className="bg-gradient-to-br from-zinc-950/40 via-zinc-900/60 to-zinc-950 border border-zinc-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-zinc-500/20 text-zinc-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                Top Highest ROI Immediate Fixes
              </h3>
              <p className="text-xs text-zinc-400">
                Prioritized executive action roadmap for maximum revenue recovery
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {data.topHighRoiFixes.map((fix, idx) => (
              <div
                key={idx}
                className="bg-zinc-950/80 border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-400 px-2 py-0.5 rounded-md bg-zinc-500/10 border border-zinc-500/20">
                      {fix.roi} Projected ROI
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">{fix.timeframe}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1.5">{fix.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{fix.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">Rank #{idx + 1} Priority</span>
                  {onOpenChatWithTopic && (
                    <button
                      type="button"
                      onClick={() => onOpenChatWithTopic(`How do we implement "${fix.title}"? Give me a complete execution blueprint.`)}
                      className="text-xs text-zinc-400 hover:text-zinc-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      Consult AI <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Friction Points List */}
      <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-zinc-400" />
              Categorized Friction Points & Opportunity Scores
            </h3>
            <p className="text-xs text-zinc-400">
              Quantified operational leaks scored across 5 dimensions (Revenue loss, Time wasted, Automation readiness, Difficulty to fix, ROI)
            </p>
          </div>
          <span className="text-xs text-zinc-400 self-start sm:self-auto">
            Showing {sortedPoints.length} {filterCategory ? `in ${filterCategory}` : 'friction points'}
          </span>
        </div>

        <div className="space-y-4">
          {sortedPoints.map((point, i) => {
            const isExpanded = expandedId === point.id;

            return (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "group relative overflow-hidden bg-zinc-950 border rounded-xl p-4 sm:p-5 transition-all",
                  isExpanded
                    ? "border-zinc-500/50 shadow-lg shadow-zinc-500/5"
                    : "border-white/5 hover:border-zinc-500/30"
                )}
              >
                <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
                  {/* Left info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider",
                          point.severity === 'High'
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : point.severity === 'Moderate'
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                        )}
                      >
                        {point.category}
                      </span>
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            point.severity === 'High'
                              ? 'bg-red-400'
                              : point.severity === 'Moderate'
                              ? 'bg-amber-400'
                              : 'bg-zinc-400'
                          )}
                        />
                        {point.severity} Severity
                      </span>
                      {point.estimatedAnnualSavings && (
                        <span className="text-xs text-zinc-400/90 font-medium bg-zinc-500/5 px-2 py-0.5 rounded border border-zinc-500/10 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Est. ~${(point.estimatedAnnualSavings / 1000).toFixed(0)}k/yr leak
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-semibold text-white mb-1.5 leading-snug">
                      {point.problem}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2">
                      <strong className="text-zinc-300">Root Cause:</strong> {point.cause}
                    </p>
                  </div>

                  {/* Right metrics & tool trigger */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full lg:w-auto shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    {/* Opportunity Score Block */}
                    <div className="flex flex-col items-center justify-center px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl min-w-[80px]">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        ROI Score
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-zinc-400">
                        {point.opportunityScore}
                      </span>
                    </div>

                    {/* Micro Tool Button */}
                    <div className="flex-1 sm:flex-none">
                      <button
                        type="button"
                        onClick={() => setSelectedToolPoint(point)}
                        className="w-full flex items-center justify-between gap-3 bg-zinc-500/10 hover:bg-zinc-500/20 border border-zinc-500/30 rounded-xl px-4 py-2.5 transition-all text-left group/btn cursor-pointer"
                      >
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-zinc-500/80 font-bold flex items-center gap-1">
                            <Wrench className="w-3 h-3" />
                            Micro-Tool Solution
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-zinc-300 group-hover/btn:text-zinc-200">
                            {point.suggestedTool}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* Expand/Collapse Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(point.id)}
                      className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
                      title="Toggle detailed breakdown"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/10 space-y-4"
                    >
                      {/* 5-Dimensional Opportunity Scoring Breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
                          <span className="text-zinc-500 block mb-0.5">Revenue Impact</span>
                          <span className="font-bold text-white text-sm">{point.revenueImpact} / 10</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
                          <span className="text-zinc-500 block mb-0.5">Automation Readiness</span>
                          <span className="font-bold text-zinc-400 text-sm">
                            {point.automationReadiness} / 10
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
                          <span className="text-zinc-500 block mb-0.5">Difficulty to Fix</span>
                          <span className="font-bold text-zinc-300 text-sm">{point.difficultyToFix} / 10</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
                          <span className="text-zinc-500 block mb-0.5">Recommended System</span>
                          <span className="font-semibold text-zinc-400 text-xs truncate block">
                            {point.suggestedSolution}
                          </span>
                        </div>
                      </div>

                      {/* Concrete Action Details */}
                      {point.actionDetails && (
                        <div className="p-3 rounded-lg bg-zinc-500/5 border border-zinc-500/15 text-xs text-zinc-300 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-zinc-400 font-semibold">Immediate Fix Action: </strong>
                            {point.actionDetails}
                          </div>
                        </div>
                      )}

                      {/* Chat Copilot Quick Prompt */}
                      {onOpenChatWithTopic && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenChatWithTopic(
                                `Help me fix "${point.problem}". My business currently has ${point.cause}. How should we implement ${point.suggestedSolution}?`
                              )
                            }
                            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                            Consult Friction Radar AI on this issue
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Layer 7: Micro Tool Ecosystem Modal */}
      <AnimatePresence>
        {selectedToolPoint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setSelectedToolPoint(null)}
                className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                <Wrench className="w-4 h-4" />
                Micro-Tool Solution Blueprint
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {selectedToolPoint.suggestedTool}
              </h3>

              <div className="bg-zinc-950 border border-white/10 rounded-xl p-4 mb-4 space-y-2 text-xs">
                <div>
                  <span className="text-zinc-500 uppercase font-semibold text-[10px] block">
                    Target Friction Point
                  </span>
                  <span className="text-zinc-200 font-medium">{selectedToolPoint.problem}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase font-semibold text-[10px] block">
                    System Category
                  </span>
                  <span className="text-zinc-400 font-medium">
                    {selectedToolPoint.suggestedSolution}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase font-semibold text-[10px] block">
                    Estimated Annual Recovered Cash
                  </span>
                  <span className="text-white font-bold">
                    ${(selectedToolPoint.estimatedAnnualSavings || 45000).toLocaleString()} / year
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 mb-6 leading-relaxed">
                {selectedToolPoint.actionDetails ||
                  `Deploying ${selectedToolPoint.suggestedTool} plugs this operational hole automatically, turning manual delays into a high-speed self-service workflow.`}
              </p>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedToolPoint(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Close
                </button>

                {onOpenChatWithTopic && (
                  <button
                    type="button"
                    onClick={() => {
                      const tool = selectedToolPoint.suggestedTool;
                      const prob = selectedToolPoint.problem;
                      setSelectedToolPoint(null);
                      onOpenChatWithTopic(
                        `Show me the exact system architecture and workflow steps to build or deploy the "${tool}" for fixing "${prob}".`
                      );
                    }}
                    className="flex items-center gap-2 bg-zinc-500 hover:bg-zinc-400 text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-zinc-500/20 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Generate Tool Implementation Plan
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
