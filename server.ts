import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '2mb' }));

// Shared Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: Safely clean JSON string from Gemini
function parseJsonFromGemini(text: string | undefined): any {
  if (!text) return null;
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt to extract the first balanced JSON object if any preamble exists
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        console.error('Failed to parse matched JSON substring', e);
      }
    }
    console.error('Failed to parse Gemini JSON output:', cleaned.slice(0, 300));
    return null;
  }
}

// Helper: Scrape and inspect basic website DOM & technical indicators
async function inspectWebsite(rawUrl: string) {
  let targetUrl = rawUrl.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  const startTime = Date.now();
  let responseTimeMs = 0;
  let status = 0;
  let html = '';
  let fetchError = null;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
    });
    responseTimeMs = Date.now() - startTime;
    status = res.status;
    html = await res.text();
  } catch (err: any) {
    fetchError = err.message || 'Connection failed';
    responseTimeMs = Date.now() - startTime;
  }

  // Parse key elements from HTML
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const metaDescMatch = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i
  ) || html.match(
    /<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i
  );
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';

  const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);
  const hasSsl = targetUrl.startsWith('https://');

  const formsCount = (html.match(/<form[\s>]/gi) || []).length;
  const buttonsCount = (html.match(/<button[\s>]/gi) || []).length + (html.match(/type=["']submit["']/gi) || []).length;

  const phoneMatch = html.match(/href=["']tel:([^"']+)["']/i) || html.match(/(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
  const phoneFound = phoneMatch ? phoneMatch[1] || phoneMatch[0] : undefined;

  const emailMatch = html.match(/href=["']mailto:([^"']+)["']/i) || html.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
  const emailFound = emailMatch ? emailMatch[1] || emailMatch[0] : undefined;

  // Detect tech / scripts
  const detectedTech: string[] = [];
  if (/googletagmanager|gtag|google-analytics/i.test(html)) detectedTech.push('Google Analytics');
  if (/fbevents|facebook-jssdk/i.test(html)) detectedTech.push('Meta Pixel');
  if (/hubspot|hs-scripts/i.test(html)) detectedTech.push('HubSpot');
  if (/intercom/i.test(html)) detectedTech.push('Intercom');
  if (/drift/i.test(html)) detectedTech.push('Drift');
  if (/tidio/i.test(html)) detectedTech.push('Tidio Chat');
  if (/hotjar/i.test(html)) detectedTech.push('Hotjar');
  if (/clarity\.ms/i.test(html)) detectedTech.push('Microsoft Clarity');
  if (/recaptcha|turnstile/i.test(html)) detectedTech.push('Anti-Bot Shield');
  if (/wp-content|wordpress/i.test(html)) detectedTech.push('WordPress');
  if (/cdn\.shopify\.com|Shopify\.theme/i.test(html)) detectedTech.push('Shopify');
  if (/webflow/i.test(html)) detectedTech.push('Webflow');
  if (/wix\.com/i.test(html)) detectedTech.push('Wix');
  if (/squarespace/i.test(html)) detectedTech.push('Squarespace');
  if (/_next\/static/i.test(html)) detectedTech.push('Next.js');

  // Extract clean text snippets (headings & hero text)
  const headings: string[] = [];
  const h1Matches = html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi);
  for (const match of h1Matches) {
    if (match[1]?.trim()) headings.push('H1: ' + match[1].trim());
  }
  const h2Matches = html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi);
  for (const match of h2Matches) {
    if (match[1]?.trim() && headings.length < 5) headings.push('H2: ' + match[1].trim());
  }

  // Strip scripts, styles, tags for a clean 1500 char text sample
  const cleanBody = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1500);

  return {
    targetUrl,
    responseTimeMs,
    status,
    fetchError,
    title,
    metaDescription,
    hasViewport,
    hasSsl,
    formsCount,
    buttonsCount,
    phoneFound,
    emailFound,
    detectedTech,
    headings,
    cleanBody,
  };
}

// Endpoint: Real Website Scan
app.post('/api/scan/website', async (req, res) => {
  try {
    const { url, industryHint } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'A valid URL is required.' });
    }

    // Step 1: Real HTTP fetch and technical telemetry
    const inspection = await inspectWebsite(url);

    // Step 2: Gemini Deep Intelligence with Search Grounding
    const prompt = `
Perform a high-level, rigorous diagnostic friction scan for this website:
URL: ${inspection.targetUrl}
${industryHint ? `Industry context provided: ${industryHint}` : ''}

Live Technical Telemetry & DOM Scraping Data:
- Response Time (TTFB): ${inspection.responseTimeMs}ms
- HTTP Status: ${inspection.status} ${inspection.fetchError ? `(Fetch issue: ${inspection.fetchError})` : ''}
- SSL (HTTPS): ${inspection.hasSsl ? 'Active' : 'Missing/Insecure'}
- Mobile Viewport: ${inspection.hasViewport ? 'Detected' : 'Missing viewport tag'}
- Page Title: "${inspection.title || 'None found'}"
- Meta Description: "${inspection.metaDescription || 'None found'}"
- Lead Capture Forms on page: ${inspection.formsCount}
- Call to Action Buttons: ${inspection.buttonsCount}
- Phone contact detected: ${inspection.phoneFound || 'No direct phone detected'}
- Email contact detected: ${inspection.emailFound || 'No direct email detected'}
- Detected Stack & Analytics: ${inspection.detectedTech.length > 0 ? inspection.detectedTech.join(', ') : 'No standard tracking/chat tools detected'}
- Key Headings found: ${inspection.headings.join(' | ') || 'None found'}
- Scraped Page Copy Sample: "${inspection.cleanBody}"

Please conduct an in-depth Business Friction Diagnostic based on real conversion rate optimization (CRO), lead-routing mechanics, SEO health, operational efficiency, and positioning clarity.

Return ONLY a valid JSON object strictly matching this TypeScript structure:
{
  "industry": string (best inferred industry, e.g. "Roofing & Construction", "E-commerce", "SaaS", "Legal Services", etc.),
  "companyName": string (inferred company/brand name),
  "targetUrl": "${inspection.targetUrl}",
  "efficiencyScore": number (1-100 overall operational/conversion efficiency),
  "revenueLeak": number (estimated annual revenue lost due to operational & conversion friction, e.g. 185000),
  "potentialRecovery": number (realistic recoverable revenue in 12 months with automation, e.g. 110000),
  "benchmarkComparison": {
    "industryAverageScore": number,
    "percentileRank": number,
    "topLossCategory": string
  },
  "automationMeter": {
    "immediate": number (percent ready to automate right now, 0-100),
    "moderate": number (0-100),
    "complex": number (0-100)
  },
  "websiteAudit": {
    "url": "${inspection.targetUrl}",
    "pageTitle": "${(inspection.title || '').replace(/"/g, '\\"')}",
    "metaDescription": "${(inspection.metaDescription || '').replace(/"/g, '\\"')}",
    "responseTimeMs": ${inspection.responseTimeMs},
    "hasSsl": ${inspection.hasSsl},
    "hasMobileViewport": ${inspection.hasViewport},
    "formsCount": ${inspection.formsCount},
    "buttonsCount": ${inspection.buttonsCount},
    "detectedTech": ${JSON.stringify(inspection.detectedTech)},
    "phoneFound": ${inspection.phoneFound ? JSON.stringify(inspection.phoneFound) : 'null'},
    "emailFound": ${inspection.emailFound ? JSON.stringify(inspection.emailFound) : 'null'},
    "conversionLeaks": [3-4 specific conversion leaks observed on this site],
    "seoGaps": [2-3 specific SEO & discoverability issues],
    "speedBottlenecks": [1-2 technical or speed issues],
    "missingLeadCapture": [2-3 specific missed capture mechanisms, e.g., missing interactive quote calculator, no instant calendar booking, friction in form length],
    "messagingWeaknesses": [2-3 specific copy or positioning weaknesses observed from their copy/headings]
  },
  "frictionPoints": [
    {
      "id": string (unique id like "fp1", "fp2"),
      "category": "Sales" | "Marketing" | "Operations" | "Technology" | "Customer",
      "problem": string (clear title of the friction point),
      "cause": string (underlying operational or technical cause),
      "severity": "High" | "Moderate" | "Low",
      "revenueImpact": number (1-10),
      "automationReadiness": number (1-10),
      "difficultyToFix": number (1-10),
      "opportunityScore": number (1-100 calculation based on impact vs difficulty),
      "suggestedSolution": string (solution methodology),
      "suggestedTool": string (name of micro-tool/system, e.g. "Instant Quote Calculator", "AI Lead Router", "Speed & Conversion Optimizer", "Appointment Guardian"),
      "actionDetails": string (specific actionable steps to fix),
      "estimatedAnnualSavings": number (approximate annual dollar savings)
    }
  ],
  "topHighRoiFixes": [
    {
      "title": string,
      "roi": string (e.g. "9.4x"),
      "timeframe": string (e.g. "1-2 weeks"),
      "description": string
    }
  ]
}

Provide 5 to 7 detailed, realistic friction points across multiple categories. Be specific to the actual data gathered.`;

    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: {
          thinkingLevel: 'LOW' as any,
        },
      },
    });

    const parsedData = parseJsonFromGemini(geminiResponse.text);

    // Extract search grounding sources if available
    const groundingChunks = geminiResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const searchSources: Array<{ title: string; url: string }> = [];
    if (groundingChunks && Array.isArray(groundingChunks)) {
      for (const chunk of groundingChunks) {
        if (chunk.web?.uri && chunk.web?.title) {
          searchSources.push({
            title: chunk.web.title,
            url: chunk.web.uri,
          });
        }
      }
    }

    if (!parsedData) {
      throw new Error('Could not parse diagnostic output from model.');
    }

    // Merge search sources and scanType
    parsedData.scanType = 'website';
    parsedData.targetUrl = inspection.targetUrl;
    parsedData.searchSources = searchSources;

    // Ensure websiteAudit exists
    if (!parsedData.websiteAudit) {
      parsedData.websiteAudit = {
        url: inspection.targetUrl,
        pageTitle: inspection.title,
        metaDescription: inspection.metaDescription,
        responseTimeMs: inspection.responseTimeMs,
        hasSsl: inspection.hasSsl,
        hasMobileViewport: inspection.hasViewport,
        formsCount: inspection.formsCount,
        buttonsCount: inspection.buttonsCount,
        detectedTech: inspection.detectedTech,
        phoneFound: inspection.phoneFound,
        emailFound: inspection.emailFound,
        conversionLeaks: ['Generic call-to-action lacking instant value exchange'],
        seoGaps: ['Meta tags suboptimal for local buyer intent'],
        speedBottlenecks: [`TTFB clocked at ${inspection.responseTimeMs}ms`],
        missingLeadCapture: ['No instant quote or self-service assessment'],
        messagingWeaknesses: ['Value proposition could be sharper above the fold'],
      };
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Website scan error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to complete website friction scan.',
    });
  }
});

