# NutraScan AI - Design Guidelines

## Design Approach

**Hybrid System-Based Design**: Material Design principles with health/wellness app aesthetics inspired by modern medical apps (Headspace structure, Yuka's scoring clarity, Apple Health's trustworthiness).

**Rationale**: This is a utility-focused, information-dense application where users need instant clarity and trust. The design must feel authoritative, scientific, and mobile-optimized for in-store use.

## Typography System

**Font Stack**:
- Primary: Inter (Google Fonts) - body text, UI elements
- Accent: Space Grotesk (Google Fonts) - headings, scores

**Hierarchy**:
- Hero Score Display: 64px/bold (Space Grotesk)
- Section Headers: 24px/semibold (Space Grotesk)
- Card Titles: 18px/semibold (Inter)
- Body Text: 16px/regular (Inter)
- Captions/Labels: 14px/medium (Inter)
- Small Data: 12px/regular (Inter)

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistency
- Component padding: p-4, p-6
- Section spacing: py-8, py-12, py-16
- Card gaps: gap-4, gap-6
- Icon-text spacing: gap-2

**Container Strategy**:
- Max-width: max-w-2xl (optimal mobile-first reading)
- Full-width cards for scan results
- Grid layouts for alternatives: grid-cols-1 md:grid-cols-2

## Core Components

### Navigation
- Bottom navigation bar (mobile-optimized, fixed)
- Icons: Home, Scan, History, Profile (Heroicons)
- Active state: filled icon with label

### Scan Interface
- Large, centered camera icon button with subtle pulse animation
- Three input tabs: Photo / Text / Voice (pill-shaped segmented control)
- Minimal chrome, maximum capture area
- Processing state: skeleton loaders with gentle shimmer

### Score Display (Critical Component)
- Circular progress ring (0-100 scale)
- Large center number with "/100" suffix
- Background gradient based on score range:
  - 0-40: Warning tone
  - 41-70: Neutral tone  
  - 71-100: Success tone
- Label beneath: "Overall Quality Score"

### Analysis Cards
- White elevated cards with rounded-lg corners
- Ingredient list: Icon + Name + Dosage + Ideal % indicator
- Visual dosage bars showing actual vs. ideal
- Expandable sections for detailed scientific rationale
- Small "i" info icons for additional context

### Alternative Recommendations
- Card-based layout with product images
- Score badge in top-right corner
- Price + savings highlight
- "View Online" or "Available Nearby" tags
- Distance indicator for local options (GPS-based)

### Paywall Modal
- Semi-transparent backdrop
- Centered card with benefit list
- Visual pricing comparison (Free: 1 scan vs Premium: Unlimited)
- Prominent CTA button
- "Restore Purchase" link at bottom

### Conversational AI Pop-up
- Bottom sheet modal (slides up from bottom)
- Avatar icon + greeting message
- Quick-reply buttons for common goals (Energy / Focus / Sleep / Immunity)
- Chat input for custom queries
- Dismiss gesture: swipe down

### History Dashboard
- Chronological list with thumbnail, score, date
- Filter chips: All / High Score / Low Score / Recent
- Swipe actions: Share, Delete
- Empty state: Illustration + "Scan your first supplement"

## Component States

**Interactive Elements**:
- Buttons: rounded-lg with subtle shadow, press feedback
- Cards: hover lift effect (desktop), tap feedback (mobile)
- Inputs: focused ring, clear validation states
- Loading: skeleton screens, not spinners

**Accessibility**:
- Touch targets: minimum 44×44px
- ARIA labels on all icons
- Focus indicators on all interactive elements
- High contrast text (WCAG AA minimum)

## Visual Treatment

**Elevation/Depth**:
- Use shadow-sm for cards
- Use shadow-md for modals
- Use shadow-lg for navigation bar

**Borders & Radius**:
- Cards: rounded-lg (8px)
- Buttons: rounded-lg (8px)
- Inputs: rounded-md (6px)
- Pills/Badges: rounded-full

**Icons**:
- Heroicons (outline for inactive, solid for active)
- Consistent 24px size for primary actions
- 20px for secondary/inline icons

## Images

**Hero Section**: No large hero image - this is a utility app, not marketing
**In-App Images**:
- Product thumbnails in history (square, 80×80px)
- Alternative supplement product images (16:9 ratio)
- Empty state illustrations (simple, friendly line art)
- Onboarding slides (optional 3-slide intro on first launch)

**Image Placement**:
- Scan preview: Full-width, centered in scan interface
- Results: Product photo at top of analysis card
- Alternatives: Thumbnail images in recommendation cards

## Animations

**Minimal, Purposeful Motion**:
- Scan button: Subtle pulse (1.5s loop) to draw attention
- Score reveal: 0→final score count-up animation (1s)
- Card entry: Stagger fade-in for list items (100ms delay)
- Modal entry: Slide-up with backdrop fade
- No decorative animations

## Data Visualization

**Dosage Comparison Bars**:
- Horizontal bar showing actual vs. ideal
- Two-tone bar (actual filled, ideal outlined)
- Percentage label at end

**Savings Display**:
- Large dollar amount in accent font
- "Potential Savings" label
- Icon: piggy bank or dollar sign

**Location Indicator**:
- Distance text with location pin icon
- "0.3 mi away" format
- Map preview (optional tap-to-expand)

## Responsive Behavior

**Mobile (base)**:
- Single column layouts
- Bottom navigation
- Full-width cards
- Large touch targets

**Desktop (md: and up)**:
- Two-column layouts for alternatives
- Side navigation (left rail)
- Constrained content width (max-w-2xl)
- Hover states enabled