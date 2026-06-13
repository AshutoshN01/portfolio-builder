/**
 * Site Configuration — Global configurations, SEO, and social accounts.
 * Contains placeholders for personalization.
 */
export const siteConfig = {
  url: import.meta.env.VITE_SITE_URL || 'https://ashutosh.dev',
  themeColor: '#050505',
  socials: [
    {
      name: 'GitHub',
      url: import.meta.env.VITE_SOCIAL_GITHUB || 'https://github.com/AshutoshN01',
      icon: 'FiGithub',
      label: 'View GitHub Profile',
    },
    {
      name: 'LinkedIn',
      url: import.meta.env.VITE_SOCIAL_LINKEDIN || 'https://www.linkedin.com/in/ashutosh-nanoti-593a78360/',
      icon: 'FiLinkedin',
      label: 'Connect on LinkedIn',
    },
    {
      name: 'Twitter',
      url: import.meta.env.VITE_SOCIAL_TWITTER || 'https://x.com/ashutosh',
      icon: 'FiTwitter',
      label: 'Follow on Twitter',
    },
    {
      name: 'Email',
      url: `mailto:${import.meta.env.VITE_PROFILE_EMAIL || 'john.doe@example.com'}`,
      icon: 'FiMail',
      label: 'Send Email',
    },
  ],
  seo: {
    defaultTitle: `${import.meta.env.VITE_PROFILE_NAME || 'Ashutosh'} — ${import.meta.env.VITE_PROFILE_TITLE || 'Software Developer'}`,
    titleTemplate: `%s | ${import.meta.env.VITE_PROFILE_NAME || 'Ashutosh'}`,
    defaultDescription: import.meta.env.VITE_SEO_DESCRIPTION || 'Portfolio showing React development, Mobile applications, and Firebase project works.',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: `${import.meta.env.VITE_PROFILE_NAME || 'Ashutosh'} Portfolio`,
      image: import.meta.env.VITE_SEO_OG_IMAGE || '/assets/og-image.webp',
    },
    twitter: {
      cardType: 'summary_large_image',
      handle: import.meta.env.VITE_SOCIAL_TWITTER_HANDLE || '@ashutosh',
    },
  },
};
export default siteConfig;
