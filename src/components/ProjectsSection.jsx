import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePortfolioData } from '@hooks/usePortfolioData';
import { SectionContainer } from '@components/SectionContainer';
import { fadeUp, staggerContainer } from '@utils/motion';
import { prefersReducedMotion } from '@utils/helpers';
import { FiArrowRight } from 'react-icons/fi';

export function ProjectCard({ project, spanClass = 'lg:col-span-6' }) {
  const navigate = useNavigate();
  const isReduced = prefersReducedMotion();
  const { personalInfo, isStatic } = usePortfolioData();

  const handleCardClick = () => {
    const targetPath = isStatic
      ? `/project/${project.slug}`
      : `/u/${personalInfo.username}/project/${project.slug}`;
    navigate(targetPath);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  // Build card grid animation
  const cardVariant = isReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : fadeUp;

  // Resolve key metric to display on the card footer
  const primaryMetric = project.metrics && project.metrics[0];

  // Helper to compile responsive Unsplash source-sets dynamically
  const getSrcSet = (url) => {
    if (!url || !url.includes('unsplash.com')) return undefined;
    const cleanUrl = url.split('&w=')[0];
    return `${cleanUrl}&w=480&q=70 480w, ${cleanUrl}&w=800&q=80 800w, ${cleanUrl}&w=1200&q=80 1200w`;
  };

  return (
    <motion.div
      variants={cardVariant}
      tabIndex={0}
      role="link"
      aria-label={`View case study for ${project.title}: ${project.tagline}`}
      onKeyDown={handleKeyDown}
      onClick={handleCardClick}
      className={`${spanClass} bg-surface border border-border rounded-lg overflow-hidden group hover:border-border-hover hover:shadow-lg hover:-translate-y-1 transition-all duration-medium ease-decelerate cursor-pointer flex flex-col focus-ring`}
    >
      {/* Visual Showcase (16:9 Thumbnail) */}
      {project.media?.thumbnail && (
        <div className="relative aspect-video w-full overflow-hidden bg-elevated border-b border-border">
          <img
            src={project.media.thumbnail}
            srcSet={getSrcSet(project.media.thumbnail)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
            alt={`Visual representation of ${project.title}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[0.65s] ease-decelerate group-hover:scale-105"
          />
          {/* Category Badge overlay */}
          <span className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm border border-border text-white font-body text-overline px-3 py-1 rounded-full uppercase tracking-wider">
            {project.category}
          </span>
          {/* Live Status overlay */}
          {project.status && (
            <span className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm border border-border text-text-muted font-body text-overline px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {project.status}
            </span>
          )}
        </div>
      )}

      {/* Copy Details */}
      <div className="p-6 flex-grow flex flex-col justify-between gap-6">
        <div>
          <h3 className="font-display text-heading-lg font-bold text-white group-hover:text-accent transition-colors duration-fast">
            {project.title}
          </h3>
          <p className="font-body text-body-sm text-text-secondary mt-2 leading-relaxed line-clamp-2">
            {project.tagline}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {project.meta?.tech?.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-elevated border border-border text-text-muted rounded-md font-body text-overline uppercase tracking-wider"
              >
                {tech}
              </span>
            ))}
            {project.meta?.tech?.length > 4 && (
              <span className="px-2.5 py-1 bg-transparent border border-dashed border-border text-text-dim rounded-md font-body text-overline uppercase tracking-wider">
                +{project.meta.tech.length - 4} More
              </span>
            )}
          </div>
        </div>

        {/* Footer Metrics & Actions */}
        <div className="border-t border-border pt-4 mt-auto flex items-center justify-between gap-4">
          {primaryMetric ? (
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-heading-md font-bold text-white leading-none">
                {primaryMetric.value}
              </span>
              <span className="font-body text-overline text-text-muted uppercase tracking-wider">
                {primaryMetric.label}
              </span>
            </div>
          ) : (
            <div />
          )}

          <span className="inline-flex items-center gap-1.5 font-body text-body-sm font-semibold text-accent group-hover:text-accent-hover transition-colors duration-fast">
            Case Study <FiArrowRight className="transition-transform duration-fast group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const { projectsData } = usePortfolioData();

  if (!projectsData || projectsData.length === 0) return null;

  // Show featured projects if any, otherwise show all projects
  const featuredProjects = projectsData.filter((p) => p.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projectsData;

  return (
    <SectionContainer
      id="projects"
      overline="02. Projects"
      title="Architected Systems & Production Proof"
      description="A curated showcase of complex platforms meeting strict performance budgets, design token requirements, and system SLAs. Each project has been audited to prove technical maturity."
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10"
      >
        {displayProjects.map((project, idx) => {
          // Asymmetrical layout logic: alternate large (7 cols) and medium (5 cols) grid tracks
          const isEven = idx % 2 === 0;
          const spanClass = isEven ? 'lg:col-span-7' : 'lg:col-span-5';

          return (
            <ProjectCard
              key={project.id}
              project={project}
              spanClass={spanClass}
            />
          );
        })}
      </motion.div>
    </SectionContainer>
  );
}
