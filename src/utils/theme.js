/**
 * Helper mapping to resolve Tailwind custom colors dynamically based on selected accent.
 */
export const themeColorsMap = {
  '#3B82F6': { // Steel Blue
    hover: '#60A5FA',
    muted: 'rgba(59, 130, 246, 0.15)',
    glow: 'rgba(59, 130, 246, 0.08)',
    text: '#60A5FA',
  },
  '#10B981': { // Cyber Emerald
    hover: '#34D399',
    muted: 'rgba(16, 185, 129, 0.15)',
    glow: 'rgba(16, 185, 129, 0.08)',
    text: '#34D399',
  },
  '#F59E0B': { // Solar Gold
    hover: '#FBBF24',
    muted: 'rgba(245, 158, 11, 0.15)',
    glow: 'rgba(245, 158, 11, 0.08)',
    text: '#FBBF24',
  },
  '#EF4444': { // Crimson Red
    hover: '#F87171',
    muted: 'rgba(239, 68, 68, 0.15)',
    glow: 'rgba(239, 68, 68, 0.08)',
    text: '#F87171',
  },
  '#8B5CF6': { // Neon Violet
    hover: '#A78BFA',
    muted: 'rgba(139, 92, 246, 0.15)',
    glow: 'rgba(139, 92, 246, 0.08)',
    text: '#A78BFA',
  }
};

/**
 * Applies active styling parameters to the document DOM root.
 */
export function applyTheme(theme) {
  const root = document.documentElement;
  const accent = theme?.accentColor || '#3B82F6';
  const font = theme?.fontFamily || 'Inter';

  const palette = themeColorsMap[accent] || themeColorsMap['#3B82F6'];

  root.style.setProperty('--accent', accent);
  root.style.setProperty('--accent-hover', palette.hover);
  root.style.setProperty('--accent-muted', palette.muted);
  root.style.setProperty('--accent-glow', palette.glow);
  root.style.setProperty('--accent-text', palette.text);
  root.style.setProperty('--font-family', font);
}
