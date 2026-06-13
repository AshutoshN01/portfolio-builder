import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import { PageContainer } from '@components/PageContainer';
import { pageTransition } from '@utils/motion';
import { useSEO } from '@hooks/useSEO';

export function NotFound() {
  // Setup custom metadata for the 404 route dynamically
  useSEO({
    title: 'Page Not Found',
    description: 'The requested page could not be located on this server.',
  });

  return (
    <PageContainer className="flex items-center justify-center min-h-[85vh] p-6 text-center select-none relative">
      {/* Subtle backdrop glow */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent-glow rounded-full blur-[100px] pointer-events-none z-0" />

      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="relative z-10 flex flex-col items-center gap-6 max-w-md"
      >
        <div className="p-4 bg-accent/10 border border-accent/20 text-accent rounded-full mb-2">
          <FiAlertTriangle size={32} />
        </div>
        <span className="font-mono text-overline text-accent-text uppercase tracking-widest">
          Error Code 404
        </span>
        <h1 className="font-display text-display-md font-bold tracking-tight text-white leading-tight">
          Page Not Located
        </h1>
        <p className="font-body text-body-sm text-text-muted leading-relaxed">
          The routing index could not find the file or route you requested. It might have been relocated, renamed, or deleted.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-md text-body-sm font-semibold transition-all duration-fast focus-ring mt-2 hover:shadow-accent"
        >
          <FiArrowLeft /> Return to Site Home
        </Link>
      </motion.div>
    </PageContainer>
  );
}

export default NotFound;
