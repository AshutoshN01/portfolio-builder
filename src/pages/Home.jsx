import { motion } from 'framer-motion';
import { PageContainer } from '@components/PageContainer';
import { Hero } from '@components/Hero';
import { AboutSection } from '@components/AboutSection';
import { SkillsSection } from '@components/SkillsSection';
import { ProjectsSection } from '@components/ProjectsSection';
import { TimelineSection } from '@components/TimelineSection';
import { CertificationsSection } from '@components/CertificationsSection';
import { ContactSection } from '@components/ContactSection';
import { pageTransition } from '@utils/motion';
import { useSEO } from '@hooks/useSEO';

const Home = () => {
  // Bind default portfolio SEO configurations dynamically
  useSEO();

  return (
    <PageContainer>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        {/* Phase 6: Hero Section */}
        <Hero />

        {/* Phase 7: About Section */}
        <AboutSection />

        {/* Phase 11: Skills & Expertise Section */}
        <SkillsSection />

        <ProjectsSection />

        <TimelineSection />

        <CertificationsSection />

        {/* Phase 13: Contact System Section */}
        <ContactSection />
      </motion.div>
    </PageContainer>
  );
};

export default Home;
