# FitPlatform Landing Page Design System

## 1. Visual Design System

### 1.1 Color Palette

#### Primary Colors (Fitness & Energy)
```css
/* Primary Brand Colors */
--primary-50: #f0f9ff;    /* Light blue background */
--primary-100: #e0f2fe;   /* Light blue accent */
--primary-500: #0ea5e9;   /* Main brand blue */
--primary-600: #0284c7;   /* Hover states */
--primary-700: #0369a1;   /* Active states */
--primary-900: #0c4a6e;   /* Dark text */

/* Secondary Accent (Energy Orange) */
--accent-50: #fff7ed;     /* Light orange background */
--accent-100: #ffedd5;    /* Light orange accent */
--accent-500: #f97316;    /* Energy orange */
--accent-600: #ea580c;    /* Hover orange */
--accent-700: #c2410c;    /* Active orange */

/* Success Green (Progress/Achievement) */
--success-50: #f0fdf4;    /* Light green */
--success-500: #22c55e;   /* Success green */
--success-600: #16a34a;   /* Hover green */

/* Neutral Grays (Professional) */
--gray-50: #f8fafc;       /* Light background */
--gray-100: #f1f5f9;      /* Card backgrounds */
--gray-200: #e2e8f0;      /* Borders */
--gray-400: #94a3b8;      /* Subtle text */
--gray-600: #475569;      /* Secondary text */
--gray-800: #1e293b;      /* Primary text */
--gray-900: #0f172a;      /* Headings */
```

#### Usage Guidelines
- **Primary Blue**: CTAs, links, progress indicators
- **Accent Orange**: Highlights, notifications, energy elements
- **Success Green**: Achievements, positive metrics
- **Neutrals**: Text, backgrounds, structural elements

### 1.2 Typography System

#### Font Stack
```css
/* Primary Font: Inter (Modern, Professional, Highly Readable) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Display Font: Space Grotesk (Bold Headlines) */
font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

#### Typography Scale (Mobile-First)
```css
/* Display Heading - Hero sections */
.text-display {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 4vw, 3.5rem); /* 40px - 56px */
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* H1 - Page titles */
.text-h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 3vw, 2.5rem); /* 32px - 40px */
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* H2 - Section headers */
.text-h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.5rem, 2.5vw, 2rem); /* 24px - 32px */
  line-height: 1.3;
  font-weight: 600;
}

/* H3 - Card titles */
.text-h3 {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.25rem, 2vw, 1.5rem); /* 20px - 24px */
  line-height: 1.4;
  font-weight: 600;
}

/* Body Large - Important descriptions */
.text-body-lg {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.125rem, 1.5vw, 1.25rem); /* 18px - 20px */
  line-height: 1.6;
  font-weight: 400;
}

/* Body - Default text */
.text-body {
  font-family: 'Inter', sans-serif;
  font-size: 1rem; /* 16px */
  line-height: 1.6;
  font-weight: 400;
}

/* Body Small - Secondary text */
.text-body-sm {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem; /* 14px */
  line-height: 1.5;
  font-weight: 400;
}

