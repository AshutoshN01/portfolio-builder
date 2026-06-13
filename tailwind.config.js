/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      /* ──────────────────────────────────────────────
       * COLORS — Locked per Project Constitution
       * Background: #050505 | Surface: #0F0F0F
       * Border: #1A1A1A  | Accent: #7C3AED
       * ────────────────────────────────────────────── */
      colors: {
        background: '#050505',
        surface: '#0F0F0F',
        elevated: '#141414',
        border: {
          DEFAULT: '#1A1A1A',
          subtle: '#111111',
          hover: '#2A2A2A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#E5E5E5',
          muted: '#A1A1AA',
          dim: '#71717A',
        },
        accent: {
          DEFAULT: 'var(--accent, #3B82F6)',
          hover: 'var(--accent-hover, #60A5FA)',
          muted: 'var(--accent-muted, rgba(59, 130, 246, 0.15))',
          glow: 'var(--accent-glow, rgba(59, 130, 246, 0.08))',
          text: 'var(--accent-text, #60A5FA)',
        },
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
      },

      /* ──────────────────────────────────────────────
       * TYPOGRAPHY — Syne (display) + Inter (body)
       * ────────────────────────────────────────────── */
      fontFamily: {
        display: ['Syne', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['var(--font-family, Inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },

      /* ──────────────────────────────────────────────
       * BORDER RADIUS — Per Design System §8
       * ────────────────────────────────────────────── */
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },

      /* ──────────────────────────────────────────────
       * SHADOWS — Per Design System §7
       * Dark-theme optimized: surface stepping is
       * the primary depth tool; shadows reinforce
       * hover states only.
       * ────────────────────────────────────────────── */
      boxShadow: {
        xs: '0 1px 2px rgba(0,0,0,0.3)',
        sm: '0 2px 8px rgba(0,0,0,0.4)',
        md: '0 4px 16px rgba(0,0,0,0.5)',
        lg: '0 8px 32px rgba(0,0,0,0.6)',
        xl: '0 16px 48px rgba(0,0,0,0.7)',
        accent: '0 0 24px rgba(59, 130, 246, 0.15)',
        none: 'none',
      },

      /* ──────────────────────────────────────────────
       * Z-INDEX — Per Design System §2
       * ────────────────────────────────────────────── */
      zIndex: {
        base: '0',
        card: '10',
        sticky: '40',
        navbar: '50',
        overlay: '60',
        modal: '70',
        toast: '80',
      },

      /* ──────────────────────────────────────────────
       * KEYFRAMES — Minimal CSS-level animations
       * ────────────────────────────────────────────── */
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'skeleton-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'skeleton': 'skeleton-shimmer 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
