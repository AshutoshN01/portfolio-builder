import { useState } from 'react';
import { useAuth } from '@hooks/AuthContext';
import { db } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FiSave, FiCheckCircle } from 'react-icons/fi';
import { MagneticButton } from '@components/MagneticButton';

export function EditProfile() {
  const { userProfile, currentUser, setUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    title: userProfile?.title || '',
    tagline: userProfile?.tagline || '',
    location: userProfile?.location || '',
    bio: userProfile?.bio || '',
    heroDescription: userProfile?.heroDescription || '',
    heroHeadlinePrefix: userProfile?.heroHeadlinePrefix || '',
    heroHeadlineHighlight: userProfile?.heroHeadlineHighlight || '',
    heroHeadlineSuffix: userProfile?.heroHeadlineSuffix || '',
    availabilityStatus: userProfile?.availabilityStatus || '',
    contactDescription: userProfile?.contactDescription || '',
    contactSuccessMessage: userProfile?.contactSuccessMessage || '',
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.title.trim()) tempErrors.title = 'Professional title is required';
    if (!formData.tagline.trim()) tempErrors.tagline = 'Tagline is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !currentUser) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const updatedProfile = {
        ...userProfile,
        ...formData,
      };

      await setDoc(docRef, updatedProfile);
      setUserProfile(updatedProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Save profile failure:', err);
      alert('Failed to save profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <h1 className="font-display text-heading-md font-bold text-white uppercase tracking-wider">
          Edit Personal Details
        </h1>
        <p className="font-body text-body-sm text-text-muted">
          Modify your personal descriptions, bio, and main dashboard values
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        {saveSuccess && (
          <div className="p-4 bg-success/15 border border-success/30 text-success rounded-md font-body text-body-sm flex items-center gap-2" role="alert">
            <FiCheckCircle className="w-5 h-5 shrink-0" /> Profile details saved successfully!
          </div>
        )}

        {/* Section 1: Main Credentials */}
        <div className="p-6 bg-surface border border-border rounded-lg flex flex-col gap-5">
          <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-widest border-b border-border pb-2">
            1. Core Credentials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="font-body text-body-sm text-text-secondary font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`px-4 py-2.5 bg-background border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover ${
                  errors.name ? 'border-error' : 'border-border'
                }`}
                disabled={saving}
                required
              />
              {errors.name && <span className="font-body text-overline text-error">{errors.name}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="font-body text-body-sm text-text-secondary font-medium">
                Professional Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`px-4 py-2.5 bg-background border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover ${
                  errors.title ? 'border-error' : 'border-border'
                }`}
                disabled={saving}
                required
              />
              {errors.title && <span className="font-body text-overline text-error">{errors.title}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="tagline" className="font-body text-body-sm text-text-secondary font-medium">
              Profile Tagline
            </label>
            <input
              type="text"
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleInputChange}
              className={`px-4 py-2.5 bg-background border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover ${
                errors.tagline ? 'border-error' : 'border-border'
              }`}
              disabled={saving}
              required
            />
            {errors.tagline && <span className="font-body text-overline text-error">{errors.tagline}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="location" className="font-body text-body-sm text-text-secondary font-medium">
                Location (City, State, Country)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                disabled={saving}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="availabilityStatus" className="font-body text-body-sm text-text-secondary font-medium">
                Availability Status
              </label>
              <input
                type="text"
                id="availabilityStatus"
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                disabled={saving}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bio" className="font-body text-body-sm text-text-secondary font-medium">
              Professional Biography
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleInputChange}
              className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover resize-none"
              disabled={saving}
            />
          </div>
        </div>

        {/* Section 2: Visual Hero Folds */}
        <div className="p-6 bg-surface border border-border rounded-lg flex flex-col gap-5">
          <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-widest border-b border-border pb-2">
            2. Hero Fold Styling
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="heroHeadlinePrefix" className="font-body text-body-sm text-text-secondary font-medium">
                Headline Prefix
              </label>
              <input
                type="text"
                id="heroHeadlinePrefix"
                name="heroHeadlinePrefix"
                value={formData.heroHeadlinePrefix}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                disabled={saving}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="heroHeadlineHighlight" className="font-body text-body-sm text-text-secondary font-medium">
                Headline Highlight
              </label>
              <input
                type="text"
                id="heroHeadlineHighlight"
                name="heroHeadlineHighlight"
                value={formData.heroHeadlineHighlight}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                disabled={saving}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="heroHeadlineSuffix" className="font-body text-body-sm text-text-secondary font-medium">
                Headline Suffix
              </label>
              <input
                type="text"
                id="heroHeadlineSuffix"
                name="heroHeadlineSuffix"
                value={formData.heroHeadlineSuffix}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                disabled={saving}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="heroDescription" className="font-body text-body-sm text-text-secondary font-medium">
              Hero Description Text
            </label>
            <textarea
              id="heroDescription"
              name="heroDescription"
              rows={3}
              value={formData.heroDescription}
              onChange={handleInputChange}
              className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover resize-none"
              disabled={saving}
            />
          </div>
        </div>

        {/* Section 3: Contact Settings */}
        <div className="p-6 bg-surface border border-border rounded-lg flex flex-col gap-5">
          <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-widest border-b border-border pb-2">
            3. Inquiries Configuration
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contactDescription" className="font-body text-body-sm text-text-secondary font-medium">
                Form Description Title
              </label>
              <input
                type="text"
                id="contactDescription"
                name="contactDescription"
                value={formData.contactDescription}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                disabled={saving}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contactSuccessMessage" className="font-body text-body-sm text-text-secondary font-medium">
                Transmission Success Feedback
              </label>
              <input
                type="text"
                id="contactSuccessMessage"
                name="contactSuccessMessage"
                value={formData.contactSuccessMessage}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <MagneticButton className="w-fit self-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-accent hover:bg-accent-hover disabled:bg-accent-muted text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center gap-2 hover:shadow-accent"
          >
            {saving ? (
              <>
                <span>Saving Details...</span>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </>
            ) : (
              <>
                <span>Save Profile Changes</span> <FiSave />
              </>
            )}
          </button>
        </MagneticButton>
      </form>
    </div>
  );
}

export default EditProfile;
