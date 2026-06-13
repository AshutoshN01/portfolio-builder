import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '@/firebase/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { PortfolioDataProvider } from '@hooks/usePortfolioData';
import { PageContainer } from '@components/PageContainer';
import { SectionContainer } from '@components/SectionContainer';
import { pageTransition } from '@utils/motion';
import { ProjectDetailSkeleton } from '@components/Skeleton';
import { useSEO } from '@hooks/useSEO';
import { FiArrowLeft, FiArrowUpRight, FiCode, FiLayers, FiCpu, FiDatabase, FiShuffle } from 'react-icons/fi';

export function PublicProjectDetail() {
  const { username, slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const cleanUsername = username.toLowerCase().trim();
      const cleanSlug = slug.toLowerCase().trim();
      setLoading(true);
      setNotFound(false);

      try {
        // 1. Resolve username to uid
        const usernameSnap = await getDoc(doc(db, 'usernames', cleanUsername));
        if (!usernameSnap.exists()) {
          setNotFound(true);
          return;
        }

        const uid = usernameSnap.data().uid;

        // 2. Fetch main user document
        const userSnap = await getDoc(doc(db, 'users', uid));
        if (!userSnap.exists()) {
          setNotFound(true);
          return;
        }

        const userProfile = userSnap.data();

        // 3. Fetch projects and socials sub-collections
        const [projSnap, socialsSnap] = await Promise.all([
          getDocs(collection(db, 'users', uid, 'projects')),
          getDocs(collection(db, 'users', uid, 'socials')),
        ]);

        // 4. Format projects and find target project
        const projects = projSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        projects.sort((a, b) => (a.order || 0) - (b.order || 0));

        const matchedProj = projects.find((p) => p.slug === cleanSlug);
        if (!matchedProj) {
          setNotFound(true);
          return;
        }

        // Apply fallback schema metrics/meta compatibility
        const parsedProject = {
          ...matchedProj,
          status: matchedProj.status || 'Active',
          meta: {
            role: matchedProj.meta?.role || 'Lead Engineer',
            client: matchedProj.meta?.client || 'Personal Project',
            timeline: matchedProj.meta?.timeline || new Date(matchedProj.createdAt || Date.now()).getFullYear().toString(),
            tech: matchedProj.meta?.tech || matchedProj.metrics?.map(m => m.value) || ['React', 'Tailwind', 'Vite'],
            ...matchedProj.meta
          },
          architecture: {
            frontend: matchedProj.architecture?.frontend || 'React, Tailwind CSS',
            backend: matchedProj.architecture?.backend || 'Firebase Serverless',
            database: matchedProj.architecture?.database || 'Firestore NoSQL',
            integrations: matchedProj.architecture?.integrations || 'Formspree API',
            ...matchedProj.architecture
          },
          metrics: matchedProj.metrics || [{ value: 'Vite', label: 'Framework' }],
          links: {
            live: matchedProj.links?.live || '',
            source: matchedProj.links?.source || '',
            ...matchedProj.links
          },
          media: {
            thumbnail: matchedProj.media?.thumbnail || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&fm=webp&fit=crop',
            cover: matchedProj.media?.cover || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&fm=webp&fit=crop',
            gallery: matchedProj.media?.gallery || [],
            ...matchedProj.media
          }
        };

        // 5. Format socials
        const socials = socialsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        socials.sort((a, b) => (a.order || 0) - (b.order || 0));

        const siteConfig = {
          url: `${window.location.origin}/u/${cleanUsername}`,
          socials,
        };

        setProject(parsedProject);
        setPortfolioData({
          personalInfo: userProfile,
          projectsData: projects,
          siteConfig,
        });
      } catch (err) {
        console.error('Error fetching project case study:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [username, slug]);

  // Apply custom user theme values dynamically to the DOM
  useEffect(() => {
    if (!portfolioData) return;
    const root = document.documentElement;
    const accent = portfolioData.personalInfo.theme?.accentColor || '#3B82F6';
    const glow = portfolioData.personalInfo.theme?.backgroundGlow || 'rgba(59, 130, 246, 0.15)';
    const font = portfolioData.personalInfo.theme?.fontFamily || 'Inter';

    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-glow', glow);
    root.style.setProperty('--font-family', font);
  }, [portfolioData]);

  // Inject SEO metadata
  useSEO(
    project
      ? {
          title: `${project.title} Case Study | ${portfolioData?.personalInfo?.name || 'Developer'}`,
          description: project.tagline || project.overview,
          image: project.media?.thumbnail || '/assets/og-image.webp',
        }
      : {}
  );

  if (loading) {
    return (
      <PageContainer className="flex items-center justify-center min-h-screen">
        <ProjectDetailSkeleton />
      </PageContainer>
    );
  }

  if (notFound || !project) {
    return <Navigate to="/404" replace />;
  }

  // Resolve adjacent navigation from all user's projects
  const allProjects = portfolioData.projectsData;
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = allProjects[currentIndex - 1] || allProjects[allProjects.length - 1];
  const nextProject = allProjects[currentIndex + 1] || allProjects[0];

  const handleAdjacentNavigation = (targetSlug) => {
    navigate(`/u/${username}/project/${targetSlug}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Helper to compile responsive source-sets for unsplash image tags
  const getSrcSet = (url) => {
    if (!url || !url.includes('unsplash.com')) return undefined;
    const cleanUrl = url.split('&w=')[0];
    return `${cleanUrl}&w=480&q=70 480w, ${cleanUrl}&w=800&q=80 800w, ${cleanUrl}&w=1200&q=80 1200w`;
  };

  return (
    <PortfolioDataProvider data={portfolioData}>
      <PageContainer id="main-content">
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          className="flex flex-col"
        >
          {/* SECTION 1: Project Hero Fold */}
          <section className="relative border-b border-border py-16 md:py-24">
            <div className="absolute inset-0 bg-accent-glow rounded-full blur-[160px] pointer-events-none z-0 translate-y-[-50%]" />
            
            <div className="container-main relative z-10 flex flex-col gap-8">
              <Link
                to={`/u/${username}#projects`}
                className="inline-flex items-center gap-2 text-text-muted hover:text-white text-body-sm transition-colors duration-fast w-fit focus-ring rounded"
              >
                <FiArrowLeft /> Back to Projects
              </Link>

              <div className="flex flex-col gap-4 max-w-4xl">
                <span className="font-body text-overline text-accent-text uppercase tracking-widest">
                  {project.category} • {project.status}
                </span>
                <h1 className="font-display text-display-md md:text-display-lg font-bold tracking-tight text-white leading-[1.1]">
                  {project.title}
                </h1>
                <p className="font-body text-body-lg text-text-secondary leading-relaxed mt-2">
                  {project.tagline}
                </p>
              </div>

              {/* Metrics & Links Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border pt-8 mt-4 items-center">
                {/* Metrics block */}
                <div className="md:col-span-2 grid grid-cols-3 gap-6">
                  {project.metrics.map((metric, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <span className="font-display text-heading-lg font-bold text-white tracking-tight">
                        {metric.value}
                      </span>
                      <span className="font-body text-overline text-text-muted uppercase tracking-wider">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTAs block */}
                <div className="flex flex-wrap gap-4 justify-start md:justify-end">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center gap-1.5 hover:shadow-accent"
                    >
                      Live Site <FiArrowUpRight />
                    </a>
                  )}
                  {project.links.source && (
                    <a
                      href={project.links.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 border border-border hover:border-border-hover text-text-secondary hover:text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center gap-1.5"
                    >
                      Source Code <FiCode />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Project Overview */}
          <SectionContainer
            id="overview"
            overline="01. Overview"
            title="What & Why We Built This"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <p className="font-body text-body-lg text-text-secondary leading-relaxed">
                  {project.overview}
                </p>
                {project.goal && (
                  <div className="p-5 bg-elevated border border-border rounded-lg flex flex-col gap-2">
                    <h4 className="font-display text-body-xs font-semibold text-white uppercase tracking-wider">
                      Core Project Goal
                    </h4>
                    <p className="font-body text-body-md text-text-secondary leading-relaxed">
                      {project.goal}
                    </p>
                  </div>
                )}
              </div>
              <div className="lg:col-span-4 p-6 bg-surface border border-border rounded-lg flex flex-col gap-4 font-body text-body-sm">
                <h4 className="font-display text-heading-sm text-white">Deliverable Info</h4>
                <div className="flex flex-col gap-3 text-text-muted">
                  <div><strong className="text-white uppercase tracking-wider text-[11px] block mb-0.5">Role</strong> {project.meta.role}</div>
                  <div><strong className="text-white uppercase tracking-wider text-[11px] block mb-0.5">Timeline</strong> {project.meta.timeline}</div>
                  <div><strong className="text-white uppercase tracking-wider text-[11px] block mb-0.5">Client</strong> {project.meta.client}</div>
                </div>
              </div>
            </div>
          </SectionContainer>

          {/* SECTION 3 & 4: Challenge & Solution */}
          <SectionContainer
            id="challenge-solution"
            overline="02. Challenge & Solution"
            title="The Technical Obstacle & Approach"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-surface border border-border rounded-lg flex flex-col gap-4">
                <h3 className="font-display text-heading-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-error" /> The Challenge
                </h3>
                <p className="font-body text-body-md text-text-secondary leading-relaxed">
                  {project.challenge}
                </p>
              </div>
              <div className="p-6 bg-surface border border-border rounded-lg flex flex-col gap-4">
                <h3 className="font-display text-heading-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" /> The Solution
                </h3>
                <p className="font-body text-body-md text-text-secondary leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>
          </SectionContainer>

          {/* SECTION 5: Architecture Card Deck */}
          <SectionContainer
            id="architecture"
            overline="03. Architecture"
            title="System Architecture Diagram & Layout"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-surface border border-border rounded-lg flex flex-col gap-3 hover:border-border-hover transition-colors duration-fast">
                <div className="text-accent-text flex items-center gap-2"><FiLayers size={18} /> <h4 className="font-display text-body-md text-white font-semibold">Frontend</h4></div>
                <p className="font-body text-body-sm text-text-muted leading-relaxed">{project.architecture.frontend}</p>
              </div>
              <div className="p-5 bg-surface border border-border rounded-lg flex flex-col gap-3 hover:border-border-hover transition-colors duration-fast">
                <div className="text-accent-text flex items-center gap-2"><FiCpu size={18} /> <h4 className="font-display text-body-md text-white font-semibold">Backend</h4></div>
                <p className="font-body text-body-sm text-text-muted leading-relaxed">{project.architecture.backend}</p>
              </div>
              <div className="p-5 bg-surface border border-border rounded-lg flex flex-col gap-3 hover:border-border-hover transition-colors duration-fast">
                <div className="text-accent-text flex items-center gap-2"><FiDatabase size={18} /> <h4 className="font-display text-body-md text-white font-semibold">Database</h4></div>
                <p className="font-body text-body-sm text-text-muted leading-relaxed">{project.architecture.database}</p>
              </div>
              <div className="p-5 bg-surface border border-border rounded-lg flex flex-col gap-3 hover:border-border-hover transition-colors duration-fast">
                <div className="text-accent-text flex items-center gap-2"><FiShuffle size={18} /> <h4 className="font-display text-body-md text-white font-semibold">Integrations</h4></div>
                <p className="font-body text-body-sm text-text-muted leading-relaxed">{project.architecture.integrations}</p>
              </div>
            </div>
          </SectionContainer>

          {/* SECTION 6: Tech Stack Visual Grid */}
          <SectionContainer
            id="tech-stack"
            overline="04. Tech Stack"
            title="Technology Specification Grid"
          >
            <div className="flex flex-wrap gap-3">
              {project.meta.tech.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2.5 bg-surface border border-border rounded-md font-body text-body-sm text-text-secondary font-medium hover:border-border-hover transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </SectionContainer>

          {/* SECTION 7: Results and Metrics */}
          <SectionContainer
            id="results"
            overline="05. Results"
            title="Measurable Business & Telemetry Results"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-surface border border-border rounded-lg text-center hover:border-border-hover transition-colors duration-fast"
                >
                  <span className="block font-display text-display-md font-bold text-white tracking-tight">
                    {metric.value}
                  </span>
                  <span className="block font-body text-overline text-text-muted mt-2 tracking-wider">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </SectionContainer>

          {/* SECTION 8: Lessons Learned */}
          {project.lessonsLearned && (
            <SectionContainer
              id="lessons-learned"
              overline="06. Lessons"
              title="Key Takeaways & Engineering Insights"
            >
              <div className="p-6 bg-surface border border-border rounded-lg">
                <p className="font-body text-body-md text-text-secondary leading-relaxed">
                  {project.lessonsLearned}
                </p>
              </div>
            </SectionContainer>
          )}

          {/* SECTION 9: Project Gallery Showcase */}
          {project.media.gallery && project.media.gallery.length > 0 && (
            <SectionContainer
              id="gallery"
              overline="07. Gallery"
              title="UI / UX Gallery Showcase"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.media.gallery.map((url, idx) => (
                  <div key={idx} className="aspect-video w-full rounded-lg border border-border overflow-hidden bg-elevated">
                    <img
                      src={url}
                      srcSet={getSrcSet(url)}
                      sizes="(max-width: 768px) 100vw, 600px"
                      alt={`Detail showcase image ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-[0.65s] ease-decelerate"
                    />
                  </div>
                ))}
              </div>
            </SectionContainer>
          )}

          {/* SECTION 10: Adjacent Case Study Navigation */}
          {allProjects.length > 1 && (
            <section className="border-t border-border py-12 bg-surface">
              <div className="container-main flex items-center justify-between gap-6">
                <button
                  onClick={() => handleAdjacentNavigation(prevProject.slug)}
                  className="flex flex-col gap-1 items-start text-left focus-ring p-3 rounded-md"
                >
                  <span className="font-body text-overline text-text-dim uppercase tracking-widest">
                    ← Previous Case Study
                  </span>
                  <span className="font-display text-body-md md:text-heading-sm font-bold text-white hover:text-accent transition-colors duration-fast">
                    {prevProject.title}
                  </span>
                </button>

                <button
                  onClick={() => handleAdjacentNavigation(nextProject.slug)}
                  className="flex flex-col gap-1 items-end text-right focus-ring p-3 rounded-md"
                >
                  <span className="font-body text-overline text-text-dim uppercase tracking-widest">
                    Next Case Study →
                  </span>
                  <span className="font-display text-body-md md:text-heading-sm font-bold text-white hover:text-accent transition-colors duration-fast">
                    {nextProject.title}
                  </span>
                </button>
              </div>
            </section>
          )}
        </motion.div>
      </PageContainer>
    </PortfolioDataProvider>
  );
}

export default PublicProjectDetail;
