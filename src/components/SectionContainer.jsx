import { motion } from 'framer-motion';
import { reveal } from '@utils/motion';

export function SectionContainer({
  id,
  overline,
  title,
  description,
  children,
  className = '',
}) {
  return (
    <section
      id={id}
      className={`py-16 md:py-20 lg:py-24 border-b border-border last:border-b-0 ${className}`}
    >
      <div className="container-main flex flex-col gap-12">
        {/* Section Header Block */}
        {(title || overline || description) && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={reveal}
            className="flex flex-col max-w-4xl"
          >
            {overline && (
              <span className="font-body text-overline text-accent-text uppercase tracking-widest mb-3">
                {overline}
              </span>
            )}
            {title && (
              <h2 className="font-display text-display-lg font-bold tracking-tight text-white mb-6">
                {title}
              </h2>
            )}
            {description && (
              <p className="font-body text-body-lg text-text-secondary max-w-[65ch]">
                {description}
              </p>
            )}
          </motion.div>
        )}

        {/* Section Content Area */}
        <div className="w-full">{children}</div>
      </div>
    </section>
  );
}
