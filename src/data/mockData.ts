export type FrictionCategory = 'Sales' | 'Marketing' | 'Operations' | 'Technology' | 'Customer' | 'Finance';
export type Severity = 'Low' | 'Moderate' | 'High';

export interface FrictionPoint {
  id: string;
  category: FrictionCategory;
  problem: string;
  cause: string;
  severity: Severity;
  revenueImpact: number; // 1-10
  automationReadiness: number; // 1-10
  difficultyToFix: number; // 1-10
  opportunityScore: number; // 1-100
  suggestedSolution: string;
  suggestedTool: string;
  actionDetails?: string;
  estimatedAnnualSavings?: number;
}

export interface WebsiteAuditDetails {
  url: string;
  pageTitle: string;
  metaDescription: string;
  responseTimeMs: number;
  hasSsl: boolean;
  hasMobileViewport: boolean;
  formsCount: number;
  buttonsCount: number;
  detectedTech: string[];
  phoneFound?: string;
  emailFound?: string;
  conversionLeaks: string[];
  seoGaps: string[];
  speedBottlenecks: string[];
  missingLeadCapture: string[];
  messagingWeaknesses: string[];
}

export interface AutomationReadinessMeter {
  immediate: number; // %
  moderate: number; // %
  complex: number;   // %
}

export interface TrendDataPoint {
  month: string;
  frictionScore: number;
  revenueLeak: number;
}

export interface IndustryData {
  industry: string;
  scanType?: 'industry' | 'company' | 'website';
  companyName?: string;
  targetName?: string;
  targetUrl?: string;
  efficiencyScore: number;
  revenueLeak: number;
  potentialRecovery: number;
  benchmarkComparison?: {
    industryAverageScore: number;
    percentileRank: number;
    topLossCategory: string;
  };
  automationMeter?: AutomationReadinessMeter;
  frictionPoints: FrictionPoint[];
  websiteAudit?: WebsiteAuditDetails;
  searchSources?: Array<{ title: string; url: string }>;
  topHighRoiFixes?: Array<{
    title: string;
    roi: string;
    timeframe: string;
    description: string;
  }>;
  trendData?: TrendDataPoint[];
}

