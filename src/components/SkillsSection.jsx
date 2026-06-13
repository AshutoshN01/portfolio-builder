import { motion } from 'framer-motion';
import { usePortfolioData } from '@hooks/usePortfolioData';
import { SectionContainer } from '@components/SectionContainer';
import { fadeUp, staggerContainer } from '@utils/motion';
import { prefersReducedMotion } from '@utils/helpers';
import { FiCpu, FiDatabase, FiLayers, FiTerminal, FiAward, FiCheckCircle } from 'react-icons/fi';

const iconMap = {
  FiCpu,
  FiDatabase,
  FiLayers,
  FiTerminal,
};

export function SkillItem({ item }) {
  const isReduced = prefersReducedMotion();
  const barWidth = item.proficiency + '%';

  return (
    <div
      tabIndex={0}
      role="text"
      aria-label={`Technology ${item.name}, proficiency level ${item.level}, ${item.years} experience`}
      className="flex flex-col gap-2.5 p-3.5 bg-background border border-border rounded-md hover:border-border-hover transition-all duration-fast focus-ring"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-body-sm font-semibold text-white flex items-center gap-1.5">
          {item.name}
          {item.type === 'primary' && (
            <span className="px-1.5 py-0.5 bg-accent/20 border border-accent/30 text-accent-text rounded text-[9px] uppercase tracking-wider font-mono font-normal">
              Core
            </span>
          )}
        </span>
        <span className="font-body text-overline text-text-muted">
          {item.years} Exp
        </span>
      </div>

      {/* Proficiency Bar & Level Label */}
      <div className="flex items-center gap-3">
        <div className="flex-grow h-1.5 bg-elevated rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: barWidth }}
            viewport={{ once: true }}
            transition={{
              duration: isReduced ? 0 : 0.85,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1,
            }}
            className="h-full bg-accent"
          />
        </div>
        <span className="font-body text-overline text-text-dim text-[10px] w-12 text-right">
          {item.level}
        </span>
      </div>
    </div>
  );
}

export function SkillCategoryCard({ category }) {
  const isReduced = prefersReducedMotion();
  const IconComponent = iconMap[category.icon] || FiCpu;

  const cardVariant = isReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : fadeUp;

  return (
    <motion.div
      variants={cardVariant}
      className="p-6 bg-surface border border-border rounded-lg flex flex-col gap-6 hover:border-border-hover transition-colors duration-fast"
    >
      {/* Category Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-elevated border border-border rounded-md text-accent shrink-0">
          <IconComponent size={20} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-heading-md font-bold text-white leading-none">
            {category.name || category.categoryName}
          </h3>
          <p className="font-body text-body-sm text-text-muted leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Skills list grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {category.items.map((item, idx) => (
          <SkillItem key={idx} item={item} />
        ))}
      </div>
    </motion.div>
  );
}

export function FocusAreaCard({ area, index }) {
  const isReduced = prefersReducedMotion();
  const cardVariant = isReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : fadeUp;

  return (
    <motion.div
      variants={cardVariant}
      className="p-5 bg-surface border border-border rounded-lg flex flex-col gap-2 hover:border-border-hover transition-colors duration-fast"
    >
      <h4 className="font-display text-body-md text-white font-semibold flex items-center gap-2">
        <span className="text-accent font-mono">0{index + 1}.</span> {area.title}
      </h4>
      <p className="font-body text-body-sm text-text-muted leading-relaxed">
        {area.desc}
      </p>
    </motion.div>
  );
}

export function CoreStackSummary({ categories }) {
  // Collect all primary skills
  const primarySkills = categories.flatMap((cat) =>
    cat.items.filter((item) => item.type === 'primary').map((item) => item.name)
  );

  return (
    <div className="p-6 bg-gradient-to-br from-surface to-elevated border border-border rounded-lg flex flex-col gap-4">
      <h3 className="font-display text-heading-sm text-white uppercase tracking-wider flex items-center gap-2">
        <FiAward className="text-accent" /> Core Technology Stack
      </h3>
      <p className="font-body text-body-sm text-text-secondary leading-relaxed">
        Direct expertise in production-grade tools utilized on a daily basis for architecting premium interfaces.
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {primarySkills.map((name, idx) => (
          <span
            key={idx}
            className="px-3 py-1.5 bg-accent/10 border border-accent/20 text-accent-text rounded-md font-body text-body-sm font-semibold flex items-center gap-1.5"
          >
            <FiCheckCircle size={12} className="text-accent" /> {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection() {
  const { skillsData } = usePortfolioData();
  const { categories, focusAreas } = skillsData;

  if (!categories || categories.length === 0) return null;

  return (
    <SectionContainer
      id="skills"
      overline="02. Skills"
      title="Technical Infrastructure & Expertise"
      description="A structured catalog of technologies, build platforms, and engineering priorities evaluated against production requirements."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column (8 cols) — Categorized Skill Groups */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="lg:col-span-8 flex flex-col gap-6"
        >
          {categories.map((category) => (
            <SkillCategoryCard key={category.id} category={category} />
          ))}
        </motion.div>

        {/* Right Column (4 cols) — Focus Areas & Summary */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <CoreStackSummary categories={categories} />

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-heading-sm text-white uppercase tracking-wider">
              Engineering Focus
            </h3>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="flex flex-col gap-4"
            >
              {focusAreas.map((area, idx) => (
                <FocusAreaCard key={idx} area={area} index={idx} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
