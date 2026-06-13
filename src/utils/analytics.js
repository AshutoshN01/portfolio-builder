/**
 * Unified Analytics Manager
 * Supports Google Analytics 4, Plausible, and Vercel Analytics.
 * Automatically stays disabled if environment variables are not configured.
 */

// Initialize analytics script injections
export function initAnalytics() {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  const enableVercel = import.meta.env.VITE_ENABLE_VERCEL_ANALYTICS === 'true';

  // 1. Google Analytics 4 Injection
  if (gaId && gaId !== 'G-XXXXXXXXXX' && !document.getElementById('ga-script')) {
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId, { send_page_view: false });
    console.log('✓ Google Analytics 4 Initialized');
  }

  // 2. Plausible Analytics Injection
  if (plausibleDomain && plausibleDomain !== 'yourdomain.com' && !document.getElementById('plausible-script')) {
    const script = document.createElement('script');
    script.id = 'plausible-script';
    script.defer = true;
    script.setAttribute('data-domain', plausibleDomain);
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
    console.log('✓ Plausible Analytics Initialized');
  }

  // 3. Vercel Analytics Injection (Standard Web Insights script)
  if (enableVercel && !document.getElementById('vercel-insights-script')) {
    const script = document.createElement('script');
    script.id = 'vercel-insights-script';
    script.defer = true;
    script.src = '/_vercel/insights/script.js';
    document.head.appendChild(script);
    console.log('✓ Vercel Analytics Enabled');
  }
}

// Track page transitions
export function trackPageview(path) {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (gaId && gaId !== 'G-XXXXXXXXXX' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
    });
  }
  if (window.plausible) {
    window.plausible('pageview', { u: path });
  }
  if (window.va) {
    window.va('event', 'pageview', { url: path });
  }
}

// Track manual interaction events (e.g. resume download)
export function trackEvent(name, params = {}) {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (gaId && gaId !== 'G-XXXXXXXXXX' && window.gtag) {
    window.gtag('event', name, params);
  }
  if (window.plausible) {
    window.plausible(name, { props: params });
  }
  if (window.va) {
    window.va('event', name, params);
  }
  console.log(`[Analytics Event] ${name} logged:`, params);
}
