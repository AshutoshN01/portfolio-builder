import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@utils/motion';
import { prefersReducedMotion } from '@utils/helpers';
import { FiArrowRight, FiSliders, FiCpu, FiLayers, FiBarChart2, FiCheckCircle, FiShield } from 'react-icons/fi';
import { PageContainer } from '@components/PageContainer';
import { MagneticButton } from '@components/MagneticButton';

export function Marketing() {
  const isReduced = prefersReducedMotion();

  const features = [
    {
      icon: FiSliders,
      title: 'Dynamic Theme Editor',
      desc: 'Customize colors (Steel Blue, Cyber Emerald, Solar Gold) and layout types instantly.',
    },
    {
      icon: FiCpu,
      title: 'AI Portfolio Assistant',
      desc: 'Use Gemini or OpenAI to compile project case studies and write ATS-friendly summaries.',
    },
    {
      icon: FiLayers,
      title: 'Case Study Builder',
      desc: 'Structure projects into rich, recruiter-approved sections (Problem, Solution, Goal).',
    },
    {
      icon: FiBarChart2,
      title: 'Analytics Telemetry',
      desc: 'Track resume downloads, portfolio views, and form submittals dynamically.',
    },
    {
      icon: FiCheckCircle,
      title: 'WCAG AA Accessibility',
      desc: 'Ensure compliance with screen reader support, focus traps, and skip navigations.',
    },
    {
      icon: FiShield,
      title: 'Secure Form Delivery',
      desc: 'Formspree and EmailJS connectors backed by client-side honeypots and rate limit caps.',
    },
  ];

  const slideUpVariant = isReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : fadeUp;

  return (
    <PageContainer className="relative py-12 md:py-20 flex flex-col gap-24">
      {/* Background radial glows */}
      <div className="absolute inset-0 bg-accent-glow rounded-full blur-[180px] pointer-events-none z-0 translate-y-[-30%] opacity-30" />

      {/* Hero Section */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center flex flex-col items-center gap-6 max-w-4xl mx-auto relative z-10"
      >
        <motion.span
          variants={slideUpVariant}
          className="px-3 py-1 bg-accent/15 border border-accent/30 text-accent-text font-body text-overline uppercase tracking-widest rounded-full"
        >
          Dynamic Portfolio Builder
        </motion.span>
        
        <motion.h1
          variants={slideUpVariant}
          className="font-display text-display-md sm:text-display-lg md:text-display-xl font-bold tracking-tight text-white leading-[1.05]"
        >
          Create a premium, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover">
            developer portfolio
          </span> <br />
          in minutes.
        </motion.h1>

        <motion.p
          variants={slideUpVariant}
          className="font-body text-body-lg text-text-secondary max-w-2xl leading-relaxed mt-2"
        >
          Build an accessible, ATS-friendly, and high-performance developer portfolio featuring responsive layouts, custom themes, and AI description assistants.
        </motion.p>

        <motion.div variants={slideUpVariant} className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <MagneticButton>
            <Link
              to="/register"
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center gap-2 hover:shadow-accent"
            >
              Start Building Free <FiArrowRight />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link
              to="/login"
              className="px-6 py-3 border border-border hover:border-border-hover text-text-secondary hover:text-white rounded-md text-body-sm font-semibold transition-colors focus-ring"
            >
              Workspace Login
            </Link>
          </MagneticButton>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 flex flex-col gap-12 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-3 text-center max-w-2xl mx-auto">
          <h2 className="font-display text-heading-md md:text-heading-lg font-bold text-white tracking-tight uppercase">
            Platform Capabilities
          </h2>
          <p className="font-body text-body-sm text-text-muted">
            Everything you need to showcase your professional credentials to hiring managers
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={slideUpVariant}
                className="p-6 bg-surface border border-border hover:border-border-hover rounded-xl flex flex-col gap-4 hover:scale-[1.02] transition-all duration-medium"
              >
                <div className="p-3 bg-elevated border border-border text-accent rounded-lg w-fit">
                  <Icon size={20} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-body-md font-bold text-white tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="font-body text-body-sm text-text-muted leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Conversion Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        className="p-8 md:p-12 bg-surface border border-border rounded-2xl flex flex-col items-center gap-6 text-center max-w-4xl mx-auto w-full relative z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-accent-glow rounded-full blur-[120px] pointer-events-none opacity-20 translate-y-[50%]" />
        
        <h2 className="font-display text-heading-md md:text-heading-lg font-bold text-white uppercase tracking-wider">
          Claim Your Custom URL Slug
        </h2>
        <p className="font-body text-body-sm text-text-secondary max-w-lg leading-relaxed">
          Create an account to claim your vanity address (e.g., `u/john_doe`), load your profile, and share your dynamic workspace with tech recruiters immediately.
        </p>
        <MagneticButton>
          <Link
            to="/register"
            className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring flex items-center gap-2 hover:shadow-accent"
          >
            Create Your Portfolio <FiArrowRight />
          </Link>
        </MagneticButton>
      </motion.section>
    </PageContainer>
  );
}

export default Marketing;
