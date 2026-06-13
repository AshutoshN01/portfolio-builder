import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '@/firebase/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { PortfolioDataProvider } from '@hooks/usePortfolioData';
import { PageContainer } from '@components/PageContainer';
import { Hero } from '@components/Hero';
import { AboutSection } from '@components/AboutSection';
import { SkillsSection } from '@components/SkillsSection';
import { ProjectsSection } from '@components/ProjectsSection';
import { TimelineSection } from '@components/TimelineSection';
import { CertificationsSection } from '@components/CertificationsSection';
import { ContactSection } from '@components/ContactSection';
import { pageTransition } from '@utils/motion';
import { applyTheme } from '@utils/theme';
import { ProjectDetailSkeleton } from '@components/Skeleton';
import { useSEO } from '@hooks/useSEO';

export function PublicPortfolio() {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const cleanUsername = username.toLowerCase().trim();
      setLoading(true);
      setNotFound(false);
 
      try {
        // 1. Resolve username to uid
        const usernameSnap = await getDoc(doc(db, 'usernames', cleanUsername));
        if (!usernameSnap.exists()) {
          setNotFound(true);
          return;
        }

        const uid = usernameSnap.data().uid;

        // 2. Fetch main user document
        const userSnap = await getDoc(doc(db, 'users', uid));
        if (!userSnap.exists()) {
          setNotFound(true);
          return;
        }

        const userProfile = userSnap.data();

        // 3. Fetch all child sub-collections
        const [expSnap, eduSnap, projSnap, skillsSnap, socialsSnap, certsSnap] = await Promise.all([
          getDocs(collection(db, 'users', uid, 'experience')),
          getDocs(collection(db, 'users', uid, 'education')),
          getDocs(collection(db, 'users', uid, 'projects')),
          getDocs(collection(db, 'users', uid, 'skills')),
          getDocs(collection(db, 'users', uid, 'socials')),
          getDocs(collection(db, 'users', uid, 'certifications')),
        ]);

        // 4. Merge timeline experience and education
        const experiences = expSnap.docs.map((d) => ({
          id: d.id,
          type: 'experience',
          ...d.data(),
        }));
        const educations = eduSnap.docs.map((d) => ({
          id: d.id,
          type: 'education',
          ...d.data(),
        }));
        const timelineData = [...experiences, ...educations];
        timelineData.sort((a, b) => (a.order || 0) - (b.order || 0));

        // 5. Format projects
        const projectsData = projSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        projectsData.sort((a, b) => (a.order || 0) - (b.order || 0));

        // 6. Format skills
        const categories = skillsSnap.docs.map((d) => ({
          id: d.id,
          name: d.data().categoryName || d.data().name,
          ...d.data(),
        }));
        categories.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        const skillsData = {
          categories,
          focusAreas: userProfile.focusAreas || [
            { title: 'Frontend Development', desc: 'Building responsive, accessible web interfaces.' },
            { title: 'Backend & APIs', desc: 'Designing scalable server-side services and REST APIs.' },
            { title: 'Database Design', desc: 'Structuring efficient data models for web applications.' },
            { title: 'Mobile Engineering', desc: 'Developing cross-platform and native mobile experiences.' },
          ],
        };

        // 7. Format certifications
        const certificationsData = certsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        certificationsData.sort((a, b) => (a.order || 0) - (b.order || 0));

        // 8. Format socials and config
        const socials = socialsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        socials.sort((a, b) => (a.order || 0) - (b.order || 0));

        const siteConfig = {
          url: `${window.location.origin}/u/${cleanUsername}`,
          socials,
          seo: {
            defaultTitle: `${userProfile.name} — ${userProfile.title}`,
            titleTemplate: `%s | ${userProfile.name}`,
            defaultDescription: userProfile.bio,
            openGraph: {
              type: 'website',
              locale: 'en_US',
              siteName: `${userProfile.name} Portfolio`,
              image: userProfile.ogImage || '/assets/og-image.webp',
            },
            twitter: {
              cardType: 'summary_large_image',
            },
          },
        };

        // Construct mapped profile to support both flat and nested schemas
        const mappedProfile = {
          ...userProfile,
          hero: {
            eyebrow: userProfile.hero?.eyebrow || userProfile.tagline || '',
            headlinePrefix: userProfile.hero?.headlinePrefix || userProfile.heroHeadlinePrefix || '',
            headlineHighlight: userProfile.hero?.headlineHighlight || userProfile.heroHeadlineHighlight || '',
            headlineSuffix: userProfile.hero?.headlineSuffix || userProfile.heroHeadlineSuffix || '',
            description: userProfile.hero?.description || userProfile.heroDescription || userProfile.bio || '',
            availabilityStatus: userProfile.hero?.availabilityStatus || userProfile.availabilityStatus || '',
            stats: userProfile.hero?.stats || userProfile.heroStats || [],
          },
          about: {
            introduction: userProfile.about?.introduction || userProfile.tagline || '',
            bio: userProfile.about?.bio || userProfile.bio || '',
            specialties: userProfile.about?.specialties || userProfile.specialties || [],
            highlights: userProfile.about?.highlights || userProfile.highlights || [],
            values: userProfile.about?.values || userProfile.values || [],
            workingStyle: userProfile.about?.workingStyle || userProfile.workingStyle || [],
          },
          contact: {
            description: userProfile.contact?.description || userProfile.contactDescription || 'Have a project screening, software internship role, or developer opportunity? Send an inquiry below.',
            successMessage: userProfile.contact?.successMessage || userProfile.contactSuccessMessage || 'Transmission acknowledged. I will review your message and respond as soon as possible.',
          }
        };

        // Compile context payload
        setPortfolioData({
          personalInfo: mappedProfile,
          timelineData,
          projectsData,
          skillsData,
          certificationsData,
          siteConfig,
        });
      } catch (err) {
        console.error('Error fetching user portfolio layout:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [username]);

  // Apply custom user theme values dynamically to the DOM
  useEffect(() => {
    if (!portfolioData) return;
    applyTheme(portfolioData.personalInfo.theme);
  }, [portfolioData]);

  // Inject SEO metadata
  useSEO(
    portfolioData
      ? {
          title: `${portfolioData.personalInfo.name} — ${portfolioData.personalInfo.title}`,
          description: portfolioData.personalInfo.bio,
          image: portfolioData.personalInfo.ogImage || '/assets/og-image.webp',
        }
      : {}
  );

  if (loading) {
    return (
      <PageContainer className="flex items-center justify-center min-h-screen">
        <ProjectDetailSkeleton />
      </PageContainer>
    );
  }

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

  return (
    <PortfolioDataProvider data={portfolioData}>
      <PageContainer id="main-content">
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
        >
          <Hero />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <TimelineSection />
          <CertificationsSection />
          <ContactSection />
        </motion.div>
      </PageContainer>
    </PortfolioDataProvider>
  );
}

export default PublicPortfolio;
