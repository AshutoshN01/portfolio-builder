import { useEffect } from 'react';
import { siteConfig } from '@data/siteConfig';
import { personalInfo } from '@data/profile';

/**
 * useSEO Hook — Lightweight dynamic meta tag injector.
 * Avoids bundling heavy libraries like react-helmet.
 * Updates browser title, description, and Open Graph tags on mount/update.
 *
 * @param {object} params - SEO parameter overrides.
 * @param {string} params.title - Custom page title (e.g. project title).
 * @param {string} params.description - Custom page description.
 * @param {string} params.image - Custom social sharing image URL.
 * @param {string} params.type - Custom OG page type (defaults to 'website').
 */
export function useSEO({ title, description, image, type } = {}) {
  useEffect(() => {
    // 1. Resolve and set document title
    const formattedTitle = title
      ? siteConfig.seo.titleTemplate.replace('%s', title)
      : `${personalInfo.name} — ${personalInfo.title}`;

    document.title = formattedTitle;

    // Helper to query and update meta elements
    const setMetaTag = (selector, content) => {
      if (!content) return;
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute('content', content);
      }
    };

    // 2. Resolve and set description
    const activeDescription = description || siteConfig.seo.defaultDescription;
    setMetaTag('meta[name="description"]', activeDescription);
    setMetaTag('meta[property="og:description"]', activeDescription);
    setMetaTag('meta[name="twitter:description"]', activeDescription);

    // 3. Set social titles
    setMetaTag('meta[property="og:title"]', formattedTitle);
    setMetaTag('meta[name="twitter:title"]', formattedTitle);

    // 4. Set page type
    setMetaTag('meta[property="og:type"]', type || siteConfig.seo.openGraph.type);

    // 5. Set social image
    const activeImage = image || siteConfig.seo.openGraph.image;
    setMetaTag('meta[property="og:image"]', activeImage);
    setMetaTag('meta[name="twitter:image"]', activeImage);

    // 6. Dynamic Canonical Link Resolver
    const canonicalUrl = `${siteConfig.url}${window.location.pathname}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
    setMetaTag('meta[property="og:url"]', canonicalUrl);

    // 7. Dynamic JSON-LD Structured Data Schema
    let jsonLdScript = document.getElementById('json-ld-seo');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.setAttribute('id', 'json-ld-seo');
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }

    const isHome = window.location.pathname === '/';
    const schemas = [];

    if (isHome) {
      // Person Schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': personalInfo.name,
        'jobTitle': personalInfo.title,
        'description': personalInfo.bio,
        'email': personalInfo.email,
        'url': siteConfig.url,
        'sameAs': siteConfig.socials
          .filter((s) => s.url && !s.url.startsWith('mailto:'))
          .map((s) => s.url),
      });

      // WebSite Schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': `${personalInfo.name} Portfolio`,
        'url': siteConfig.url,
        'description': siteConfig.seo.defaultDescription,
      });
    } else if (window.location.pathname.startsWith('/project/')) {
      // BreadcrumbList Schema for project case studies
      const slug = window.location.pathname.split('/').pop();
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': siteConfig.url,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': title || 'Project Case Study',
            'item': `${siteConfig.url}/project/${slug}`,
          },
        ],
      });
    }

    if (schemas.length > 0) {
      jsonLdScript.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
    } else {
      jsonLdScript.textContent = '';
    }

    // Cleanup: reset scripts/tags on route unmount
    return () => {
      const activeCanonical = document.querySelector('link[rel="canonical"]');
      if (activeCanonical) {
        activeCanonical.removeAttribute('href');
      }
      const activeScript = document.getElementById('json-ld-seo');
      if (activeScript) {
        activeScript.textContent = '';
      }
    };
  }, [title, description, image, type]);
}
