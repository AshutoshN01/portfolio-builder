import { useState, useEffect } from 'react';
import { useAuth } from '@hooks/AuthContext';
import { db } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FiSave, FiCheckCircle, FiFileText } from 'react-icons/fi';
import { MagneticButton } from '@components/MagneticButton';

export function ResumeUpload() {
  const { userProfile, currentUser, setUserProfile } = useAuth();
  const [resumeUrl, setResumeUrl] = useState(userProfile?.resumeUrl || '');
  const [savingResume, setSavingResume] = useState(false);
  const [resumeSaveSuccess, setResumeSaveSuccess] = useState(false);

  // Analytics settings
  const [gaId, setGaId] = useState(userProfile?.analytics?.gaId || '');
  const [plausibleDomain, setPlausibleDomain] = useState(userProfile?.analytics?.plausibleDomain || '');
  const [enableVercel, setEnableVercel] = useState(userProfile?.analytics?.enableVercel || false);
  const [savingAnalytics, setSavingAnalytics] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state with profile loaded asynchronously
  useEffect(() => {
    if (userProfile) {
      setResumeUrl(userProfile.resumeUrl || '');
      setGaId(userProfile.analytics?.gaId || '');
      setPlausibleDomain(userProfile.analytics?.plausibleDomain || '');
      setEnableVercel(userProfile.analytics?.enableVercel || false);
    }
  }, [userProfile]);

  const handleSaveResume = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setSavingResume(true);
    setResumeSaveSuccess(false);

    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const updatedProfile = {
        ...userProfile,
        resumeUrl: resumeUrl.trim(),
      };
      await setDoc(docRef, updatedProfile);
      setUserProfile(updatedProfile);
      setResumeSaveSuccess(true);
      setTimeout(() => setResumeSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Resume URL save error:', err);
      alert('Failed to save resume URL.');
    } finally {
      setSavingResume(false);
    }
  };

  const handleSaveAnalytics = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setSavingAnalytics(true);
    setSaveSuccess(false);

    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const updatedProfile = {
        ...userProfile,
        analytics: {
          gaId: gaId.trim(),
          plausibleDomain: plausibleDomain.trim(),
          enableVercel,
        },
      };

      await setDoc(docRef, updatedProfile);
      setUserProfile(updatedProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Analytics config save error:', err);
      alert('Failed to save analytics settings.');
    } finally {
      setSavingAnalytics(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <h1 className="font-display text-heading-md font-bold text-white uppercase tracking-wider">
          Resume & Analytics Configuration
        </h1>
        <p className="font-body text-body-sm text-text-muted">
          Manage your resume URL link and tracking identifiers
        </p>
      </div>

      {/* Resume Document Link Input */}
      <form onSubmit={handleSaveResume} className="p-6 bg-surface border border-border rounded-lg flex flex-col gap-4">
        <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-widest border-b border-border pb-2 flex items-center gap-2">
          <FiFileText className="text-accent" /> 1. Professional Resume Link
        </h2>

        {resumeSaveSuccess && (
          <div className="p-4 bg-success/15 border border-success/30 text-success rounded-md font-body text-body-sm flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5 shrink-0" /> Resume link saved successfully!
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="resumeUrl" className="font-body text-body-sm text-text-secondary font-medium">
            Resume Document URL (PDF Link, Google Drive, Dropbox, etc.)
          </label>
          <input
            type="url"
            id="resumeUrl"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="e.g. https://drive.google.com/file/d/... or https://yourdomain.com/resume.pdf"
            className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
            disabled={savingResume}
          />
        </div>

        <MagneticButton className="w-fit self-end mt-2">
          <button
            type="submit"
            disabled={savingResume}
            className="px-6 py-2.5 bg-accent hover:bg-accent-hover disabled:bg-accent-muted text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center gap-2 hover:shadow-accent"
          >
            {savingResume ? 'Saving...' : 'Save Resume Link'} <FiSave />
          </button>
        </MagneticButton>
      </form>

      {/* Analytics IDs Forms */}
      <form onSubmit={handleSaveAnalytics} className="p-6 bg-surface border border-border rounded-lg flex flex-col gap-5" noValidate>
        <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-widest border-b border-border pb-2">
          2. Analytics Metrics Tags
        </h2>

        {saveSuccess && (
          <div className="p-4 bg-success/15 border border-success/30 text-success rounded-md font-body text-body-sm flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5 shrink-0" /> Analytics configurations saved successfully!
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="gaId" className="font-body text-body-sm text-text-secondary font-medium">
              Google Analytics 4 Measurement ID
            </label>
            <input
              type="text"
              id="gaId"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              placeholder="e.g. G-XXXXXXXXXX"
              className="px-4 py-2.5 bg-background border border-border rounded-md font-mono text-body-sm text-white focus-ring"
              disabled={savingAnalytics}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="plausibleDomain" className="font-body text-body-sm text-text-secondary font-medium">
              Plausible Domain
            </label>
            <input
              type="text"
              id="plausibleDomain"
              value={plausibleDomain}
              onChange={(e) => setPlausibleDomain(e.target.value)}
              placeholder="e.g. yourportfolio.com"
              className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
              disabled={savingAnalytics}
            />
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            <input
              type="checkbox"
              id="enableVercel"
              checked={enableVercel}
              onChange={(e) => setEnableVercel(e.target.checked)}
              className="w-4 h-4 rounded text-accent bg-background border-border focus-ring"
              disabled={savingAnalytics}
            />
            <label htmlFor="enableVercel" className="font-body text-body-sm text-white font-medium select-none">
              Inject Vercel Web Analytics tracking layer
            </label>
          </div>
        </div>

        <MagneticButton className="w-fit self-end mt-2">
          <button
            type="submit"
            disabled={savingAnalytics}
            className="px-6 py-2.5 bg-accent hover:bg-accent-hover disabled:bg-accent-muted text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center gap-2 hover:shadow-accent"
          >
            {savingAnalytics ? 'Saving...' : 'Save Settings'} <FiSave />
          </button>
        </MagneticButton>
      </form>
    </div>
  );
}

export default ResumeUpload;
