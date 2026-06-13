import { motion } from 'framer-motion';
import { usePortfolioData } from '@hooks/usePortfolioData';
import { SectionContainer } from '@components/SectionContainer';
import { fadeUp, staggerContainer } from '@utils/motion';
import { prefersReducedMotion } from '@utils/helpers';
import { FiCalendar, FiMapPin, FiBriefcase, FiLink } from 'react-icons/fi';

export function TechnologyTags({ technologies }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {technologies.map((tech, idx) => (
        <span
          key={idx}
          className="px-2.5 py-1 bg-elevated border border-border text-text-muted rounded-md font-body text-overline uppercase tracking-wider"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

export function AchievementCards({ achievements }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {achievements.map((item, idx) => (
        <div
          key={idx}
          className="p-4 bg-background border border-border rounded-lg text-center hover:border-border-hover transition-colors"
        >
          <span className="block font-display text-heading-md font-bold text-accent">
            {item.metric}
          </span>
          <span className="block font-body text-overline text-text-muted mt-1 leading-tight text-[10px]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TimelineItem({ item, index }) {
  const isReduced = prefersReducedMotion();
  const isCurrent = item.endDate && item.endDate.toLowerCase() === 'present';

  const itemVariant = isReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : fadeUp;

  // Asymmetrical desktop layout variables (alternating left/right sides of spine)
  const isEven = index % 2 === 0;

  return (
    <motion.li
      variants={itemVariant}
      className={`relative flex flex-col lg:flex-row w-full mb-12 last:mb-0 ${
        isEven ? 'lg:justify-start' : 'lg:justify-end'
      }`}
    >
      {/* Visual Connection Node on Timeline Spine */}
      <div className="absolute left-[15px] lg:left-1/2 w-8 h-8 rounded-full border border-border bg-[#050505] flex items-center justify-center -translate-x-1/2 z-20">
        <span
          className={`w-2 h-2 rounded-full ${
            isCurrent ? 'bg-success animate-pulse' : 'bg-accent-text'
          }`}
        />
      </div>

      {/* Card Content Wrapper */}
      <div
        className={`w-full lg:w-[calc(50%-40px)] pl-10 lg:pl-0 ${
          isEven ? 'lg:pr-6 text-left' : 'lg:pl-6 text-left'
        }`}
      >
        <div className="p-6 bg-surface border border-border rounded-lg shadow-sm hover:shadow-lg transition-all duration-medium ease-decelerate group">
          {/* Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4 mb-4">
            <div className="flex flex-col">
              <span className="font-body text-overline text-accent-text uppercase tracking-widest flex items-center gap-1.5">
                <FiBriefcase size={12} /> {item.role || item.degree}
              </span>
              <h3 className="font-display text-heading-lg font-bold text-white mt-1 flex items-center gap-2">
                {item.company || item.institution}
                {item.links?.companyUrl && (
                  <a
                    href={item.links.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-white transition-colors duration-fast focus-ring rounded"
                    aria-label={`Visit ${item.company || item.institution} website`}
                  >
                    <FiLink size={14} />
                  </a>
                )}
              </h3>
            </div>
            
            <div className="flex flex-col items-start lg:items-end text-text-muted font-body text-body-sm gap-1">
              <span className="flex items-center gap-1.5">
                <FiCalendar size={13} /> {item.startDate} – {item.endDate}
              </span>
              <span className="flex items-center gap-1.5 text-overline tracking-wider text-text-dim">
                <FiMapPin size={13} /> {item.location}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="font-body text-body-md text-text-secondary leading-relaxed">
            {item.description}
          </p>

          {/* Achievements Metrics Deck */}
          {item.achievements && item.achievements.length > 0 && (
            <AchievementCards achievements={item.achievements} />
          )}

          {/* Core Technologies Badge Stack */}
          {item.technologies && item.technologies.length > 0 && (
            <TechnologyTags technologies={item.technologies} />
          )}
        </div>
      </div>
    </motion.li>
  );
}

export function TimelineSection() {
  const { timelineData } = usePortfolioData();

  if (!timelineData || timelineData.length === 0) return null;

  return (
    <SectionContainer
      id="timeline"
      overline="03. Timeline"
      title="Professional Progression & Core Value"
      description="A chronological record of engineering execution, team leadership, and product contributions. I focus on leaving codebases cleaner, teams faster, and platforms more responsive than I found them."
    >
      <div className="relative w-full">
        {/* Central Vertical Spine Line (Desktop) / Left Spine (Mobile) */}
        <div className="absolute left-[15px] lg:left-1/2 top-0 h-full w-[1px] bg-border -translate-x-1/2 z-0" />

        {/* Timeline List */}
        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative flex flex-col w-full list-none"
        >
          {timelineData.map((item, idx) => (
            <TimelineItem key={item.id} item={item} index={idx} />
          ))}
        </motion.ol>
      </div>
    </SectionContainer>
  );
}
