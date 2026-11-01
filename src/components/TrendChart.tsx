import { motion } from 'motion/react';
import { TrendingDown, LineChart as ChartIcon } from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { IndustryData } from '../data/mockData';

interface TrendChartProps {
  data: IndustryData;
}

export function TrendChart({ data }: TrendChartProps) {
  // Generate realistic trend data if not already present
  const trendData = data.trendData || [
    { month: 'Month 1', frictionScore: Math.min(100, data.efficiencyScore + 22), revenueLeak: Math.round(data.revenueLeak * 1.25) },
    { month: 'Month 2', frictionScore: Math.min(100, data.efficiencyScore + 16), revenueLeak: Math.round(data.revenueLeak * 1.15) },
    { month: 'Month 3', frictionScore: Math.min(100, data.efficiencyScore + 10), revenueLeak: Math.round(data.revenueLeak * 1.05) },
    { month: 'Current', frictionScore: data.efficiencyScore, revenueLeak: data.revenueLeak },
    { month: 'Projected (+3M)', frictionScore: Math.max(20, data.efficiencyScore - 18), revenueLeak: Math.round(data.revenueLeak * 0.70) },
    { month: 'Projected (+6M)', frictionScore: Math.max(10, data.efficiencyScore - 32), revenueLeak: Math.round(data.revenueLeak * 0.45) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ChartIcon className="w-4 h-4 text-zinc-400" />
            Operational Friction & Revenue Leak Trend Analysis
          </h3>
          <p className="text-xs text-zinc-400">
            Historical trajectory and 6-month projected recovery curve following automated friction mitigation.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 px-3 py-1.5 rounded-xl font-medium self-start sm:self-auto">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Projected -55% Friction Reduction</span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis 
              dataKey="month" 
              stroke="#71717a" 
              fontSize={12} 
              tickLine={false} 
            />
            <YAxis 
              yAxisId="left" 
              stroke="#a1a1aa" 
              fontSize={12} 
              tickLine={false} 
              domain={[0, 100]}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#ef4444" 
              fontSize={12} 
              tickLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#09090b', 
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                color: '#fff',
                fontSize: '12px'
              }}
              formatter={(value: any, name: string) => {
                if (name === 'frictionScore') return [`${value} / 100`, 'Friction Index'];
                if (name === 'revenueLeak') return [`$${value.toLocaleString()}`, 'Annual Revenue Leak'];
                return [value, name];
              }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="frictionScore" 
              name="frictionScore"
              stroke="#a1a1aa" 
              strokeWidth={3} 
              dot={{ fill: '#a1a1aa', r: 4 }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="revenueLeak" 
              name="revenueLeak"
              stroke="#ef4444" 
              strokeWidth={2} 
              strokeDasharray="4 4"
              dot={{ fill: '#ef4444', r: 3 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-zinc-500 rounded-full" />
          <span>Friction Index (Lower is better)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-red-500 rounded-full border-dashed" />
          <span>Revenue Leak ($ / Year)</span>
        </div>
      </div>
    </motion.div>
  );
}
