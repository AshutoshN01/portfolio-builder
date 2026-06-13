import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiWifi, FiRefreshCw, FiCopy, FiInfo } from 'react-icons/fi';
import { isFirebaseInitialized, missingFirebaseEnv } from '@/firebase/firebase';

export function FirebaseDiagnostics() {
  const [copied, setCopied] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);
  const [running, setRunning] = useState(false);

  const runHealthCheck = async () => {
    setRunning(true);
    // Simulate slight network probe delay for micro-animation feel
    await new Promise((r) => setTimeout(r, 600));

    const envKeys = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID',
    ];

    const envDetails = envKeys.map((key) => {
      const val = import.meta.env[key];
      return {
        key,
        exists: !!val,
        value: val ? `${val.substring(0, 6)}... (loaded)` : 'Missing / Unset',
      };
    });

    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    setHealthStatus({
      initialized: isFirebaseInitialized,
      missingCount: missingFirebaseEnv.length,
      envDetails,
      online: isOnline,
      firestore: isFirebaseInitialized ? 'Active (Ready for queries)' : 'Disabled (No configuration)',
      auth: isFirebaseInitialized ? 'Active (Ready for sessions)' : 'Disabled (No configuration)',
    });
    setRunning(false);
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const copyTemplate = () => {
    const template = `# Centralized Firebase Environment Config\n` +
      `VITE_FIREBASE_API_KEY=your_api_key_here\n` +
      `VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com\n` +
      `VITE_FIREBASE_PROJECT_ID=your_project_id\n` +
      `VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id\n` +
      `VITE_FIREBASE_APP_ID=your_app_id\n`;
    
    navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 md:p-8 font-body">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_60%)] pointer-events-none" />
      
      <div className="w-full max-w-2xl bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl shadow-xl overflow-hidden relative z-10 flex flex-col gap-6 p-6 md:p-8 transition-all duration-300 hover:border-blue-900/30">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#1A1A1A] pb-5 gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-display text-overline text-[#3B82F6] uppercase tracking-widest font-bold">
              System Diagnostics
            </span>
            <h1 className="font-display text-heading-lg font-extrabold text-white tracking-tight uppercase">
              Firebase Configuration Audit
            </h1>
          </div>
          <button
            onClick={runHealthCheck}
            disabled={running}
            className="p-2 border border-[#1A1A1A] hover:border-[#2A2A2A] text-text-secondary hover:text-white rounded-lg transition-colors flex items-center gap-1.5 focus-ring disabled:opacity-50"
            title="Re-run Diagnostics"
          >
            <FiRefreshCw size={16} className={running ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Status Callout Banner */}
        {healthStatus && (
          <div className={`p-5 rounded-xl border flex items-start gap-4 ${
            healthStatus.initialized
              ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
              : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
          }`}>
            {healthStatus.initialized ? (
              <FiCheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
            ) : (
              <FiXCircle className="w-6 h-6 shrink-0 mt-0.5 animate-pulse" />
            )}
            <div className="flex flex-col gap-1">
              <span className="font-display text-body-sm font-extrabold uppercase tracking-wide text-white">
                {healthStatus.initialized ? 'Firebase Initialized Successfully' : 'Firebase Initialization Failed'}
              </span>
              <p className="font-body text-body-sm text-text-secondary">
                {healthStatus.initialized 
                  ? 'All required variables are present. Firestore, Auth, and Storage services are ready.'
                  : `Detected ${healthStatus.missingCount} missing environment configuration variables. Database operations have been locked.`
                }
              </p>
            </div>
          </div>
        )}

        {/* Environmental Variable Audit Checklist */}
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-widest border-b border-[#1A1A1A] pb-2 flex items-center gap-2">
            <FiInfo size={16} className="text-[#3B82F6]" /> Environment Checklist
          </h2>
          {healthStatus && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {healthStatus.envDetails.map((v) => (
                <div key={v.key} className="p-3 bg-[#050505] border border-[#1A1A1A] rounded-lg flex items-center justify-between gap-4">
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-mono text-[10px] text-text-dim truncate">{v.key}</span>
                    <span className="font-mono text-xs text-white truncate mt-0.5">{v.value}</span>
                  </div>
                  {v.exists ? (
                    <FiCheckCircle className="text-[#22C55E] w-5 h-5 shrink-0" />
                  ) : (
                    <FiXCircle className="text-[#EF4444] w-5 h-5 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Diagnostic Probes */}
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-widest border-b border-[#1A1A1A] pb-2 flex items-center gap-2">
            <FiAlertTriangle size={16} className="text-[#F59E0B]" /> Service Health Probes
          </h2>
          {healthStatus && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between text-body-sm text-text-muted p-2 bg-[#111111]/30 rounded">
                <span>Network Status</span>
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <FiWifi size={14} className={healthStatus.online ? 'text-[#22C55E]' : 'text-[#EF4444]'} />
                  {healthStatus.online ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between text-body-sm text-text-muted p-2 bg-[#111111]/30 rounded">
                <span>Auth Module</span>
                <span className={`font-semibold ${healthStatus.initialized ? 'text-[#22C55E]' : 'text-text-dim'}`}>
                  {healthStatus.auth}
                </span>
              </div>
              <div className="flex items-center justify-between text-body-sm text-text-muted p-2 bg-[#111111]/30 rounded">
                <span>Firestore Database</span>
                <span className={`font-semibold ${healthStatus.initialized ? 'text-[#22C55E]' : 'text-text-dim'}`}>
                  {healthStatus.firestore}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Remediations Instructions */}
        {!isFirebaseInitialized && (
          <div className="p-5 bg-yellow-950/10 border border-yellow-900/30 rounded-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#F59E0B] font-display text-body-xs font-bold uppercase tracking-wider">
              <FiAlertTriangle /> How to Configure Locally
            </div>
            
            <ol className="list-decimal list-inside font-body text-body-sm text-text-secondary flex flex-col gap-2 leading-relaxed">
              <li>
                Create a file named <code className="bg-[#050505] px-1.5 py-0.5 rounded font-mono text-white">.env</code> in your project root:
                <br />
                <span className="text-text-dim text-[11px] block mt-0.5 ml-4">Path: c:\Users\dell\OneDrive\Desktop\new bash\portfolio_Framer\.env</span>
              </li>
              <li>Add the configuration block with your credentials.</li>
              <li>Restart the development server using <code className="bg-[#050505] px-1.5 py-0.5 rounded font-mono text-white">npm run dev</code>.</li>
            </ol>

            <button
              onClick={copyTemplate}
              className="mt-2 self-start px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-body-xs font-semibold rounded-md border border-[#2a2a2a] transition-all flex items-center gap-1.5 focus-ring"
            >
              {copied ? (
                <>
                  <FiCheckCircle className="text-[#22C55E]" /> Template Copied!
                </>
              ) : (
                <>
                  <FiCopy /> Copy .env Template
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default FirebaseDiagnostics;
