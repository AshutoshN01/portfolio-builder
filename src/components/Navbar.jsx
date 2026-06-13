import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiArrowUpRight } from 'react-icons/fi';
import { usePortfolioData } from '@hooks/usePortfolioData';
import { MagneticButton } from '@components/MagneticButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusTrap } from '@hooks/useFocusTrap';
import { trackEvent } from '@utils/analytics';
import { db } from '@/firebase/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '@hooks/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { personalInfo, timelineData, projectsData, skillsData } = usePortfolioData();
  const { currentUser, userProfile } = useAuth();

  
  const pathParts = location.pathname.split('/');
  const isPortfolioRoute = pathParts[1]?.toLowerCase() === 'u' && pathParts[2];
  const username = isPortfolioRoute ? pathParts[2] : '';
  
  // Static single-user view is active when pathname starts with /static or /project (without /u)
  const isStatic = pathParts[1]?.toLowerCase() === 'static' || pathParts[1]?.toLowerCase() === 'project';

  const [portfolioMeta, setPortfolioMeta] = useState(null);

  // Trap focus inside the drawer when mobile nav is active
  useFocusTrap(menuRef, isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch portfolio route metadata directly when username changes
  useEffect(() => {
    if (!isPortfolioRoute || !username) {
      setPortfolioMeta(null);
      return;
    }

    const fetchMeta = async () => {
      try {
        const cleanUsername = username.toLowerCase().trim();
        const usernameSnap = await getDoc(doc(db, 'usernames', cleanUsername));
        if (usernameSnap.exists()) {
          const uid = usernameSnap.data().uid;
          const userSnap = await getDoc(doc(db, 'users', uid));
          if (userSnap.exists()) {
            const profile = userSnap.data();

            // Check counts of sub-collections to dynamically hide/show links
            const [expSnap, eduSnap, projSnap, skillsSnap] = await Promise.all([
              getDocs(collection(db, 'users', uid, 'experience')),
              getDocs(collection(db, 'users', uid, 'education')),
              getDocs(collection(db, 'users', uid, 'projects')),
              getDocs(collection(db, 'users', uid, 'skills')),
            ]);

            setPortfolioMeta({
              name: profile.name,
              resumeUrl: profile.resumeUrl,
              hasAbout: profile.about && (
                (profile.about.specialties && profile.about.specialties.length > 0) ||
                (profile.about.highlights && profile.about.highlights.length > 0) ||
                (profile.about.values && profile.about.values.length > 0) ||
                (profile.about.workingStyle && profile.about.workingStyle.length > 0)
              ),
              hasSkills: skillsSnap.size > 0,
              hasProjects: projSnap.size > 0,
              hasTimeline: (expSnap.size + eduSnap.size) > 0,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching navbar portfolio meta:', err);
      }
    };

    fetchMeta();
  }, [username, isPortfolioRoute]);

  // Hide the global navigation header when in the administrative dashboard
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }

  // Dynamically compile active navigation links based on loaded or static content
  const navLinks = [];

  if (isPortfolioRoute || isStatic) {
    let showAbout = true;
    let showSkills = true;
    let showProjects = true;
    let showTimeline = true;

    if (isPortfolioRoute) {
      if (portfolioMeta) {
        showAbout = portfolioMeta.hasAbout;
        showSkills = portfolioMeta.hasSkills;
        showProjects = portfolioMeta.hasProjects;
        showTimeline = portfolioMeta.hasTimeline;
      } else {
        // Hide everything until metadata loads to prevent flash of wrong links
        showAbout = false;
        showSkills = false;
        showProjects = false;
        showTimeline = false;
      }
    } else {
      // If static view (e.g. /static)
      showAbout = !!(personalInfo?.about && (
        (personalInfo.about.specialties && personalInfo.about.specialties.length > 0) ||
        (personalInfo.about.highlights && personalInfo.about.highlights.length > 0) ||
        (personalInfo.about.values && personalInfo.about.values.length > 0) ||
        (personalInfo.about.workingStyle && personalInfo.about.workingStyle.length > 0)
      ));
      showSkills = !!(skillsData?.categories && skillsData.categories.length > 0);
      showProjects = !!(projectsData && projectsData.length > 0);
      showTimeline = !!(timelineData && timelineData.length > 0);
    }

    const basePrefix = isStatic ? '/static' : `/u/${username}`;
    if (showAbout) navLinks.push({ name: 'About', path: `${basePrefix}#about` });
    if (showSkills) navLinks.push({ name: 'Skills', path: `${basePrefix}#skills` });
    if (showProjects) navLinks.push({ name: 'Projects', path: `${basePrefix}#projects` });
    if (showTimeline) navLinks.push({ name: 'Timeline', path: `${basePrefix}#timeline` });
    
    // Contact section is always present once loaded
    if (!isPortfolioRoute || portfolioMeta) {
      navLinks.push({ name: 'Contact', path: `${basePrefix}#contact` });
    }
  } else {
    // Platform pages (Marketing, Login, Register, etc.)
    navLinks.push({ name: 'Features', path: '/#features' });
    if (currentUser) {
      navLinks.push({ name: 'Dashboard', path: '/dashboard' });
      if (userProfile?.username) {
        navLinks.push({ name: 'My Portfolio', path: `/u/${userProfile.username}` });
      }
    } else {
      navLinks.push({ name: 'Login', path: '/login' });
      navLinks.push({ name: 'Register', path: '/register' });
    }
  }

  const handleNavClick = (e, path) => {
    e.preventDefault();
    setIsOpen(false);

    const hashIndex = path.indexOf('#');
    const hash = hashIndex !== -1 ? path.substring(hashIndex) : '';
    const baseRoute = isStatic ? '/static' : (isPortfolioRoute ? `/u/${username}` : '/');

    // Normalize: strip trailing slashes for comparison
    const currentPathClean = location.pathname.replace(/\/$/, '');
    const baseRouteClean = baseRoute.replace(/\/$/, '');

    // Check if we are already on the base page (case-insensitive)
    const isOnBase = currentPathClean.toLowerCase() === baseRouteClean.toLowerCase();
    const isOnProjectSubRoute = currentPathClean.toLowerCase().startsWith(baseRouteClean.toLowerCase() + '/');

    if (!isOnBase && !isOnProjectSubRoute) {
      // On a completely different page - full navigation
      navigate(baseRoute + hash);
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 200);
      }
    } else if (isOnProjectSubRoute) {
      // On a project sub-route, navigate to base + hash
      navigate(baseRoute + hash);
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 200);
      }
    } else {
      // Already on the base page — pure smooth scroll, no navigation
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const displayName = isPortfolioRoute 
    ? (portfolioMeta?.name || username.charAt(0).toUpperCase() + username.slice(1)) 
    : (isStatic ? (personalInfo?.name || 'Portfolio') : 'DevPortfolio');

  const resumeUrl = isPortfolioRoute ? (portfolioMeta?.resumeUrl || '') : (personalInfo?.resumeUrl || '');

  // Render secondary action button dynamically
  const renderActionButton = (isMobile = false) => {
    if (isPortfolioRoute || isStatic) {
      if (!resumeUrl) return null;
      return (
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('resume_download', { method: isMobile ? 'mobile_nav' : 'desktop_nav' })}
          className={
            isMobile
              ? "flex items-center justify-between w-full px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-md text-body-md font-medium text-center transition-colors duration-fast focus-ring"
              : "inline-flex items-center gap-1.5 px-4 py-2 border border-border hover:border-border-hover text-text-secondary hover:text-white rounded-md text-body-sm font-medium transition-all duration-fast focus-ring scale-active"
          }
        >
          {isMobile ? <span>Download CV</span> : 'CV'}
          <FiArrowUpRight className={isMobile ? "" : "text-text-muted group-hover:text-white transition-colors duration-fast"} />
        </a>
      );
    } else {
      // Platform page actions
      const targetPath = currentUser ? '/dashboard' : '/register';
      const targetLabel = currentUser ? 'Dashboard' : 'Build Portfolio';
      if (isMobile) {
        return (
          <Link
            to={targetPath}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between w-full px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-md text-body-md font-medium text-center transition-colors duration-fast focus-ring"
          >
            <span>{targetLabel}</span>
            <FiArrowUpRight />
          </Link>
        );
      } else {
        return (
          <Link
            to={targetPath}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring scale-active"
          >
            <span>{targetLabel}</span>
            <FiArrowUpRight />
          </Link>
        );
      }
    }
  };

  const desktopButton = renderActionButton(false);
  const mobileButton = renderActionButton(true);

  return (
    <>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-[99] px-4 py-2.5 bg-accent text-white font-body text-body-sm font-semibold rounded-md shadow-lg border border-border focus-ring"
      >
        Skip to content
      </a>

      <header
        className={`fixed top-0 left-0 w-full z-navbar transition-all duration-fast ${
          scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container-main flex items-center justify-between">
          {/* Logo / Name */}
          <Link
            to={isStatic ? '/static' : (isPortfolioRoute ? `/u/${username}` : '/')}
            className="font-display text-heading-sm md:text-heading-md font-bold tracking-tight text-white hover:text-accent-hover transition-colors duration-fast focus-ring rounded"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {displayName}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Desktop navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="font-body text-body-sm text-text-muted hover:text-white transition-colors duration-fast focus-ring rounded px-2 py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Button (Resume or Dashboard/Register) */}
          <div className="hidden md:block">
            {desktopButton && (
              <MagneticButton>
                {desktopButton}
              </MagneticButton>
            )}
          </div>

          {/* Mobile Nav Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="block md:hidden text-white hover:text-accent focus-ring p-1 rounded"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden absolute top-[100%] left-0 w-full bg-surface border-b border-border py-6 px-4 z-navbar overflow-hidden"
            >
              <nav className="flex flex-col gap-5" aria-label="Mobile navigation list">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className="font-body text-body-md text-text-muted hover:text-white transition-colors duration-fast focus-ring rounded py-1 px-2"
                  >
                    {link.name}
                  </a>
                ))}
                {mobileButton}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Navbar;
