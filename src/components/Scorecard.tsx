import { motion } from 'motion/react';
import { Activity, TrendingUp, AlertCircle, BarChart3, Zap } from 'lucide-react';
import { IndustryData } from '../data/mockData';

interface ScorecardProps {
  data: IndustryData;
}

export function Scorecard({ data }: ScorecardProps) {
  const getEfficiencyStatus = (score: number) => {
    if (score >= 80) return { label: 'Optimized', color: 'text-zinc-400 bg-zinc-500/10' };
    if (score >= 65) return { label: 'Moderate Drag', color: 'text-amber-400 bg-amber-500/10' };
    return { label: 'Severe Friction', color: 'text-red-400 bg-red-500/10' };
  };

  const status = getEfficiencyStatus(data.efficiencyScore);

  return (
    <div className="space-y-6 mb-8">
      {/* 3 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-500/10 rounded-xl text-zinc-400 border border-zinc-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Operational Score
              </h3>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {data.efficiencyScore}
            </span>
            <span className="text-sm text-zinc-500 font-medium">/ 100</span>
          </div>

          <p className="text-xs text-zinc-400">
            {data.benchmarkComparison
              ? `Benchmark average is ${data.benchmarkComparison.industryAverageScore}/100 in ${data.industry}`
              : 'Holistic operational & conversion index'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md relative overflow-hidden"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Est. Annual Revenue Leak
            </h3>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl sm:text-5xl font-black text-red-400 tracking-tight">
              ${(data.revenueLeak / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k
            </span>
            <span className="text-xs text-zinc-500 font-medium">/ year</span>
          </div>

          <p className="text-xs text-zinc-400">
            Lost via manual lead routing, uncaptured visitors & quoting lag
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md relative overflow-hidden"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-zinc-500/10 rounded-xl text-zinc-400 border border-zinc-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Potential 12-Mo Recovery
            </h3>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl sm:text-5xl font-black text-zinc-400 tracking-tight">
              ${(data.potentialRecovery / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k
            </span>
            <span className="text-xs text-zinc-500 font-medium">/ year</span>
          </div>

          <p className="text-xs text-zinc-400">
            Recoverable through targeted automation & conversion fixes
          </p>
        </motion.div>
      </div>

      {/* Enhancement 3: Automation Readiness Meter & Benchmark Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Automation Readiness Meter */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-zinc-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Automation Readiness Meter
              </h4>
            </div>
            <span className="text-xs text-zinc-400 font-semibold">
              {data.automationMeter?.immediate || 45}% Immediate
            </span>
          </div>

          {/* Tri-color progress bar */}
          <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden flex mb-3 border border-white/5">
            <div
              style={{ width: `${data.automationMeter?.immediate || 45}%` }}
              className="bg-zinc-500 transition-all duration-500"
              title="Immediate Fixes"
            />
            <div
              style={{ width: `${data.automationMeter?.moderate || 35}%` }}
              className="bg-amber-500 transition-all duration-500"
              title="Moderate Effort"
            />
            <div
              style={{ width: `${data.automationMeter?.complex || 20}%` }}
              className="bg-zinc-700 transition-all duration-500"
              title="Complex Integration"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
              <span>Immediate ({data.automationMeter?.immediate || 45}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Moderate ({data.automationMeter?.moderate || 35}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-600" />
              <span>Complex ({data.automationMeter?.complex || 20}%)</span>
            </div>
          </div>
        </div>

        {/* Benchmark Comparison */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-zinc-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Industry Benchmark Comparison
              </h4>
            </div>
            <span className="text-xs text-zinc-400">
              Percentile: <strong className="text-white">{data.benchmarkComparison?.percentileRank || 58}th</strong>
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Your Diagnostic Score</span>
              <span className="font-semibold text-white">{data.efficiencyScore}/100</span>
            </div>
            <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5">
              <div
                style={{ width: `${data.efficiencyScore}%` }}
                className="h-full bg-zinc-500 rounded-full"
              />
            </div>

            <div className="flex justify-between text-zinc-400 pt-1">
              <span>{data.industry} Average</span>
              <span className="font-semibold text-zinc-400">
                {data.benchmarkComparison?.industryAverageScore || 64}/100
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5">
              <div
                style={{ width: `${data.benchmarkComparison?.industryAverageScore || 64}%` }}
                className="h-full bg-zinc-600 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
