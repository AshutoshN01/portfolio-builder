import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/AuthContext';
import { applyTheme } from '@utils/theme';
import {
  FiGrid,
  FiUser,
  FiClock,
  FiCode,
  FiSliders,
  FiCpu,
  FiFileText,
  FiShield,
  FiLogOut,
  FiMenu,
  FiX,
  FiTrendingUp,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load dashboard pages
import DashboardOverview from '@pages/dashboard/DashboardOverview';
import EditProfile from '@pages/dashboard/EditProfile';
import EditTimeline from '@pages/dashboard/EditTimeline';
import EditProjects from '@pages/dashboard/EditProjects';
import EditSkills from '@pages/dashboard/EditSkills';
import EditCertifications from '@pages/dashboard/EditCertifications';
import ThemeCustomizer from '@pages/dashboard/ThemeCustomizer';
import ResumeUpload from '@pages/dashboard/ResumeUpload';
import AIAssistant from '@pages/dashboard/AIAssistant';

export function DashboardLayout() {
  const { userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Synchronize dynamic color accents on profile styling saves
  useEffect(() => {
    if (userProfile?.theme) {
      applyTheme(userProfile.theme);
    }
  }, [userProfile]);

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: FiGrid },
    { name: 'Edit Profile', path: '/dashboard/profile', icon: FiUser },
    { name: 'Timeline (Exp/Edu)', path: '/dashboard/timeline', icon: FiClock },
    { name: 'Projects & Case Studies', path: '/dashboard/projects', icon: FiCode },
    { name: 'Skills & Focus', path: '/dashboard/skills', icon: FiTrendingUp },
    { name: 'Certifications', path: '/dashboard/certifications', icon: FiShield },
    { name: 'Theme Customizer', path: '/dashboard/theme', icon: FiSliders },
    { name: 'Resume & Socials', path: '/dashboard/resume', icon: FiFileText },
    { name: 'AI Assistant', path: '/dashboard/ai', icon: FiCpu },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const currentActiveName = menuItems.find((item) => item.path === location.pathname)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-background text-white flex flex-col lg:flex-row relative">
      {/* Sidebar Panel for wider viewports */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-border shrink-0 sticky top-0 h-screen p-5 z-20 justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-full bg-accent hover:bg-accent-hover text-white flex items-center justify-center font-display font-bold uppercase text-lg shadow-accent">
              {userProfile?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-display font-bold text-white leading-none truncate text-body-md">
                {userProfile?.name || 'Workspace'}
              </span>
              <span className="font-mono text-[10px] text-text-muted mt-1 leading-none truncate">
                u/{userProfile?.username}
              </span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md font-body text-body-sm font-semibold transition-all focus-ring ${
                    isActive
                      ? 'bg-accent text-white shadow-accent'
                      : 'text-text-secondary hover:text-white hover:bg-elevated/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-border">
          {userProfile?.username && (
            <a
              href={`/u/${userProfile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center px-4 py-2 border border-accent hover:bg-accent hover:text-white text-accent rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring"
            >
              View Public Site
            </a>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 text-error hover:bg-error/10 hover:text-white rounded-md text-body-sm font-semibold transition-colors focus-ring w-full text-left"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Header Panel for Mobile Viewports */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-surface border-b border-border z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-display font-bold uppercase text-sm">
            {userProfile?.name?.charAt(0) || 'U'}
          </div>
          <span className="font-display font-bold text-white text-body-sm">
            {currentActiveName}
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="p-2 border border-border rounded text-text-secondary hover:text-white focus-ring"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed top-[61px] left-0 right-0 bg-surface border-b border-border z-30 p-4 flex flex-col gap-4 shadow-xl"
          >
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-md font-body text-body-sm font-semibold transition-colors focus-ring ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              {userProfile?.username && (
                <a
                  href={`/u/${userProfile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-4 py-2.5 border border-accent text-accent rounded-md text-body-sm font-semibold transition-colors focus-ring block"
                >
                  View Public Site
                </a>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-error hover:bg-error/10 rounded-md text-body-sm font-semibold transition-colors focus-ring w-full text-left"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Administrative Workspace */}
      <main className="flex-grow p-6 lg:p-10 max-w-5xl mx-auto w-full relative z-10 overflow-x-hidden min-h-[calc(100vh-61px)] lg:min-h-screen">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/timeline" element={<EditTimeline />} />
          <Route path="/projects" element={<EditProjects />} />
          <Route path="/skills" element={<EditSkills />} />
          <Route path="/certifications" element={<EditCertifications />} />
          <Route path="/theme" element={<ThemeCustomizer />} />
          <Route path="/resume" element={<ResumeUpload />} />
          <Route path="/ai" element={<AIAssistant />} />
        </Routes>
      </main>
    </div>
  );
}

export default DashboardLayout;
