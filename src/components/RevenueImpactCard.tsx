import { motion } from 'motion/react';
import { DollarSign, ShieldAlert, Sparkles, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';
import { IndustryData } from '../data/mockData';

interface RevenueImpactCardProps {
  data: IndustryData;
}

export function RevenueImpactCard({ data }: RevenueImpactCardProps) {
  // Calculate dynamic annual leak & recovery from friction points if available
  const calculatedLeak = data.frictionPoints.reduce((acc, p) => acc + (p.estimatedAnnualSavings || (p.revenueImpact * 12000)), 0);
  const totalLeak = data.revenueLeak > 0 ? data.revenueLeak : calculatedLeak;
  const calculatedRecovery = Math.round(totalLeak * 0.62);
  const potentialRecovery = data.potentialRecovery > 0 ? data.potentialRecovery : calculatedRecovery;

  const highSeverityCount = data.frictionPoints.filter(p => p.severity === 'High').length;
  const moderateSeverityCount = data.frictionPoints.filter(p => p.severity === 'Moderate').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/70 border border-zinc-500/30 rounded-2xl p-6 backdrop-blur-md mb-8 relative overflow-hidden shadow-xl"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 mb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
            <DollarSign className="w-3.5 h-3.5" />
            Financial Impact & Severity Model
          </div>
          <h3 className="text-xl font-bold text-white">Revenue Impact & Recovery Analysis</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1">
            Quantified financial leakage derived from {data.frictionPoints.length} active friction points ({highSeverityCount} High severity, {moderateSeverityCount} Moderate severity).
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-950 border border-white/10 rounded-xl p-4 shrink-0">
          <div className="p-2.5 rounded-lg bg-zinc-500/10 text-zinc-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Net 12-Mo ROI</div>
            <div className="text-xl font-black text-zinc-400">
              {((potentialRecovery / 15000)).toFixed(1)}x Return
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Annual Revenue Leak Breakdown */}
        <div className="bg-zinc-950/80 border border-red-500/20 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Estimated Annual Revenue Leak
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                Active Drain
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                ${totalLeak.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-500 font-medium">/ year</span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Calculated across sales response delays, manual quoting drag, website conversion drop-offs, and administrative friction.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/5 text-xs">
            {data.frictionPoints.slice(0, 2).map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-zinc-400">
                <span className="truncate max-w-[240px]">• {p.problem}</span>
                <span className="font-semibold text-red-400">~${(p.estimatedAnnualSavings || 45000).toLocaleString()}/yr</span>
              </div>
            ))}
          </div>
        </div>

        {/* Potential Recovery Breakdown */}
        <div className="bg-zinc-950/80 border border-zinc-500/20 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Potential Revenue Recovery
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                Recoverable
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl sm:text-5xl font-black text-zinc-400 tracking-tight">
                ${potentialRecovery.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-500 font-medium">/ year</span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Projected annual cash recovered by deploying automated micro-tools and fixing high-priority conversion bottlenecks.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/5 text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Immediate Automation Impact (45%)</span>
              <span className="font-semibold text-zinc-400">+${Math.round(potentialRecovery * 0.45).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Workflow & Quoting Optimization (55%)</span>
              <span className="font-semibold text-zinc-400">+${Math.round(potentialRecovery * 0.55).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
