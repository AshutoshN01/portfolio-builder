import { motion } from 'framer-motion';
import { usePortfolioData } from '@hooks/usePortfolioData';
import { SectionContainer } from '@components/SectionContainer';
import { fadeUp, staggerContainer } from '@utils/motion';
import { prefersReducedMotion } from '@utils/helpers';
import { FiAward, FiExternalLink } from 'react-icons/fi';

export function CertificationCard({ cert }) {
  const isReduced = prefersReducedMotion();
  const cardVariant = isReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : fadeUp;

  return (
    <motion.div
      variants={cardVariant}
      className="p-6 bg-surface border border-border rounded-lg flex flex-col justify-between gap-4 hover:border-border-hover transition-colors duration-fast"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="p-3 bg-elevated border border-border text-accent rounded-md shrink-0">
            <FiAward size={20} />
          </div>
          {cert.url && (
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-border hover:border-border-hover text-text-muted hover:text-white rounded-md transition-colors duration-fast focus-ring"
              aria-label={`View credential for ${cert.name}`}
            >
              <FiExternalLink size={16} />
            </a>
          )}
        </div>
        
        <div className="flex flex-col gap-1 mt-2">
          <h3 className="font-display text-body-md font-bold text-white leading-snug">
            {cert.name}
          </h3>
          <span className="font-body text-body-sm text-text-secondary font-medium">
            {cert.issuer}
          </span>
        </div>
        
        {cert.description && (
          <p className="font-body text-body-sm text-text-muted leading-relaxed mt-1">
            {cert.description}
          </p>
        )}
      </div>

      <div className="border-t border-border pt-3 mt-2 flex justify-between items-center text-overline text-text-dim uppercase tracking-wider">
        <span>Issued</span>
        <span>{cert.date}</span>
      </div>
    </motion.div>
  );
}

export function CertificationsSection() {
  const { certificationsData } = usePortfolioData();

  if (!certificationsData || certificationsData.length === 0) return null;

  return (
    <SectionContainer
      id="certifications"
      overline="04. Certifications"
      title="Credentials & Technical Verification"
      description="Professional certifications and technical credentials demonstrating verified domain expertise."
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {certificationsData.map((cert) => (
          <CertificationCard key={cert.id} cert={cert} />
        ))}
      </motion.div>
    </SectionContainer>
  );
}

export default CertificationsSection;
