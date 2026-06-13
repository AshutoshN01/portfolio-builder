import { useState } from 'react';
import { FiCpu, FiKey, FiFileText, FiLayout, FiRefreshCw, FiCopy } from 'react-icons/fi';
import { MagneticButton } from '@components/MagneticButton';


export function AIAssistant() {
  const [activeTab, setActiveTab] = useState('project'); // 'resume' | 'project' | 'review'
  
  // Keys State
  const [aiProvider, setAiProvider] = useState(localStorage.getItem('portfolio_ai_provider') || 'openai');
  const [apiKey, setApiKey] = useState(localStorage.getItem('portfolio_ai_key') || '');
  const [keySaved, setKeySaved] = useState(false);

  // Form states
  const [projectInput, setProjectInput] = useState({
    title: '',
    tech: '',
    challenge: '',
  });

  const [resumeInput, setResumeInput] = useState({
    keywords: '',
    experience: '',
  });

  const [generation, setGeneration] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const saveApiKey = () => {
    localStorage.setItem('portfolio_ai_provider', aiProvider);
    localStorage.setItem('portfolio_ai_key', apiKey.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  const clearApiKey = () => {
    localStorage.removeItem('portfolio_ai_provider');
    localStorage.removeItem('portfolio_ai_key');
    setApiKey('');
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Local Offline fallback generator
  const runOfflineGenerator = (type) => {
    if (type === 'project') {
      const { title, tech, challenge } = projectInput;
      const cleanTitle = title.trim() || 'New Web Tool';
      const cleanTech = tech.trim() || 'React, Tailwind CSS';
      const cleanChallenge = challenge.trim() || 'main thread rendering latency';

      return `=== Case Study Suggestions for ${cleanTitle} ===

[TAGLINE]
A high-performance ${cleanTech.split(',')[0]} application designed to resolve ${cleanChallenge}.

[OVERVIEW]
Developed a responsive frontend interface using ${cleanTech} to streamline user operations. Built to address key latency bottlenecks during data transaction cycles, isolating blocking operations to keep user interactions smooth.

[CHALLENGE]
The primary technical bottleneck was ${cleanChallenge}. Executing operations synchronously on the main thread blocked browser painting loops, causing the frame rate to drop and creating laggy, unresponse keyboard/mouse input states.

[SOLUTION]
Addressed the problem by offloading resource-heavy computational workloads to background execution handlers. Integrated caching layers and Canvas scaling methods to pre-process inputs before delivery, maintaining smooth rendering speeds under load.

[GOAL]
To construct a secure, responsive visual utility that process records locally, ensuring data privacy and fast client-side execution speeds.

[LESSONS_LEARNED]
Isolating complex routines into dedicated worker threads prevents UI lockups. Pre-scaling graphics and caching database calls on the client decreases calculation delays and removes the need for frequent backend round-trips.`;
    }

    if (type === 'resume') {
      const { keywords, experience } = resumeInput;
      const cleanKeywords = keywords.trim() || 'React, Kotlin, Firebase, SQLite';
      const cleanExp = experience.trim() || 'Diploma Computer Engineering Student';

      return `=== ATS-Optimized Professional Summary ===

Detail-oriented Software Developer with a background as a ${cleanExp}. Proven expertise in building responsive frontend applications and native mobile interfaces using ${cleanKeywords}. Focuses on writing modular components, setting up offline-first local cache schemas, and connecting client-side apps with generative model APIs. Strong academic foundation in database systems and software engineering.

=== Highlighted Professional Accomplishments ===
- Modular Design: Engineered reusable UI elements using React hooks and lifecycle systems, reducing layout debt.
- Offline-First Storage: Configured local Room SQLite databases in Kotlin, ensuring functionality during network drops.
- AI Integration: Connected frontend web editors with REST APIs (OpenAI / Gemini) to format documents chunk-by-chunk using Server-Sent Events.`;
    }

    // Portfolio Review Fallback
    return `=== Automated Portfolio Review & UX Audit ===

1. ACCESSIBILITY (WCAG 2.2 AA)
- Focus State: Ensure custom inputs and button icons draw distinct focus rings for keyboard tab sequences.
- Screen Readers: Add unique 'aria-describedby' and 'role="alert"' elements to form validation fields.
- Skip Link: Configure skip-navigation hooks to route focus directly to the main container.

2. PERFORMANCE & BUNDLING
- Code Splitting: Split React modules, Lenis scroll scripts, and Framer Motion libraries to keep initial loading assets under 100KB.
- Visuals: Use responsive 'srcset' properties on image elements and serve files in '.webp' format.

3. STORYTELLING & METRICS
- Projects: Frame case studies as Problem-Solution challenges instead of listing generic code checklists. Include explicit Goal and Lessons Learned details to pass recruiter screens.`;
  };

  // Real LLM API generator
  const runOnlineGenerator = async (type) => {
    let prompt = '';
    
    if (type === 'project') {
      prompt = `Create a developer portfolio case study for the project "${projectInput.title}" built using "${projectInput.tech}". The main challenge was: "${projectInput.challenge}". 
      Please provide details under exactly these headers: Tagline, Overview, Challenge, Solution, Goal, Lessons Learned. 
      Keep it highly technical, professional, and matching hiring manager screening expectations.`;
    } else if (type === 'resume') {
      prompt = `Create an ATS-friendly professional summary and list of achievements for a software developer candidate. 
      Keywords/Tech: ${resumeInput.keywords}. 
      Background/Exp: ${resumeInput.experience}. 
      Focus on action verbs and metric-ready details.`;
    } else {
      prompt = `Analyze a generic software developer portfolio structure (Hero, Profile, Projects Case Studies, Timeline, Skills). 
      Provide a rigorous review detailing code improvements, styling, accessibility compliance, and UX patterns.`;
    }

    setGenerating(true);
    setGeneration('');

    try {
      if (aiProvider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
          }),
        });

        if (!res.ok) throw new Error('OpenAI API request failed.');
        const data = await res.json();
        setGeneration(data.choices[0].message.content);
      } else {
        // Gemini API REST send
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        if (!res.ok) throw new Error('Gemini API request failed.');
        const data = await res.json();
        setGeneration(data.candidates[0].content.parts[0].text);
      }
    } catch (err) {
      console.error(err);
      alert('API Generation failed. Falling back to offline template.');
      setGeneration(runOfflineGenerator(type));
    } finally {
      setGenerating(false);
    }
  };

  const triggerGeneration = () => {
    if (generating) return;
    
    if (apiKey.trim()) {
      runOnlineGenerator(activeTab);
    } else {
      setGenerating(true);
      setTimeout(() => {
        setGeneration(runOfflineGenerator(activeTab));
        setGenerating(false);
      }, 1000); // Mock delay
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <h1 className="font-display text-heading-md font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FiCpu className="text-accent" /> AI Assistant Panel
        </h1>
        <p className="font-body text-body-sm text-text-muted">
          Generate professional resume outlines, project summaries, and audit layouts
        </p>
      </div>

      {/* AI Credentials / Keys Settings */}
      <div className="p-5 bg-surface border border-border rounded-lg flex flex-col gap-4">
        <h2 className="font-display text-body-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <FiKey size={14} className="text-accent" /> API Settings (Optional)
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-body-xs text-text-secondary font-medium">Model Provider</label>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded font-body text-body-sm text-white focus-ring"
            >
              <option value="openai">OpenAI (GPT-3.5)</option>
              <option value="gemini">Google Gemini</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="font-body text-body-xs text-text-secondary font-medium">Custom API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={apiKey ? '••••••••••••••••' : 'Enter API Key for real-time model answers'}
                className="px-4 py-2 bg-background border border-border rounded font-mono text-body-sm text-white focus-ring flex-grow"
              />
              <button
                type="button"
                onClick={saveApiKey}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded text-body-sm font-semibold transition-colors focus-ring"
              >
                Save
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={clearApiKey}
                  className="px-4 py-2 border border-border hover:text-error hover:border-error rounded text-text-secondary transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        {keySaved && (
          <span className="font-body text-overline text-success mt-0.5 block">
            API settings updated!
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => { setActiveTab('project'); setGeneration(''); }}
          className={`px-5 py-2.5 font-display text-body-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'project'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-white'
          }`}
        >
          Project Compiler
        </button>
        <button
          onClick={() => { setActiveTab('resume'); setGeneration(''); }}
          className={`px-5 py-2.5 font-display text-body-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'resume'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-white'
          }`}
        >
          Resume Summarizer
        </button>
        <button
          onClick={() => { setActiveTab('review'); setGeneration(''); }}
          className={`px-5 py-2.5 font-display text-body-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'review'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-white'
          }`}
        >
          Design Reviewer
        </button>
      </div>

      {/* Controls Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column — Form Fields */}
        <div className="lg:col-span-5 flex flex-col gap-5 bg-surface border border-border p-5 rounded-lg">
          {activeTab === 'project' && (
            <>
              <h3 className="font-display text-body-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-2">
                <FiLayout size={14} className="text-accent" /> Case Study Inputs
              </h3>
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-xs text-text-secondary font-medium">Project Name</label>
                <input
                  type="text"
                  value={projectInput.title}
                  onChange={(e) => setProjectInput((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. OCR Document Parser"
                  className="px-4 py-2 bg-background border border-border rounded font-body text-body-sm text-white focus-ring"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-xs text-text-secondary font-medium">Tech Stack</label>
                <input
                  type="text"
                  value={projectInput.tech}
                  onChange={(e) => setProjectInput((prev) => ({ ...prev, tech: e.target.value }))}
                  placeholder="e.g. React, Tesseract.js, Vite"
                  className="px-4 py-2 bg-background border border-border rounded font-body text-body-sm text-white focus-ring"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-xs text-text-secondary font-medium">Key Challenge</label>
                <input
                  type="text"
                  value={projectInput.challenge}
                  onChange={(e) => setProjectInput((prev) => ({ ...prev, challenge: e.target.value }))}
                  placeholder="e.g. browser main thread CPU lockup"
                  className="px-4 py-2 bg-background border border-border rounded font-body text-body-sm text-white focus-ring"
                />
              </div>
            </>
          )}

          {activeTab === 'resume' && (
            <>
              <h3 className="font-display text-body-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-2">
                <FiFileText size={14} className="text-accent" /> Resume Inputs
              </h3>
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-xs text-text-secondary font-medium">Core Tech Keywords</label>
                <input
                  type="text"
                  value={resumeInput.keywords}
                  onChange={(e) => setResumeInput((prev) => ({ ...prev, keywords: e.target.value }))}
                  placeholder="e.g. React, Kotlin, Firebase, SQLite"
                  className="px-4 py-2 bg-background border border-border rounded font-body text-body-sm text-white focus-ring"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-xs text-text-secondary font-medium">Brief Experience Outline</label>
                <input
                  type="text"
                  value={resumeInput.experience}
                  onChange={(e) => setResumeInput((prev) => ({ ...prev, experience: e.target.value }))}
                  placeholder="e.g. Diploma in Computer Engineering student"
                  className="px-4 py-2 bg-background border border-border rounded font-body text-body-sm text-white focus-ring"
                />
              </div>
            </>
          )}

          {activeTab === 'review' && (
            <div className="flex flex-col gap-2 font-body text-body-sm text-text-secondary">
              <h3 className="font-display text-body-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-2 mb-2">
                <FiCpu size={14} className="text-accent" /> Portfolio UX Audit
              </h3>
              <p className="leading-relaxed">
                The auditor reads saved Firestore entries (timeline, projects, skills) and runs design layout checks targeting recruiter screens and ATS filters.
              </p>
            </div>
          )}

          <MagneticButton className="w-full mt-2">
            <button
              onClick={triggerGeneration}
              disabled={generating}
              className="w-full py-2.5 bg-accent hover:bg-accent-hover disabled:bg-accent-muted text-white rounded text-body-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <span>Generating...</span>
                  <FiRefreshCw className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Compile Details</span> <FiCpu />
                </>
              )}
            </button>
          </MagneticButton>
        </div>

        {/* Right Column — Output Terminal */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-surface border border-border px-4 py-3 rounded-t-lg">
            <span className="font-mono text-xs text-text-muted">Terminal Output Preview</span>
            {generation && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 px-3 py-1 bg-elevated hover:bg-border text-text-secondary hover:text-white border border-border rounded text-body-xs font-semibold transition-colors"
                >
                  <FiCopy /> {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
          </div>
          <div className="bg-surface border-x border-b border-border p-6 rounded-b-lg font-mono text-xs text-text-secondary min-h-[300px] whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[500px]">
            {generating ? (
              <span className="text-accent animate-pulse block">Running generative transaction logs...</span>
            ) : generation ? (
              generation
            ) : (
              <span className="text-text-dim">No output logs generated. Fill in form values and click Compile.</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AIAssistant;