// Endpoint: Company Scan
app.post('/api/scan/company', async (req, res) => {
  try {
    const { companyName, industry, employeeCount, revenueRange, toolsUsed } = req.body;
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required.' });
    }

    const prompt = `
Perform an operational friction diagnostic for:
Company: ${companyName}
Industry: ${industry || 'General Business'}
Employee Count: ${employeeCount || '10-50'}
Estimated Revenue: ${revenueRange || '$1M - $5M'}
Current Tools Mentioned: ${toolsUsed || 'Standard spreadsheets, email, basic CRM'}

Analyze typical operational bottlenecks for a business of this size and industry. Use Google Search to ground any public information about ${companyName} if available.
Return ONLY valid JSON matching this schema:
{
  "industry": "${industry || 'Business Services'}",
  "companyName": "${companyName}",
  "scanType": "company",
  "efficiencyScore": number (1-100),
  "revenueLeak": number (estimated annual dollar loss),
  "potentialRecovery": number (dollar amount),
  "benchmarkComparison": {
    "industryAverageScore": number,
    "percentileRank": number,
    "topLossCategory": string
  },
  "automationMeter": {
    "immediate": number,
    "moderate": number,
    "complex": number
  },
  "frictionPoints": [
    {
      "id": string,
      "category": "Sales" | "Marketing" | "Operations" | "Technology" | "Customer",
      "problem": string,
      "cause": string,
      "severity": "High" | "Moderate" | "Low",
      "revenueImpact": number (1-10),
      "automationReadiness": number (1-10),
      "difficultyToFix": number (1-10),
      "opportunityScore": number (1-100),
      "suggestedSolution": string,
      "suggestedTool": string,
      "actionDetails": string,
      "estimatedAnnualSavings": number
    }
  ],
  "topHighRoiFixes": [
    {
      "title": string,
      "roi": string,
      "timeframe": string,
      "description": string
    }
  ]
}
Include 5-6 realistic friction points.`;

    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const parsedData = parseJsonFromGemini(geminiResponse.text);
    if (!parsedData) throw new Error('Failed to parse diagnostic analysis.');

    parsedData.scanType = 'company';
    return res.json(parsedData);
  } catch (err: any) {
    console.error('Company scan error:', err);
    return res.status(500).json({ error: err.message || 'Company scan failed.' });
  }
});

