import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjectBySlug, projectsData } from '@data/projects';
import { PageContainer } from '@components/PageContainer';
import { SectionContainer } from '@components/SectionContainer';
import { staggerContainer } from '@utils/motion';
import { useSEO } from '@hooks/useSEO';
import { FiArrowLeft, FiArrowUpRight, FiCode, FiLayers, FiCpu, FiDatabase, FiShuffle } from 'react-icons/fi';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = getProjectBySlug(slug);

  // Helper to compile responsive source-sets for unsplash image tags
  const getSrcSet = (url) => {
    if (!url || !url.includes('unsplash.com')) return undefined;
    const cleanUrl = url.split('&w=')[0];
    return `${cleanUrl}&w=480&q=70 480w, ${cleanUrl}&w=800&q=80 800w, ${cleanUrl}&w=1200&q=80 1200w`;
  };

  // Resolve dynamic SEO tags
  useSEO({
    title: project ? `${project.title} Case Study` : 'Project Not Found',
    description: project ? project.tagline : 'The requested project case study.',
    image: project ? project.media?.thumbnail : null,
  });

  if (!project) {
    return (
      <PageContainer className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center">
        <h1 className="font-display font-bold text-white text-4xl">
          Project Not Found
        </h1>
        <p className="font-body text-text-muted text-body-md max-w-md">
          The project case study you are searching for does not exist or has been archived.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 border border-border hover:border-border-hover text-text-secondary hover:text-white rounded-md text-body-sm font-medium transition-all duration-fast focus-ring"
        >
          <FiArrowLeft /> Back to Home
        </Link>
      </PageContainer>
    );
  }

  // Resolve adjacent navigation
  const currentIndex = projectsData.findIndex((p) => p.slug === slug);
  const prevProject = projectsData[currentIndex - 1] || projectsData[projectsData.length - 1];
  const nextProject = projectsData[currentIndex + 1] || projectsData[0];

  const handleAdjacentNavigation = (targetSlug) => {
    navigate(`/project/${targetSlug}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  return (
    <PageContainer>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="flex flex-col"
      >
        {/* SECTION 1: Project Hero Fold */}
        <section className="relative border-b border-border py-16 md:py-24">
          <div className="absolute inset-0 bg-accent-glow rounded-full blur-[160px] pointer-events-none z-0 translate-y-[-50%]" />
          
          <div className="container-main relative z-10 flex flex-col gap-8">
            <Link
              to="/#projects"
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

        {/* SECTION 9: Adjacent Case Study Navigation */}
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
      </motion.div>
    </PageContainer>
  );
};

export default ProjectDetail;
