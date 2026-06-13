import { motion } from 'framer-motion';
import { usePortfolioData } from '@hooks/usePortfolioData';
import { SectionContainer } from '@components/SectionContainer';
import { fadeUp, staggerContainer } from '@utils/motion';
import { prefersReducedMotion } from '@utils/helpers';

export function AboutHighlights({ items }) {
  const isReduced = prefersReducedMotion();
  const cardVariant = isReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : fadeUp;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="grid grid-cols-3 gap-4"
    >
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          variants={cardVariant}
          className="p-4 bg-surface border border-border rounded-lg text-center hover:border-border-hover transition-colors duration-fast"
        >
          <span className="block font-display text-heading-lg text-white font-bold tracking-tight">
            {item.metric}
          </span>
          <span className="block font-body text-overline text-text-muted mt-1 leading-tight">
            {item.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function AboutPrinciples({ items }) {
  const isReduced = prefersReducedMotion();
  const cardVariant = isReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : fadeUp;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-heading-sm text-white uppercase tracking-wider">
        Engineering Principles
      </h3>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="flex flex-col gap-3"
      >
        {items.map((principle, idx) => (
          <motion.div
            key={idx}
            variants={cardVariant}
            className="p-4 bg-surface border border-border rounded-lg flex flex-col gap-2 hover:border-border-hover transition-colors duration-fast"
          >
            <h4 className="font-display text-body-md text-white font-semibold flex items-center gap-2">
              <span className="text-accent font-mono">0{idx + 1}.</span>{' '}
              {principle.title}
            </h4>
            <p className="font-body text-body-sm text-text-muted">
              {principle.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export function AboutStats({ items }) {
  const isReduced = prefersReducedMotion();
  const cardVariant = isReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : fadeUp;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-heading-sm text-white uppercase tracking-wider">
        Working Style
      </h3>
      <motion.div
        variants={cardVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="flex flex-col border border-border rounded-lg overflow-hidden bg-surface"
      >
        {items.map((stat, idx) => (
          <div
            key={idx}
            className="grid grid-cols-2 px-4 py-3.5 border-b border-border last:border-b-0 hover:bg-[#121212] transition-colors duration-fast font-body text-body-sm"
          >
            <span className="text-text-muted font-medium">{stat.label}</span>
            <span className="text-white text-right">{stat.value}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function AboutSection() {
  const { personalInfo } = usePortfolioData();
  const { about } = personalInfo;
  const isReduced = prefersReducedMotion();
  const itemVariant = isReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : fadeUp;

  // Hide section if no specialties, highlights, values, workingStyle are present
  const hasAboutDetails = about && (
    (about.specialties && about.specialties.length > 0) ||
    (about.highlights && about.highlights.length > 0) ||
    (about.values && about.values.length > 0) ||
    (about.workingStyle && about.workingStyle.length > 0)
  );

  if (!hasAboutDetails) return null;

  return (
    <SectionContainer
      id="about"
      overline="01. About"
      title="Bridging design fidelity and runtime speed"
      description={about.introduction}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column (7 cols) — Bio & Specialties */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="lg:col-span-7 flex flex-col gap-10"
        >
          <motion.p
            variants={itemVariant}
            className="font-body text-body-lg text-text-secondary leading-relaxed"
          >
            {about.bio}
          </motion.p>

          <motion.div variants={itemVariant} className="flex flex-col gap-4">
            <h3 className="font-display text-heading-sm text-white uppercase tracking-wider">
              Specialties
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {about.specialties.map((spec, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-4 py-3.5 bg-surface border border-border rounded-lg"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="font-body text-body-sm text-text-secondary font-medium">
                    {spec}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column (5 cols) — Highlights, Principles, Stats */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          <AboutHighlights items={about.highlights} />
          <AboutPrinciples items={about.values} />
          <AboutStats items={about.workingStyle} />
        </div>
      </div>
    </SectionContainer>
  );
}
