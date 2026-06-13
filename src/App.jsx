import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { RootLayout } from '@layouts/RootLayout';
import { ProjectDetailSkeleton } from '@components/Skeleton';
import { initAnalytics, trackPageview } from '@utils/analytics';
import { ProtectedRoute } from '@components/ProtectedRoute';

// Pages — Eagerly loaded for platform optimization
import Marketing from '@pages/Marketing';
import NotFound from '@pages/NotFound';

// Lazy-loaded routes for performance & split bundle optimization
const Login = lazy(() => import('@pages/Login'));
const Register = lazy(() => import('@pages/Register'));
const PublicPortfolio = lazy(() => import('@pages/PublicPortfolio'));
const PublicProjectDetail = lazy(() => import('@pages/PublicProjectDetail'));
const DashboardLayout = lazy(() => import('@layouts/DashboardLayout'));

// Original single-user views kept for backward-compatible reference
const Home = lazy(() => import('@pages/Home'));
const ProjectDetail = lazy(() => import('@pages/ProjectDetail'));

/**
 * Normalizes URLs before routing:
 * 1. Redirects /U/:username → /u/:username (case-insensitive portfolio routes)
 * 2. Strips trailing slashes from all non-root paths
 */
function UrlNormalizer() {
  const location = useLocation();

  // Normalize uppercase /U/ prefix
  if (location.pathname.startsWith('/U/')) {
    const normalized = '/u/' + location.pathname.slice(3);
    return <Navigate to={normalized + location.search + location.hash} replace />;
  }

  // Strip trailing slash from all non-root paths
  if (location.pathname !== '/' && location.pathname.endsWith('/')) {
    const trimmed = location.pathname.replace(/\/+$/, '');
    return <Navigate to={trimmed + location.search + location.hash} replace />;
  }

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  // Track page view transitions dynamically on location change
  useEffect(() => {
    trackPageview(location.pathname);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Marketing platform root */}
        <Route path="/" element={<Marketing />} />

        {/* Authentication paths */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dynamic client rendering paths */}
        <Route path="/u/:username" element={<PublicPortfolio />} />
        <Route path="/u/:username/project/:slug" element={<PublicProjectDetail />} />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* Original single-user static views for fallback/migration validation */}
        <Route path="/static" element={<Home />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />

        {/* Explicit 404 page */}
        <Route path="/404" element={<NotFound />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  // Initialize analytics integrations on application boot
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<ProjectDetailSkeleton />}>
        <UrlNormalizer />
        <RootLayout>
          <AnimatedRoutes />
        </RootLayout>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
