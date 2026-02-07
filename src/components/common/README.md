# Common UI Components

This directory contains the shared UI component library for the Brain Training Platform. All components follow consistent design patterns using the Slate color system and provide excellent accessibility support.

## Components

### Button

A versatile button component with multiple variants and sizes.

**Features:**
- Three variants: `primary`, `secondary`, `danger`
- Three sizes: `sm`, `md`, `lg`
- Minimum 44x44px touch target for accessibility
- Full width option
- Disabled state support
- Focus indicators for keyboard navigation

**Usage:**
```tsx
import { Button } from '@/components/common';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="danger" disabled>
  Disabled Button
</Button>

<Button fullWidth>
  Full Width Button
</Button>
```

**Props:**
- `variant?: 'primary' | 'secondary' | 'danger'` - Button style (default: 'primary')
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: 'md')
- `children: React.ReactNode` - Button content
- `onClick?: () => void` - Click handler
- `disabled?: boolean` - Disabled state (default: false)
- `fullWidth?: boolean` - Full width mode (default: false)
- `className?: string` - Additional CSS classes

---

### Card

A container component for displaying content with consistent styling.

**Features:**
- Slate color system with rounded-2xl corners
- Optional title section
- Hover effects for interactive cards
- Can be clickable or static
- Shadow and border styling

**Usage:**
```tsx
import { Card } from '@/components/common';

<Card title="Card Title">
  <p>Card content goes here</p>
</Card>

<Card hoverable>
  <p>This card has hover effects</p>
</Card>

<Card onClick={handleClick} hoverable>
  <p>This card is clickable</p>
</Card>
```

**Props:**
- `title?: string` - Optional card title
- `children: React.ReactNode` - Card content
- `className?: string` - Additional CSS classes
- `onClick?: () => void` - Click handler (makes card interactive)
- `hoverable?: boolean` - Enable hover effects (default: false)

---

### ProgressBar

A progress indicator showing current and total values.

**Features:**
- Visual progress bar with percentage
- Optional label showing current/total
- Customizable colors
- Smooth transitions
- ARIA attributes for accessibility

**Usage:**
```tsx
import { ProgressBar } from '@/components/common';

<ProgressBar current={7} total={10} />

<ProgressBar 
  current={50} 
  total={100} 
  showLabel={false}
  color="bg-green-600"
/>
```

**Props:**
- `current: number` - Current progress value
- `total: number` - Total/maximum value
- `showLabel?: boolean` - Show progress label (default: true)
- `color?: string` - Custom color class (default: 'bg-slate-700')
- `className?: string` - Additional CSS classes

---

### LoadingSpinner

An animated spinner for indicating loading states.

**Features:**
- Three sizes: `sm`, `md`, `lg`
- Customizable colors
- Smooth spinning animation
- Screen reader support with ARIA labels

**Usage:**
```tsx
import { LoadingSpinner } from '@/components/common';

<LoadingSpinner />

<LoadingSpinner size="lg" color="border-blue-600" />

<LoadingSpinner label="Loading game data..." />
```

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Spinner size (default: 'md')
- `color?: string` - Custom color class (default: 'border-slate-700')
- `className?: string` - Additional CSS classes
- `label?: string` - Accessible label for screen readers (default: 'Loading...')

---

## Design System

### Color Palette

All components use the **Slate color system** from Tailwind CSS:
- Primary actions: `slate-700`, `slate-800`, `slate-900`
- Secondary elements: `slate-200`, `slate-300`, `slate-400`
- Text: `slate-900` (primary), `slate-700` (secondary), `slate-600` (tertiary)
- Borders: `slate-200`, `slate-300`
- Backgrounds: `white`, `slate-50`, `slate-100`

### Border Radius

- Cards and buttons: `rounded-2xl` (16px)
- Progress bars: `rounded-full`
- Spinners: `rounded-full`

### Shadows

- Default: `shadow-sm`
- Hover: `shadow-md`

### Spacing

- Padding: Uses Tailwind's spacing scale (4, 6, 8 units)
- Gaps: Consistent 3-4 unit gaps between elements

### Typography

- Headings: `font-semibold` or `font-bold`
- Body: `font-medium` for buttons, regular weight for content
- Sizes: `text-sm`, `text-base`, `text-lg`

---

## Accessibility

All components are built with accessibility in mind:

1. **Touch Targets**: All interactive elements meet the minimum 44x44px size requirement
2. **Keyboard Navigation**: Full keyboard support with visible focus indicators
3. **Screen Readers**: Proper ARIA labels, roles, and semantic HTML
4. **Color Contrast**: All text meets WCAG AA standards
5. **Focus Management**: Clear focus indicators using `focus:ring-2`

---

## Testing

Components should be tested for:
- Rendering with different props
- User interactions (clicks, hovers)
- Accessibility (ARIA attributes, keyboard navigation)
- Responsive behavior
- Edge cases (disabled states, empty content, etc.)

See the test files in `__tests__/` for examples.

---

## Demo

To see all components in action, check out `ComponentDemo.tsx` which provides an interactive showcase of all components with various configurations.

---

## Requirements Validation

These components satisfy the following requirements:

- **Requirement 7.1**: Unified button component with variants
- **Requirement 7.2**: Unified card component for content display
- **Requirement 7.3**: Unified progress bar component
- **Requirement 7.4**: Slate color system usage
- **Requirement 7.5**: Consistent border radius (rounded-2xl, rounded-full)
- **Requirement 7.6**: Unified shadow and border styles
- **Requirement 7.7**: Responsive layout support
- **Requirement 10.5**: Minimum 44x44px touch targets
- **Requirement 12.2**: Loading state indicators
