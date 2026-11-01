import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Globe, Search, ArrowRight, Zap, Loader2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { industriesList, IndustryData, mockIndustries } from '../data/mockData';
import { cn } from './ui/utils';

interface ScanEngineProps {
  onScanComplete: (data: IndustryData) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

type ScanMode = 'website' | 'company' | 'industry';

export function ScanEngine({ onScanComplete, isLoading, setIsLoading }: ScanEngineProps) {
  const [mode, setMode] = useState<ScanMode>('website');
  const [selectedIndustry, setSelectedIndustry] = useState(industriesList[0]);
  const [companyName, setCompanyName] = useState('');
  const [employeeCount, setEmployeeCount] = useState('10-50');
  const [revenueRange, setRevenueRange] = useState('$1M - $5M');
  const [toolsUsed, setToolsUsed] = useState('Spreadsheets, Gmail, QuickBooks');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [scanStep, setScanStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const quickSamples = [
    { label: 'Local HVAC Service', url: 'https://coolair-pros.com' },
    { label: 'Commercial Roofing', url: 'https://apexroofingllc.com' },
    { label: 'Dental Practice', url: 'https://brightsmilesdental.com' },
    { label: 'B2B Software', url: 'https://stripe.com' },
  ];

  const handleScan = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'website') {
        if (!websiteUrl.trim()) {
          throw new Error('Please enter a website URL.');
        }

        setScanStep('Connecting to host server & probing response time...');
        const timer1 = setTimeout(() => {
          setScanStep('Analyzing DOM hierarchy, forms, tracking & CTA conversion leaks...');
        }, 1200);
        const timer2 = setTimeout(() => {
          setScanStep('Grounding company profile with Google Search & Gemini 3.8 Flash...');
        }, 2800);
        const timer3 = setTimeout(() => {
          setScanStep('Synthesizing operational friction points & calculating revenue leak...');
        }, 4600);

        const response = await fetch('/api/scan/website', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: websiteUrl,
            industryHint: selectedIndustry,
          }),
        });

        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to scan website.');
        }

        const data: IndustryData = await response.json();
        onScanComplete(data);
      } else if (mode === 'company') {
        if (!companyName.trim()) {
          throw new Error('Please enter a company name.');
        }

        setScanStep(`Investigating ${companyName} operations & industry benchmarks...`);
        const timer = setTimeout(() => {
          setScanStep('Mapping technology silos, quoting delays & team friction...');
        }, 1500);

        const response = await fetch('/api/scan/company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName,
            industry: selectedIndustry,
            employeeCount,
            revenueRange,
            toolsUsed,
          }),
        });
        clearTimeout(timer);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to scan company.');
        }

        const data: IndustryData = await response.json();
        onScanComplete(data);
      } else {
        // Industry Scan
        setScanStep(`Compiling current ${selectedIndustry} friction intelligence database...`);
        const response = await fetch('/api/scan/industry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ industry: selectedIndustry }),
        });

        if (response.ok) {
          const data: IndustryData = await response.json();
          onScanComplete(data);
        } else {
          // Fallback to rich local database
          const fallback = mockIndustries[selectedIndustry] || {
            ...mockIndustries['Construction'],
            industry: selectedIndustry,
          };
          onScanComplete(fallback);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Something went wrong during the diagnostic scan.');
    } finally {
      setIsLoading(false);
      setScanStep('');
    }
  };

  return (
    <div className="mx-auto max-w-3xl pt-10 pb-20 px-4">
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Zap className="w-3.5 h-3.5" />
            Live Diagnostic Engine & Friction Radar
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Reveal the hidden friction <br className="hidden sm:block" />
            <span className="text-zinc-500">that burns revenue & wastes time.</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Scan any live URL, company, or industry. FrictionMap OS acts like a business MRI machine—visually mapping bottlenecks, conversion leaks, and quantifying the exact dollar cost.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-zinc-900/80 border border-white/10 rounded-2xl p-2 sm:p-4 backdrop-blur-md shadow-2xl"
      >
        {/* Mode Selector Tabs */}
        <div className="flex p-1 bg-zinc-950 rounded-xl mb-6 border border-white/5">
          <button
            type="button"
            onClick={() => { setMode('website'); setErrorMessage(null); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all",
              mode === 'website'
                ? "bg-zinc-500 text-zinc-950 font-semibold shadow-lg shadow-zinc-500/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            )}
          >
            <Globe className="w-4 h-4" />
            Website Scan
          </button>
          <button
            type="button"
            onClick={() => { setMode('company'); setErrorMessage(null); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all",
              mode === 'company'
                ? "bg-zinc-500 text-zinc-950 font-semibold shadow-lg shadow-zinc-500/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            )}
          >
            <Building2 className="w-4 h-4" />
            Company Scan
          </button>
          <button
            type="button"
            onClick={() => { setMode('industry'); setErrorMessage(null); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all",
              mode === 'industry'
                ? "bg-zinc-500 text-zinc-950 font-semibold shadow-lg shadow-zinc-500/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            )}
          >
            <Search className="w-4 h-4" />
            Industry Scan
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleScan} className="p-3 sm:p-4">
          {mode === 'website' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Target Website URL
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-zinc-500">
                    <Globe className="w-4 h-4 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="e.g. acme-roofing.com or https://company.com"
                    disabled={isLoading}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 disabled:opacity-50"
                    required
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Performs a live technical audit: response latency, form capture leaks, SEO gaps, messaging friction, and Google Search footprint.
                </p>
              </div>

              {/* Quick Try Samples */}
              <div className="pt-2">
                <div className="text-xs text-zinc-400 font-medium mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  Quick sample targets:
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickSamples.map((sample) => (
                    <button
                      key={sample.url}
                      type="button"
                      onClick={() => setWebsiteUrl(sample.url)}
                      disabled={isLoading}
                      className="text-xs bg-zinc-950 border border-white/5 hover:border-zinc-500/30 text-zinc-300 hover:text-zinc-400 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500/60" />
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === 'company' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Mechanical"
                    disabled={isLoading}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Industry
                  </label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
                  >
                    {industriesList.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Employee Headcount
                  </label>
                  <select
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
                  >
                    <option value="1-10">1 - 10 employees</option>
                    <option value="11-50">11 - 50 employees</option>
                    <option value="51-200">51 - 200 employees</option>
                    <option value="200+">200+ employees</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Revenue Range
                  </label>
                  <select
                    value={revenueRange}
                    onChange={(e) => setRevenueRange(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
                  >
                    <option value="<$1M">&lt; $1,000,000 / yr</option>
                    <option value="$1M - $5M">$1M - $5M / yr</option>
                    <option value="$5M - $20M">$5M - $20M / yr</option>
                    <option value="$20M+">$20M+ / yr</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Primary Tech / Operations Stack
                </label>
                <input
                  type="text"
                  value={toolsUsed}
                  onChange={(e) => setToolsUsed(e.target.value)}
                  placeholder="e.g. QuickBooks, Excel, ServiceTitan, Slack, HubSpot"
                  disabled={isLoading}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
                />
              </div>
            </div>
          )}

          {mode === 'industry' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Select Sector for Benchmark Intelligence
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {industriesList.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setSelectedIndustry(ind)}
                    disabled={isLoading}
                    className={cn(
                      "px-3.5 py-3 rounded-xl text-xs sm:text-sm font-medium text-left transition-all border",
                      selectedIndustry === ind
                        ? "bg-zinc-500/10 border-zinc-500/60 text-zinc-400 font-semibold"
                        : "bg-zinc-950 border-white/5 text-zinc-400 hover:border-white/15 hover:bg-zinc-900"
                    )}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Scanning Animation Progress */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-5 border-t border-white/10"
              >
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-500/20 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-zinc-400 animate-spin shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-0.5 flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-zinc-500 animate-pulse" />
                      Live Diagnostic in Progress
                    </div>
                    <p className="text-xs text-zinc-300 truncate">
                      {scanStep || 'Executing multi-layer operational diagnostic...'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <CheckCircle2 className="w-4 h-4 text-zinc-500" />
              <span>Grounded with Gemini 3.8 Flash & Google Search</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-skeu cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Scan...
                </>
              ) : (
                <>
                  Run Deep Diagnostic Scan
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
