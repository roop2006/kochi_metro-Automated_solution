# KMRL Document Management System - Design Guidelines

## Design Approach
**Selected Approach:** Reference-Based with Government Design System influence
Drawing inspiration from modern government/enterprise portals like gov.uk and transport authority websites, emphasizing trust, accessibility, and efficiency.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- KMRL Blue: 220 85% 45% (primary brand color)
- Deep Navy: 220 70% 25% (secondary)
- Light Blue: 220 60% 92% (backgrounds)

**Supporting Colors:**
- Success Green: 142 70% 45%
- Warning Orange: 35 85% 55%
- Error Red: 0 70% 50%
- Neutral Gray: 220 10% 60%

**Dark Mode:**
- Background: 220 15% 8%
- Surface: 220 12% 12%
- Text Primary: 220 15% 95%

### B. Typography
**Font Family:** Inter (Google Fonts)
- Headers: Inter 600-700 (Semi-bold to Bold)
- Body: Inter 400-500 (Regular to Medium)
- UI Elements: Inter 500 (Medium)

**Scale:**
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### C. Layout System
**Spacing Units:** Tailwind units of 4, 6, 8, 12 (p-4, m-6, h-8, gap-12)
- Container max-width: 1200px
- Grid system: 12-column responsive grid
- Card padding: p-6
- Section spacing: py-12

### D. Component Library

**Navigation:**
- Top navigation bar with KMRL logo
- Breadcrumb navigation for deep pages
- Sidebar navigation for dashboard features

**Cards:**
- Feature cards with icons, titles, descriptions
- Document cards with thumbnail, metadata, actions
- Stats cards with numbers and trend indicators

**Forms:**
- Clean input fields with floating labels
- Drag-and-drop upload zones with dotted borders
- Filter panels with checkboxes and dropdowns

**Data Display:**
- Document lists with grid/list view toggle
- Search results with relevance scoring
- Workflow status indicators with color coding

**Overlays:**
- Modal dialogs for document preview
- Toast notifications for actions
- Loading states with KMRL-branded spinners

### E. Visual Treatments

**Government Authority Aesthetic:**
- Clean, trustworthy design language
- Generous whitespace for clarity
- Consistent iconography using Heroicons
- Subtle shadows and borders for depth

**Interactive Elements:**
- Hover states with subtle color shifts
- Focus indicators for accessibility
- Loading states for all async operations

**Mobile Responsiveness:**
- Mobile-first approach
- Touch-friendly button sizes (minimum 44px)
- Collapsible navigation for smaller screens

## Key Design Principles
1. **Trust & Authority:** Professional appearance befitting government organization
2. **Efficiency:** Quick access to core functions without visual clutter
3. **Accessibility:** WCAG 2.1 AA compliance with proper contrast ratios
4. **Consistency:** Unified design language across all features
5. **Clarity:** Clear visual hierarchy and intuitive navigation patterns

## Images
**KMRL Logo:** Place in top-left navigation, approximately 120px width
**Feature Icons:** Use Heroicons for document, search, QR, and workflow representations
**Document Thumbnails:** Generate previews for uploaded files in search results
**No Hero Image:** Dashboard focuses on functional cards rather than large imagery