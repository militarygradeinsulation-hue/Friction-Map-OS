import { motion } from 'motion/react';
import { IndustryData, FrictionCategory } from '../data/mockData';
import { cn } from './ui/utils';
import { Flame, ShieldCheck, AlertCircle } from 'lucide-react';

interface HeatmapProps {
  data: IndustryData;
  selectedCategory?: FrictionCategory | null;
  onSelectCategory?: (category: FrictionCategory | null) => void;
}

export function Heatmap({ data, selectedCategory, onSelectCategory }: HeatmapProps) {
  const categories: FrictionCategory[] = ['Sales', 'Marketing', 'Operations', 'Technology', 'Customer'];

  const getCategoryMetrics = (category: FrictionCategory) => {
    const points = data.frictionPoints.filter((p) => p.category === category);
    if (points.length === 0) {
      return { intensity: 'green', count: 0, avgSeverity: 1, label: 'Low Friction' };
    }
    const avgSeverity =
      points.reduce(
        (acc, p) => acc + (p.severity === 'High' ? 3 : p.severity === 'Moderate' ? 2 : 1),
        0
      ) / points.length;

    if (avgSeverity >= 2.3) return { intensity: 'red', count: points.length, avgSeverity, label: 'Critical Friction' };
    if (avgSeverity >= 1.6) return { intensity: 'yellow', count: points.length, avgSeverity, label: 'Moderate Drag' };
    return { intensity: 'green', count: points.length, avgSeverity, label: 'Low Friction' };
  };

  const intensityColors = {
    red: {
      card: 'bg-red-500/10 border-red-500/40 hover:border-red-500/60',
      activeCard: 'bg-red-500/20 border-red-500 ring-2 ring-red-500/30',
      badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
      dot: 'bg-red-500',
      text: 'text-red-400',
    },
    yellow: {
      card: 'bg-amber-500/10 border-amber-500/40 hover:border-amber-500/60',
      activeCard: 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30',
      badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      dot: 'bg-amber-500',
      text: 'text-amber-400',
    },
    green: {
      card: 'bg-zinc-500/10 border-zinc-500/40 hover:border-zinc-500/60',
      activeCard: 'bg-zinc-500/20 border-zinc-500 ring-2 ring-zinc-500/30',
      badge: 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30',
      dot: 'bg-zinc-500',
      text: 'text-zinc-400',
    },
  };

  return (
    <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-zinc-400" />
            Operational Friction Heatmap
          </h3>
          <p className="text-xs text-zinc-400">
            Interactive visual friction zones. Click any zone to isolate specific bottlenecks.
          </p>
        </div>

        {selectedCategory && onSelectCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs text-zinc-400 hover:underline self-start sm:self-auto cursor-pointer"
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map((cat, i) => {
          const metric = getCategoryMetrics(cat);
          const style = intensityColors[metric.intensity as 'red' | 'yellow' | 'green'];
          const isSelected = selectedCategory === cat;

          return (
            <motion.button
              key={cat}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(isSelected ? null : cat)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer relative",
                isSelected ? style.activeCard : style.card
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {cat}
                </span>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", style.badge)}>
                  {metric.count} {metric.count === 1 ? 'issue' : 'issues'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <span className={cn("w-2 h-2 rounded-full animate-pulse", style.dot)} />
                <span className={cn("text-xs font-semibold", style.text)}>
                  {metric.label}
                </span>
              </div>

              <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Intensity</span>
                <div className="flex gap-1">
                  <div className={cn("w-2 h-2 rounded-full", metric.intensity === 'red' ? 'bg-red-500' : 'bg-white/10')} />
                  <div className={cn("w-2 h-2 rounded-full", metric.intensity === 'yellow' || metric.intensity === 'red' ? (metric.intensity === 'red' ? 'bg-red-500' : 'bg-amber-500') : 'bg-white/10')} />
                  <div className={cn("w-2 h-2 rounded-full", metric.intensity === 'green' ? 'bg-zinc-500' : 'bg-white/10')} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