// Endpoint: Industry Scan
app.post('/api/scan/industry', async (req, res) => {
  try {
    const { industry } = req.body;
    if (!industry) {
      return res.status(400).json({ error: 'Industry is required.' });
    }

    const prompt = `
Provide an up-to-date Industry Operational Friction intelligence report for the ${industry} industry.
Include current automation benchmarks, top operational leaks, and revenue impact.
Return ONLY valid JSON:
{
  "industry": "${industry}",
  "scanType": "industry",
  "efficiencyScore": number (1-100),
  "revenueLeak": number (industry average annual leak for SMBs),
  "potentialRecovery": number,
  "benchmarkComparison": {
    "industryAverageScore": number,
    "percentileRank": number,
    "topLossCategory": string
  },
  "automationMeter": {
    "immediate": number,
    "moderate": number,
    "complex": number
  },
  "frictionPoints": [
    {
      "id": string,
      "category": "Sales" | "Marketing" | "Operations" | "Technology" | "Customer",
      "problem": string,
      "cause": string,
      "severity": "High" | "Moderate" | "Low",
      "revenueImpact": number (1-10),
      "automationReadiness": number (1-10),
      "difficultyToFix": number (1-10),
      "opportunityScore": number (1-100),
      "suggestedSolution": string,
      "suggestedTool": string,
      "actionDetails": string,
      "estimatedAnnualSavings": number
    }
  ],
  "topHighRoiFixes": [
    {
      "title": string,
      "roi": string,
      "timeframe": string,
      "description": string
    }
  ]
}
Provide 5-6 points specific to ${industry}.`;

    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const parsedData = parseJsonFromGemini(geminiResponse.text);
    if (!parsedData) throw new Error('Failed to parse industry intelligence report.');

    parsedData.scanType = 'industry';
    return res.json(parsedData);
  } catch (err: any) {
    console.error('Industry scan error:', err);
    return res.status(500).json({ error: err.message || 'Industry scan failed.' });
  }
});

