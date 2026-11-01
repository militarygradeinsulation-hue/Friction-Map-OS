import { motion } from 'motion/react';
import { 
  Globe, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Smartphone, 
  FileText, 
  MousePointerClick, 
  Phone, 
  Mail, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Target,
  Sparkles
} from 'lucide-react';
import { WebsiteAuditDetails } from '../data/mockData';
import { cn } from './ui/utils';

interface WebsiteAuditPanelProps {
  audit: WebsiteAuditDetails;
  searchSources?: Array<{ title: string; url: string }>;
}

export function WebsiteAuditPanel({ audit, searchSources }: WebsiteAuditPanelProps) {
  const getSpeedStatus = (ms: number) => {
    if (ms <= 350) return { label: 'Fast', color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20' };
    if (ms <= 900) return { label: 'Moderate', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Slow (Latency Risk)', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
  };

  const speed = getSpeedStatus(audit.responseTimeMs);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md mb-8"
    >
      {/* Top Banner with live URL & quick badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-500/10 border border-zinc-500/30 flex items-center justify-center text-zinc-400 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">Live Website Diagnostic</span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />
            </div>
            <a
              href={audit.url}
              target="_blank"
              rel="noreferrer"
              className="text-base sm:text-lg font-semibold text-white hover:text-zinc-400 transition-colors flex items-center gap-1.5"
            >
              <span className="truncate max-w-[280px] sm:max-w-md">{audit.url}</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={cn("px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5", speed.color)}>
            <Clock className="w-3.5 h-3.5" />
            TTFB: {audit.responseTimeMs}ms ({speed.label})
          </span>
          {audit.hasSsl ? (
            <span className="px-2.5 py-1 rounded-lg border border-zinc-500/20 bg-zinc-500/10 text-zinc-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              SSL Secure
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 font-medium flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              No SSL
            </span>
          )}
          {audit.hasMobileViewport ? (
            <span className="px-2.5 py-1 rounded-lg border border-zinc-500/20 bg-zinc-500/10 text-zinc-400 font-medium flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              Responsive
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400 font-medium flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              Viewport Issue
            </span>
          )}
        </div>
      </div>

      {/* Technical Footprint & Scraped Signals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-zinc-950/70 border border-white/5 rounded-xl p-3">
          <div className="text-xs text-zinc-400 flex items-center gap-1 mb-1">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            Capture Forms
          </div>
          <div className="text-lg font-bold text-white">
            {audit.formsCount > 0 ? `${audit.formsCount} Detected` : 'None on Page'}
          </div>
          <p className="text-[11px] text-zinc-500">
            {audit.formsCount > 0 ? 'Standard intake form' : 'Missing direct lead capture'}
          </p>
        </div>

        <div className="bg-zinc-950/70 border border-white/5 rounded-xl p-3">
          <div className="text-xs text-zinc-400 flex items-center gap-1 mb-1">
            <MousePointerClick className="w-3.5 h-3.5 text-zinc-400" />
            CTA Buttons
          </div>
          <div className="text-lg font-bold text-white">
            {audit.buttonsCount} Action Elements
          </div>
          <p className="text-[11px] text-zinc-500">Buttons & submit targets</p>
        </div>

        <div className="bg-zinc-950/70 border border-white/5 rounded-xl p-3">
          <div className="text-xs text-zinc-400 flex items-center gap-1 mb-1">
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            Direct Phone
          </div>
          <div className="text-sm font-semibold text-white truncate">
            {audit.phoneFound || 'Not linked in DOM'}
          </div>
          <p className="text-[11px] text-zinc-500">
            {audit.phoneFound ? 'Click-to-call enabled' : 'Friction for mobile visitors'}
          </p>
        </div>

        <div className="bg-zinc-950/70 border border-white/5 rounded-xl p-3">
          <div className="text-xs text-zinc-400 flex items-center gap-1 mb-1">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            Direct Email
          </div>
          <div className="text-sm font-semibold text-white truncate">
            {audit.emailFound || 'Not directly exposed'}
          </div>
          <p className="text-[11px] text-zinc-500">Inbound email contact</p>
        </div>
      </div>

      {/* Tech Stack Detected */}
      {audit.detectedTech && audit.detectedTech.length > 0 && (
        <div className="mb-6 p-3 rounded-xl bg-zinc-950/60 border border-white/5 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mr-2">
            <Cpu className="w-3.5 h-3.5 text-zinc-400" />
            Detected Stack & Telemetry:
          </div>
          {audit.detectedTech.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md bg-zinc-800 border border-white/10 text-zinc-300 text-xs font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Deeper Insights Breakdown: Conversion, SEO, Messaging, Speed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Conversion Leaks */}
        <div className="bg-zinc-950/70 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 rounded-lg bg-red-500/10 text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Conversion Leaks & Bottlenecks
            </h4>
          </div>
          <ul className="space-y-2">
            {audit.conversionLeaks.map((leak, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <span>{leak}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Lead Capture Mechanisms */}
        <div className="bg-zinc-950/70 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Missing Lead Capture Opportunities
            </h4>
          </div>
          <ul className="space-y-2">
            {audit.missingLeadCapture.map((item, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Messaging & Positioning Weaknesses */}
        <div className="bg-zinc-950/70 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 rounded-lg bg-zinc-500/10 text-zinc-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Messaging & Positioning Friction
            </h4>
          </div>
          <ul className="space-y-2">
            {audit.messagingWeaknesses.map((item, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SEO Gaps & Discoverability */}
        <div className="bg-zinc-950/70 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 rounded-lg bg-blue-500/10 text-blue-400">
              <Globe className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              SEO & Search Footprint Gaps
            </h4>
          </div>
          <ul className="space-y-2">
            {audit.seoGaps.map((item, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Google Search Grounding Sources if present */}
      {searchSources && searchSources.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/5">
          <div className="text-xs text-zinc-400 font-medium mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
            Google Search Grounded Signals:
          </div>
          <div className="flex flex-wrap gap-2">
            {searchSources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs bg-zinc-950 border border-white/5 hover:border-zinc-500/40 text-zinc-300 hover:text-zinc-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 max-w-sm truncate"
              >
                <span className="truncate">{src.title}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