export const mockIndustries: Record<string, IndustryData> = {
  'Construction': {
    industry: 'Construction',
    efficiencyScore: 68,
    revenueLeak: 320000,
    potentialRecovery: 185000,
    benchmarkComparison: {
      industryAverageScore: 64,
      percentileRank: 58,
      topLossCategory: 'Sales & Quoting'
    },
    automationMeter: {
      immediate: 45,
      moderate: 35,
      complex: 20
    },
    topHighRoiFixes: [
      {
        title: 'Instant Multi-Trade Estimate Builder',
        roi: '12x',
        timeframe: '2-4 weeks',
        description: 'Eliminates 3-5 day quoting bottlenecks, cutting bid abandonment by 35%.'
      },
      {
        title: 'AI Fast-Response Lead Router',
        roi: '8.5x',
        timeframe: '1 week',
        description: 'Auto-qualifies incoming web forms and inbound calls in under 90 seconds.'
      },
      {
        title: 'Subcontractor Dispatch & Material Tracker',
        roi: '6x',
        timeframe: '4-6 weeks',
        description: 'Removes double data entry between job sites and QuickBooks.'
      }
    ],
    frictionPoints: [
      {
        id: 'c1',
        category: 'Sales',
        problem: 'Slow lead response (average 14 hours)',
        cause: 'Manual spreadsheet lead routing and unassigned voicemail notifications',
        severity: 'High',
        revenueImpact: 9,
        automationReadiness: 10,
        difficultyToFix: 3,
        opportunityScore: 92,
        suggestedSolution: 'Instant AI lead routing & SMS dispatch',
        suggestedTool: 'Contractor Estimate Builder',
        actionDetails: 'Implement webhook ingestion to instantly SMS the on-duty estimator within 90 seconds of bid submission.',
        estimatedAnnualSavings: 65000
      },
      {
        id: 'c2',
        category: 'Operations',
        problem: 'Manual quoting delays & material miscalculations',
        cause: 'Scattered pricing sheets across desktop Excel files and paper takeoff notes',
        severity: 'High',
        revenueImpact: 8,
        automationReadiness: 9,
        difficultyToFix: 4,
        opportunityScore: 88,
        suggestedSolution: 'Standardized quote automation engine',
        suggestedTool: 'Instant Estimate Builder',
        actionDetails: 'Centralize supplier price books into a live pricing matrix with automated margin guardrails.',
        estimatedAnnualSavings: 52000
      },
      {
        id: 'c3',
        category: 'Marketing',
        problem: 'Low website conversion & missing instant qualification',
        cause: 'Static generic contact forms with no project scope or budget filtering',
        severity: 'High',
        revenueImpact: 7,
        automationReadiness: 9,
        difficultyToFix: 2,
        opportunityScore: 85,
        suggestedSolution: 'Interactive scope calculator & conversion optimization',
        suggestedTool: 'Website Leak Detector',
        actionDetails: 'Replace basic form with an interactive 4-step project cost calculator capturing high-intent leads.',
        estimatedAnnualSavings: 42000
      },
      {
        id: 'c4',
        category: 'Customer',
        problem: 'Client update friction & change-order disputes',
        cause: 'Ad-hoc SMS threads and lost photo documentation during job execution',
        severity: 'Moderate',
        revenueImpact: 6,
        automationReadiness: 8,
        difficultyToFix: 3,
        opportunityScore: 78,
        suggestedSolution: 'Automated daily photo & progress notification bridge',
        suggestedTool: 'Client Portal Sync',
        actionDetails: 'Auto-sync foreman daily logs to a secure customer-facing view with digital signature change orders.',
        estimatedAnnualSavings: 28000
      },
      {
        id: 'c5',
        category: 'Technology',
        problem: 'Siloed job costing and ERP synchronization gaps',
        cause: 'Manual re-entry of invoices from field apps into accounting software',
        severity: 'Moderate',
        revenueImpact: 6,
        automationReadiness: 6,
        difficultyToFix: 7,
        opportunityScore: 65,
        suggestedSolution: 'Two-way accounting middleware connector',
        suggestedTool: 'Blueprint Translator',
        actionDetails: 'Deploy webhook listeners between field management tools and backend ERP to eliminate manual data entry.',
        estimatedAnnualSavings: 19000
      }
    ]
  },
  'HVAC': {
    industry: 'HVAC',
    efficiencyScore: 64,
    revenueLeak: 275000,
    potentialRecovery: 160000,
    benchmarkComparison: {
      industryAverageScore: 61,
      percentileRank: 55,
      topLossCategory: 'Dispatch & Quoting'
    },
    automationMeter: {
      immediate: 50,
      moderate: 30,
      complex: 20
    },
    topHighRoiFixes: [
      {
        title: 'Emergency Service Instant Booking Bot',
        roi: '11x',
        timeframe: '1 week',
        description: 'Captures peak evening/weekend furnace breakdown calls with auto-scheduling.'
      },
      {
        title: 'Good-Better-Best Digital Proposal Generator',
        roi: '9x',
        timeframe: '2 weeks',
        description: 'Increases system replacement average ticket size by 28%.'
      }
    ],
    frictionPoints: [
      {
        id: 'hvac1',
        category: 'Sales',
        problem: 'Missed emergency calls during after-hours surges',
        cause: 'Single-line answering service with 45+ minute callback delay',
        severity: 'High',
        revenueImpact: 9,
        automationReadiness: 10,
        difficultyToFix: 2,
        opportunityScore: 94,
        suggestedSolution: 'Voice AI receptionist & automated dispatch triage',
        suggestedTool: 'HVAC Emergency Dispatcher',
        actionDetails: 'Deploy 24/7 AI conversational intake that captures address, system model, and books technician arrival slots.',
        estimatedAnnualSavings: 72000
      },
      {
        id: 'hvac2',
        category: 'Operations',
        problem: 'Single-option paper quotes causing low close rates',
        cause: 'Technicians providing handwritten quotes without tiered options',
        severity: 'High',
        revenueImpact: 8,
        automationReadiness: 9,
        difficultyToFix: 3,
        opportunityScore: 89,
        suggestedSolution: 'Tablet-based Good/Better/Best system proposal builder',
        suggestedTool: 'Instant Estimate Builder',
        actionDetails: 'Automate tier pricing with built-in financing payment calculators on field tablets.',
        estimatedAnnualSavings: 54000
      },
      {
        id: 'hvac3',
        category: 'Customer',
        problem: 'Low seasonal maintenance agreement renewals',
        cause: 'Expired contract reminders sent solely via physical postcards',
        severity: 'Moderate',
        revenueImpact: 6,
        automationReadiness: 10,
        difficultyToFix: 2,
        opportunityScore: 84,
        suggestedSolution: 'Recurring membership billing & automated calendar booking',
        suggestedTool: 'Service Contract Renewal Flow',
        actionDetails: 'Trigger automated 1-click renewal links via SMS 30 days prior to annual inspection windows.',
        estimatedAnnualSavings: 34000
      }
    ]
  },
  'Healthcare': {
    industry: 'Healthcare',
    efficiencyScore: 72,
    revenueLeak: 450000,
    potentialRecovery: 210000,
    benchmarkComparison: {
      industryAverageScore: 69,
      percentileRank: 62,
      topLossCategory: 'Intake & No-shows'
    },
    automationMeter: {
      immediate: 40,
      moderate: 40,
      complex: 20
    },
    topHighRoiFixes: [
      {
        title: 'Digital Intake & Insurance Card Scanner',
        roi: '10x',
        timeframe: '2 weeks',
        description: 'Cuts check-in wait time by 18 minutes per patient.'
      },
      {
        title: 'Conversational Two-Way SMS Confirmation',
        roi: '7.5x',
        timeframe: '1 week',
        description: 'Reduces missed appointments from 18% down to under 5%.'
      }
    ],
    frictionPoints: [
      {
        id: 'h1',
        category: 'Customer',
        problem: 'High appointment no-show and last-minute cancellation rates (17%)',
        cause: 'Passive one-way automated emails without conversational reschedule ability',
        severity: 'High',
        revenueImpact: 9,
        automationReadiness: 10,
        difficultyToFix: 2,
        opportunityScore: 95,
        suggestedSolution: 'Two-way intelligent SMS rescheduling assistant',
        suggestedTool: 'Appointment Guardian',
        actionDetails: 'Allow patients to reply directly to text reminders to instantly choose new available slots.',
        estimatedAnnualSavings: 94000
      },
      {
        id: 'h2',
        category: 'Operations',
        problem: 'Patient intake bottlenecks & manual chart transcription',
        cause: 'Clipboard paper questionnaires re-entered manually into EHR by front desk',
        severity: 'High',
        revenueImpact: 8,
        automationReadiness: 9,
        difficultyToFix: 4,
        opportunityScore: 89,
        suggestedSolution: 'Mobile pre-visit intake & OCR insurance verification',
        suggestedTool: 'Intake Flow Optimizer',
        actionDetails: 'Send pre-appointment digital intake links that auto-parse insurance cards and map data into EHR.',
        estimatedAnnualSavings: 78000
      },
      {
        id: 'h3',
        category: 'Finance',
        problem: 'Delayed patient balance collection post-insurance adjudication',
        cause: 'Mailing paper statements 60-90 days after service',
        severity: 'Moderate',
        revenueImpact: 7,
        automationReadiness: 8,
        difficultyToFix: 3,
        opportunityScore: 82,
        suggestedSolution: 'Automated digital statement and Apple Pay/Google Pay SMS billing',
        suggestedTool: 'PatientPay Direct',
        actionDetails: 'Trigger secure text-to-pay links as soon as insurance explanation of benefits settles.',
        estimatedAnnualSavings: 38000
      }
    ]
  }
};

export const industriesList = [
  'Construction',
  'HVAC',
  'Healthcare',
  'Dental',
  'Legal',
  'Insurance',
  'Manufacturing',
  'Real estate',
  'Restaurants',
  'Logistics',
  'Software companies'
];
