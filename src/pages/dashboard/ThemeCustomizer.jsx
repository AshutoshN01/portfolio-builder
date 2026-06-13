import { useState, useEffect } from 'react';
import { useAuth } from '@hooks/AuthContext';
import { db } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FiSave, FiCheckCircle, FiCheck } from 'react-icons/fi';
import { MagneticButton } from '@components/MagneticButton';

const colorPresets = [
  { name: 'Cobalt Steel Blue', primary: '#3B82F6', glow: 'rgba(59, 130, 246, 0.15)' },
  { name: 'Cyber Emerald', primary: '#10B981', glow: 'rgba(16, 185, 129, 0.15)' },
  { name: 'Solar Gold', primary: '#F59E0B', glow: 'rgba(245, 158, 11, 0.15)' },
  { name: 'Crimson Red', primary: '#EF4444', glow: 'rgba(239, 68, 68, 0.15)' },
  { name: 'Neon Violet', primary: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.15)' },
];

const fontPresets = [
  { name: 'Inter & Syne (Standard)', value: 'Inter' },
  { name: 'Roboto & Outfit', value: 'Roboto' },
  { name: 'Outfit & Outfit', value: 'Outfit' },
];

export function ThemeCustomizer() {
  const { userProfile, currentUser, setUserProfile } = useAuth();

  const [activeColor, setActiveColor] = useState(
    colorPresets.find((c) => c.primary === userProfile?.theme?.accentColor) || colorPresets[0]
  );
  
  const [activeFont, setActiveFont] = useState(userProfile?.theme?.fontFamily || 'Inter');
  const [layoutType, setLayoutType] = useState(userProfile?.theme?.layoutType || 'Grid'); // 'Grid' | 'List'

  useEffect(() => {
    if (userProfile?.theme) {
      const preset = colorPresets.find((c) => c.primary === userProfile.theme.accentColor);
      if (preset) setActiveColor(preset);
      if (userProfile.theme.fontFamily) setActiveFont(userProfile.theme.fontFamily);
      if (userProfile.theme.layoutType) setLayoutType(userProfile.theme.layoutType);
    }
  }, [userProfile]);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveTheme = async () => {
    if (!currentUser) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const updatedProfile = {
        ...userProfile,
        theme: {
          accentColor: activeColor.primary,
          backgroundGlow: activeColor.glow,
          fontFamily: activeFont,
          layoutType,
        },
      };

      await setDoc(docRef, updatedProfile);
      setUserProfile(updatedProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Theme save error:', err);
      alert('Failed to save styling changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <h1 className="font-display text-heading-md font-bold text-white uppercase tracking-wider">
          Theme Customizer
        </h1>
        <p className="font-body text-body-sm text-text-muted">
          Personalise the color branding and typography system of your public site
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {saveSuccess && (
          <div className="p-4 bg-success/15 border border-success/30 text-success rounded-md font-body text-body-sm flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5 shrink-0" /> Theme styling saved successfully!
          </div>
        )}

        {/* Brand color presets */}
        <div className="p-6 bg-surface border border-border rounded-lg flex flex-col gap-4">
          <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-widest border-b border-border pb-2">
            1. Brand Accent Color
          </h2>
          <div className="flex flex-col gap-3">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setActiveColor(preset)}
                className={`p-4 bg-background border rounded-lg flex items-center justify-between text-left transition-all focus-ring hover:border-border-hover ${
                  activeColor.primary === preset.primary ? 'border-accent' : 'border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <span className="font-display text-body-sm font-bold text-white">
                    {preset.name}
                  </span>
                </div>
                {activeColor.primary === preset.primary && <FiCheck className="text-accent w-5 h-5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Font Selection */}
        <div className="p-6 bg-surface border border-border rounded-lg flex flex-col gap-4">
          <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-widest border-b border-border pb-2">
            2. Typography Scheme
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {fontPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setActiveFont(preset.value)}
                className={`p-4 bg-background border rounded-lg text-center font-body text-body-sm font-semibold transition-all focus-ring hover:border-border-hover ${
                  activeFont === preset.value ? 'border-accent text-white' : 'border-border text-text-muted'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Mode */}
        <div className="p-6 bg-surface border border-border rounded-lg flex flex-col gap-4">
          <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-widest border-b border-border pb-2">
            3. Project Grid Layout Type
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setLayoutType('Grid')}
              className={`p-4 bg-background border rounded-lg text-center font-body text-body-sm font-semibold transition-all focus-ring hover:border-border-hover ${
                layoutType === 'Grid' ? 'border-accent text-white' : 'border-border text-text-muted'
              }`}
            >
              Standard Grid Cards
            </button>
            <button
              type="button"
              onClick={() => setLayoutType('List')}
              className={`p-4 bg-background border rounded-lg text-center font-body text-body-sm font-semibold transition-all focus-ring hover:border-border-hover ${
                layoutType === 'List' ? 'border-accent text-white' : 'border-border text-text-muted'
              }`}
            >
              Compact Horizontal Lists
            </button>
          </div>
        </div>

        {/* Save */}
        <MagneticButton className="w-fit self-end">
          <button
            onClick={handleSaveTheme}
            disabled={saving}
            className="px-6 py-3 bg-accent hover:bg-accent-hover disabled:bg-accent-muted text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center gap-2 hover:shadow-accent"
          >
            {saving ? (
              <>
                <span>Saving Styling...</span>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </>
            ) : (
              <>
                <span>Save Styling Preset</span> <FiSave />
              </>
            )}
          </button>
        </MagneticButton>
      </div>
    </div>
  );
}

export default ThemeCustomizer;
