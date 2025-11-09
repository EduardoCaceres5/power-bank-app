// Design System Constants
// Use these throughout the application for consistency

export const SPACING = {
  xs: 2,
  sm: 3,
  md: 4,
  lg: 6,
  xl: 8,
  '2xl': 12,
} as const;

export const BORDER_RADIUS = {
  sm: 'md', // 6px
  md: 'lg', // 8px
  lg: 'xl', // 12px
  full: 'full',
} as const;

export const ICON_SIZES = {
  xs: 4,
  sm: 5,
  md: 6,
  lg: 8,
  xl: 12,
} as const;

export const TRANSITIONS = {
  fast: '0.15s',
  normal: '0.2s',
  slow: '0.3s',
} as const;

export const SHADOWS = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

// Consistent animation presets
export const HOVER_EFFECTS = {
  lift: {
    transform: 'translateY(-2px)',
    shadow: 'md',
  },
  scale: {
    transform: 'scale(1.02)',
  },
  glow: {
    shadow: 'lg',
  },
} as const;

// Focus styles for accessibility
export const FOCUS_STYLES = {
  outline: '2px solid',
  outlineColor: 'brand.500',
  outlineOffset: '2px',
} as const;