// Endpoint: Multi-Turn Gemini Chatbot ("Friction Radar Copilot")
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required.' });
    }

    const simplifiedProblems = (context?.frictionPoints || []).map((p: any) => ({
      category: p.category,
      problem: p.problem,
      severity: p.severity,
      suggestedTool: p.suggestedTool,
      opportunityScore: p.opportunityScore,
    }));

    const systemInstruction = `You are FrictionMap OS Copilot, an elite business friction & automation intelligence advisor.
You specialize in transforming diagnostic scan results into actionable, high-ROI solutions.
You have access to the user's active scan data:
- Active Target: ${context?.targetUrl || context?.companyName || context?.industry || 'General Business'}
- Scan Type: ${context?.scanType || 'Diagnostic'}
- Efficiency Score: ${context?.efficiencyScore || 'N/A'}/100
- Est. Revenue Leak: $${context?.revenueLeak?.toLocaleString() || 'N/A'}
- Potential Recovery: $${context?.potentialRecovery?.toLocaleString() || 'N/A'}
- Detected Website Audit: ${JSON.stringify(context?.websiteAudit || {})}
- Detected High-Impact Problems: ${JSON.stringify(simplifiedProblems)}

Rules:
1. Provide concise, high-impact, practical advice. Avoid generic buzzwords.
2. When asked how to fix a friction point, provide a step-by-step 30-day implementation plan, exact copy recommendations for website fixes, or tool specifications.
3. Be encouraging yet analytically sharp, like a top-tier management consultant and technical automator.`;

    // Convert messages to GenAI format
    const contents = messages.map((m: any) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    return res.json({ text: response.text || '' });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: err.message || 'Chatbot generation failed.' });
  }
});

// Mount Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`FrictionMap OS full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