/* Caption - Tiny text */
.text-caption {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem; /* 12px */
  line-height: 1.4;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### 1.3 Spacing System (Tailwind-based)
```css
/* Base unit: 4px */
--space-1: 0.25rem;   /* 4px - Tight spacing */
--space-2: 0.5rem;    /* 8px - Small spacing */
--space-3: 0.75rem;   /* 12px - Medium-small */
--space-4: 1rem;      /* 16px - Default spacing */
--space-6: 1.5rem;    /* 24px - Section spacing */
--space-8: 2rem;      /* 32px - Large spacing */
--space-12: 3rem;     /* 48px - XL spacing */
--space-16: 4rem;     /* 64px - XXL spacing */
--space-20: 5rem;     /* 80px - Hero spacing */
--space-24: 6rem;     /* 96px - Section dividers */
--space-32: 8rem;     /* 128px - Massive spacing */
```

### 1.4 Border Radius System
```css
--radius-sm: 0.375rem;    /* 6px - Small elements */
--radius-md: 0.5rem;      /* 8px - Default cards */
--radius-lg: 0.75rem;     /* 12px - Large cards */
--radius-xl: 1rem;        /* 16px - Hero elements */
--radius-2xl: 1.5rem;     /* 24px - Special elements */
--radius-full: 9999px;    /* Pills and circles */
```

### 1.5 Shadow System
```css
/* Subtle shadows for depth */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Colored shadows for CTAs */
--shadow-primary: 0 10px 25px -5px rgb(14 165 233 / 0.3);
--shadow-accent: 0 10px 25px -5px rgb(249 115 22 / 0.3);
```

## 2. Component Design Patterns

### 2.1 Button System

#### Primary CTA Button
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  padding: 0.75rem 2rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  box-shadow: var(--shadow-primary);
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--primary-600);
  padding: 0.75rem 2rem;
  border: 2px solid var(--primary-500);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--primary-500);
  color: white;
  transform: translateY(-1px);
}
```

#### Accent Button (Energy/Action)
```css
.btn-accent {
  background: linear-gradient(135deg, var(--accent-500), var(--accent-600));
  color: white;
  padding: 0.75rem 2rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  box-shadow: var(--shadow-accent);
  transition: all 0.2s ease;
}
```

### 2.2 Card System

#### Feature Card
```css
.feature-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-200);
}
```

#### Pricing Card
```css
.pricing-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: 2.5rem 2rem;
  border: 2px solid var(--gray-200);
  position: relative;
  transition: all 0.3s ease;
}

.pricing-card.featured {
  border-color: var(--primary-500);
  box-shadow: var(--shadow-primary);
  transform: scale(1.05);
}
```

### 2.3 Icon System

#### Icon Specifications
- **Size**: 24px default, 32px for large, 20px for small
- **Style**: Outline style for consistency
- **Library**: Heroicons v2 (outline)
- **Color**: Match text color or use accent colors

#### Key Icons
- **Fitness**: 🏋️ (dumbbell), 📊 (chart), ⚡ (energy)
- **Technology**: 📱 (mobile), 🔗 (integration), 📈 (analytics)
- **Social**: 👥 (community), ⭐ (achievement), 💬 (messaging)

## 3. Responsive Breakpoints

```css
/* Mobile First Approach */
/* xs: 0px - 479px (default) */
/* sm: 480px - 767px */
@media (min-width: 30rem) { ... }

/* md: 768px - 1023px */
@media (min-width: 48rem) { ... }

/* lg: 1024px - 1279px */
@media (min-width: 64rem) { ... }

/* xl: 1280px+ */
@media (min-width: 80rem) { ... }
```

### Layout Guidelines
- **Mobile**: Single column, stacked elements
- **Tablet**: Two columns for features, larger text
- **Desktop**: Multi-column layouts, side-by-side content

## 4. Accessibility Standards

### 4.1 WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus States**: Visible focus indicators on all interactive elements
- **Alt Text**: Descriptive alternative text for all images
- **Keyboard Navigation**: Full keyboard accessibility

### 4.2 Focus States
```css
.focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### 4.3 Screen Reader Support
- Semantic HTML structure
- ARIA labels for complex interactions
- Skip navigation links
- Proper heading hierarchy

## 5. Animation & Micro-interactions

### 5.1 Transition Standards
```css
/* Standard easing */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth easing for larger movements */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Bounce for success states */
transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 5.2 Hover Effects
- **Cards**: Lift effect (translateY(-8px))
- **Buttons**: Slight lift (translateY(-2px))
- **Images**: Subtle scale (scale(1.05))

### 5.3 Loading States
- Skeleton screens for content loading
- Progress indicators for sync operations
- Smooth fade-in animations for content

This design system provides the foundation for creating a professional, accessible, and conversion-optimized landing page that appeals to both fitness enthusiasts and personal trainers while maintaining rapid development capabilities.