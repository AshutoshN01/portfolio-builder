import { motion } from 'framer-motion';
import { usePortfolioData } from '@hooks/usePortfolioData';
import { fadeUp, scaleIn, staggerContainer } from '@utils/motion';
import { prefersReducedMotion } from '@utils/helpers';
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';
import { MagneticButton } from '@components/MagneticButton';
import { trackEvent } from '@utils/analytics';

function TerminalMockup() {
  return (
    <div className="w-full bg-[#080808] border border-border rounded-lg shadow-xl overflow-hidden font-mono text-[13px] text-text-muted leading-relaxed select-none">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0d] border-b border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#EF4444] opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#F59E0B] opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#22C55E] opacity-80" />
        </div>
        <span className="text-[11px] text-text-dim uppercase tracking-wider font-semibold">
          Bash — system_core.sh
        </span>
        <div className="w-12" /> {/* spacer to balance controls */}
      </div>

      {/* Terminal Content */}
      <div className="p-5 flex flex-col gap-2 bg-[#060606]">
        <div className="flex items-center gap-2">
          <span className="text-accent">➜</span>
          <span className="text-white">portfolio</span>
          <span className="text-text-dim">git:(main)</span>
          <span className="text-text-secondary">npm run build</span>
        </div>
        <div className="text-text-dim">vite v6.4.3 building for production...</div>
        <div className="text-text-dim">transforming...</div>
        <div className="text-success font-semibold">✓ 464 modules transformed.</div>
        <div className="grid grid-cols-12 gap-1 text-[12px] pt-1">
          <div className="col-span-6 text-text-muted">dist/index.html</div>
          <div className="col-span-3 text-text-dim">2.47 kB</div>
          <div className="col-span-3 text-text-dim">gzip: 0.86 kB</div>

          <div className="col-span-6 text-accent-text">dist/assets/index.js</div>
          <div className="col-span-3 text-white font-semibold">12.37 kB</div>
          <div className="col-span-3 text-text-dim">gzip: 4.27 kB</div>

          <div className="col-span-6 text-success">dist/assets/index.css</div>
          <div className="col-span-3 text-text-secondary">13.84 kB</div>
          <div className="col-span-3 text-text-dim">gzip: 3.65 kB</div>
        </div>
        <div className="text-success font-semibold mt-1">✓ built in 4.47s</div>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-accent">➜</span>
          <span className="text-white">portfolio</span>
          <span className="text-text-dim">git:(main)</span>
          <span className="w-2 h-4 bg-white animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const isReduced = prefersReducedMotion();
  const { personalInfo } = usePortfolioData();

  // Custom animation variants adapted for prefers-reduced-motion
  const slideUpVariant = isReduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.35 } },
      }
    : fadeUp;

  const terminalVariant = isReduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.35 } },
      }
    : scaleIn;

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { hero } = personalInfo;

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 md:pt-32 pb-16 overflow-hidden border-b border-border">
      {/* Subtle background glow effect (Design System §6) */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-accent-glow rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container-main relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (Core Copy Block) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-8 lg:col-span-7"
          >
            {/* Availability Status Badge */}
            {hero.availabilityStatus && (
              <motion.div
                variants={slideUpVariant}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-surface border border-border rounded-full w-fit"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                </span>
                <span className="font-body text-overline text-text-muted uppercase tracking-wider">
                  {hero.availabilityStatus}
                </span>
              </motion.div>
            )}

            {/* Heading Block */}
            <div className="flex flex-col gap-4">
              {hero.eyebrow && (
                <motion.span
                  variants={slideUpVariant}
                  className="font-body text-overline text-accent-text uppercase tracking-widest"
                >
                  {hero.eyebrow}
                </motion.span>
              )}
              <motion.h1
                variants={slideUpVariant}
                className="font-display text-display-xl font-bold tracking-tight text-white leading-[1.05]"
              >
                {hero.headlinePrefix}
                <span className="text-gradient">{hero.headlineHighlight}</span>
                {hero.headlineSuffix}
              </motion.h1>
            </div>

            {/* Description */}
            {hero.description && (
              <motion.p
                variants={slideUpVariant}
                className="font-body text-body-lg text-text-secondary max-w-[65ch] leading-relaxed"
              >
                {hero.description}
              </motion.p>
            )}

            {/* CTA Buttons */}
            <motion.div
              variants={slideUpVariant}
              className="flex flex-wrap items-center gap-4 mt-2"
            >
              <MagneticButton>
                <button
                  onClick={() => handleScrollTo('projects')}
                  className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center gap-2 hover:shadow-accent"
                >
                  Explore Work <FiArrowDown className="animate-bounce" />
                </button>
              </MagneticButton>
              {personalInfo.resumeUrl && (
                <MagneticButton>
                  <a
                    href={personalInfo.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('resume_download', { method: 'hero_button' })}
                    className="px-6 py-3 border border-border hover:border-border-hover text-text-secondary hover:text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center gap-2"
                  >
                    Curriculum Vitae <FiArrowUpRight />
                  </a>
                </MagneticButton>
              )}
            </motion.div>

            {/* Metrics / Statistics */}
            {hero.stats && hero.stats.length > 0 && (
              <motion.div
                variants={slideUpVariant}
                className="grid grid-cols-3 gap-6 md:gap-12 border-t border-border pt-10 mt-6 max-w-2xl"
              >
                {hero.stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <span className="font-display text-heading-lg md:text-display-md font-bold text-white tracking-tight">
                      {stat.value}
                    </span>
                    <span className="font-body text-overline text-text-muted uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right Column (Visual Showcase — Bash Terminal Mockup) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={terminalVariant}
            className="lg:col-span-5 hidden lg:block"
          >
            <TerminalMockup />
          </motion.div>
        </div>
      </div>

      {/* Down Scroll Indicator (Design System §9) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 pointer-events-none opacity-50 z-10">
        <span className="font-body text-overline text-text-dim tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={
            isReduced
              ? {}
              : {
                  y: [0, 8, 0],
                }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-white"
        >
          <FiArrowDown size={18} />
        </motion.div>
      </div>
    </section>
  );
}
