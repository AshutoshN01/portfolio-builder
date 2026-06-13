import { Link, useLocation } from 'react-router-dom';
import { usePortfolioData } from '@hooks/usePortfolioData';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiInstagram, FiYoutube, FiLink, FiPhone } from 'react-icons/fi';

const iconMap = {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiInstagram,
  FiYoutube,
  FiLink,
  FiPhone,
};

export function Footer() {
  const location = useLocation();
  const { personalInfo, siteConfig, isStatic } = usePortfolioData();
  const currentYear = new Date().getFullYear();

  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }

  // Static icon resolver helper
  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <IconComponent className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container-main flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Branding & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link
            to={isStatic ? '/' : `/u/${personalInfo.username}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-heading-sm font-bold tracking-tight text-white hover:text-accent transition-colors duration-fast"
          >
            {personalInfo.name}
          </Link>
          <p className="font-body text-body-sm text-text-muted text-center md:text-left">
            © {currentYear} — Handcrafted with React & Framer Motion
          </p>
        </div>

        {/* Center: System Status & Build Stack Info */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="font-body text-overline text-text-muted uppercase tracking-wider">
              System Operational
            </span>
          </div>
          <span className="font-body text-overline text-text-dim uppercase tracking-widest text-center">
            Vite 6 • React 19 • Tailwind 3
          </span>
        </div>

        {/* Right: Social Icon Links */}
        <div className="flex items-center gap-4">
          {siteConfig?.socials?.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-border hover:border-border-hover text-text-muted hover:text-white rounded-md transition-all duration-fast focus-ring"
              aria-label={social.label}
            >
              {renderIcon(social.icon)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
