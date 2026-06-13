import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/AuthContext';
import { db } from '@/firebase/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { personalInfo } from '@data/profile';
import { projectsData } from '@data/projects';
import { skillsData } from '@data/skills';
import { timelineData } from '@data/timeline';
import { FiUser, FiCode, FiClock, FiCheckSquare, FiAlertCircle, FiDatabase } from 'react-icons/fi';

export function DashboardOverview() {
  const { userProfile, currentUser, setUserProfile } = useAuth();
  const [stats, setStats] = useState({
    experience: 0,
    education: 0,
    projects: 0,
    skills: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  // Fetch telemetry counts from user sub-collections
  const fetchCounts = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoadingStats(true);
      const uid = currentUser.uid;

      const [expSnap, eduSnap, projSnap, skillsSnap] = await Promise.all([
        getDocs(collection(db, 'users', uid, 'experience')),
        getDocs(collection(db, 'users', uid, 'education')),
        getDocs(collection(db, 'users', uid, 'projects')),
        getDocs(collection(db, 'users', uid, 'skills')),
      ]);

      setStats({
        experience: expSnap.size,
        education: eduSnap.size,
        projects: projSnap.size,
        skills: skillsSnap.size,
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setLoadingStats(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);


  // Seeding routine: Migrates pre-existing local data into Firestore
  const handleSeedData = async () => {
    if (!currentUser || seeding) return;

    setSeeding(true);
    setSeedSuccess(false);

    try {
      const uid = currentUser.uid;

      // 1. Write core profile information (merge with existing registry elements like username)
      const mergedProfile = {
        ...userProfile,
        name: personalInfo.name,
        title: personalInfo.title,
        tagline: personalInfo.tagline,
        email: currentUser.email || personalInfo.email,
        location: personalInfo.location,
        bio: personalInfo.bio,
        heroDescription: personalInfo.hero.description,
        heroHeadlinePrefix: personalInfo.hero.headlinePrefix,
        heroHeadlineHighlight: personalInfo.hero.headlineHighlight,
        heroHeadlineSuffix: personalInfo.hero.headlineSuffix,
        availabilityStatus: personalInfo.hero.availabilityStatus,
        contactDescription: personalInfo.contact.description,
        contactSuccessMessage: personalInfo.contact.successMessage,
        about: personalInfo.about,
      };

      await setDoc(doc(db, 'users', uid), mergedProfile);
      setUserProfile(mergedProfile);

      // 2. Seed Timeline: Split timelineData into experience & education sub-collections
      for (const item of timelineData) {
        const docId = item.id || `seeded-item-${Date.now()}`;
        const targetColl = item.employmentType === 'Academic Studies' ? 'education' : 'experience';
        
        await setDoc(doc(db, 'users', uid, targetColl, docId), {
          id: docId,
          institution: item.company || '',
          company: item.company || '',
          degree: item.role || '',
          role: item.role || '',
          location: item.location || '',
          startDate: item.startDate || '',
          endDate: item.endDate || '',
          description: item.description || '',
          achievements: item.achievements || [],
          order: 0,
        });
      }

      // 3. Seed Projects
      for (const proj of projectsData) {
        await setDoc(doc(db, 'users', uid, 'projects', proj.id), {
          id: proj.id,
          slug: proj.slug,
          title: proj.title,
          category: proj.category,
          tagline: proj.tagline,
          description: proj.description,
          overview: proj.overview,
          challenge: proj.challenge,
          solution: proj.solution,
          goal: proj.goal || '',
          lessonsLearned: proj.lessonsLearned || '',
          architecture: proj.architecture || {},
          links: proj.links || {},
          media: proj.media || {},
          metrics: proj.metrics || [],
          featured: proj.featured || false,
          order: 0,
        });
      }

      // 4. Seed Skills: Store each category
      for (const cat of skillsData.categories) {
        await setDoc(doc(db, 'users', uid, 'skills', cat.id), {
          id: cat.id,
          categoryName: cat.name,
          description: cat.description || '',
          items: cat.items || [],
          order: 0,
        });
      }

      setSeedSuccess(true);
      await fetchCounts();
    } catch (err) {
      console.error('Migration error:', err);
      alert('Failed to migrate data. Please try again.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-1.5 border-b border-border pb-4">
        <h1 className="font-display text-heading-md md:text-heading-lg font-bold text-white uppercase tracking-wider">
          Workspace Overview
        </h1>
        <p className="font-body text-body-sm text-text-muted">
          Manage, customize, and analyze your public portfolio builder metrics
        </p>
      </div>

      {/* Profile Seeding Helper Callout */}
      {(stats.experience === 0 && stats.projects === 0) && (
        <div className="p-5 bg-accent/10 border border-accent/30 rounded-lg flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3 items-start">
            <FiDatabase className="text-accent w-6 h-6 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-display text-body-sm font-bold text-white">
                Initialize Portfolio Database
              </span>
              <p className="font-body text-body-sm text-text-secondary">
                Seed your dynamic Firestore tables with the pre-configured details of **John Doe** to start with a full layout.
              </p>
            </div>
          </div>
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded text-body-sm font-semibold transition-all duration-fast shrink-0 disabled:bg-accent-muted focus-ring"
          >
            {seeding ? 'Seeding Database...' : 'Migrate Static Profile'}
          </button>
        </div>
      )}

      {seedSuccess && (
        <div className="p-4 bg-success/15 border border-success/30 text-success rounded-md font-body text-body-sm flex items-center gap-2">
          <FiCheckSquare className="w-5 h-5" /> Seed transaction succeeded! Refreshing telemetry cards.
        </div>
      )}

      {/* Telemetry Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-5 bg-surface border border-border rounded-lg flex flex-col gap-2">
          <div className="text-text-muted flex items-center justify-between">
            <span className="font-body text-overline uppercase tracking-wider">Projects</span>
            <FiCode size={18} />
          </div>
          <span className="font-display text-heading-lg font-bold text-white">
            {loadingStats ? '...' : stats.projects}
          </span>
        </div>

        <div className="p-5 bg-surface border border-border rounded-lg flex flex-col gap-2">
          <div className="text-text-muted flex items-center justify-between">
            <span className="font-body text-overline uppercase tracking-wider">Experience</span>
            <FiClock size={18} />
          </div>
          <span className="font-display text-heading-lg font-bold text-white">
            {loadingStats ? '...' : stats.experience}
          </span>
        </div>

        <div className="p-5 bg-surface border border-border rounded-lg flex flex-col gap-2">
          <div className="text-text-muted flex items-center justify-between">
            <span className="font-body text-overline uppercase tracking-wider">Education</span>
            <FiClock size={18} />
          </div>
          <span className="font-display text-heading-lg font-bold text-white">
            {loadingStats ? '...' : stats.education}
          </span>
        </div>

        <div className="p-5 bg-surface border border-border rounded-lg flex flex-col gap-2">
          <div className="text-text-muted flex items-center justify-between">
            <span className="font-body text-overline uppercase tracking-wider">Skill Categories</span>
            <FiCheckSquare size={18} />
          </div>
          <span className="font-display text-heading-lg font-bold text-white">
            {loadingStats ? '...' : stats.skills}
          </span>
        </div>
      </div>

      {/* Checklist Guide */}
      <div className="p-6 bg-surface border border-border rounded-xl flex flex-col gap-4">
        <h3 className="font-display text-body-md font-bold text-white uppercase tracking-wider">
          Builder Setup Progress
        </h3>
        <div className="flex flex-col gap-3 font-body text-body-sm text-text-secondary">
          <div className="flex items-center gap-3">
            <FiCheckSquare className="text-success w-5 h-5 shrink-0" />
            <span>Claimed custom URL slug: <code className="text-accent underline font-mono">u/{userProfile?.username}</code></span>
          </div>
          <div className="flex items-center gap-3">
            <span className={userProfile?.name ? 'text-success' : 'text-text-muted'}>
              {userProfile?.name ? <FiCheckSquare size={20} /> : <FiAlertCircle size={20} />}
            </span>
            <span>Configure profile descriptors and headers.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={stats.projects > 0 ? 'text-success' : 'text-text-muted'}>
              {stats.projects > 0 ? <FiCheckSquare size={20} /> : <FiAlertCircle size={20} />}
            </span>
            <span>Add technical case studies with goals, solutions, and metrics.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={userProfile?.resumeUrl ? 'text-success' : 'text-text-muted'}>
              {userProfile?.resumeUrl ? <FiCheckSquare size={20} /> : <FiAlertCircle size={20} />}
            </span>
            <span>Upload PDF resume for direct recruiter tracking.</span>
          </div>
        </div>
      </div>

      {/* Profile quick controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/dashboard/profile"
          className="p-5 bg-surface border border-border hover:border-border-hover rounded-lg flex items-center gap-4 transition-colors focus-ring"
        >
          <div className="p-3 bg-elevated border border-border text-accent rounded-md">
            <FiUser size={20} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-display text-body-sm font-bold text-white">Edit Personal Info</span>
            <span className="font-body text-body-sm text-text-muted">Update headline, availability status, and bios.</span>
          </div>
        </Link>

        <Link
          to="/dashboard/projects"
          className="p-5 bg-surface border border-border hover:border-border-hover rounded-lg flex items-center gap-4 transition-colors focus-ring"
        >
          <div className="p-3 bg-elevated border border-border text-accent rounded-md">
            <FiCode size={20} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-display text-body-sm font-bold text-white">Manage Case Studies</span>
            <span className="font-body text-body-sm text-text-muted">Add new projects or edit existing ones.</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default DashboardOverview;
