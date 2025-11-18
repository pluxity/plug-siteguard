# @plug-siteguard/ui

Shared UI component library built with React, TypeScript, and Tailwind CSS v4 following Atomic Design principles.

## Features

- 🎨 **Atomic Design** - Components organized by complexity (atoms, molecules, organisms)
- ⚛️ **React 19** - Latest React with new features
- 🔷 **TypeScript 5.7** - Full type safety
- 🎨 **Tailwind CSS v4** - Latest utility-first CSS framework
- ♿ **Accessible** - Built with Radix UI primitives
- 📚 **Storybook 8.6** - Interactive component documentation
- 🎯 **Type-safe variants** - class-variance-authority for component variants

## Installation

This package is part of the plug-siteguard monorepo and should be used internally.

```bash
pnpm add @plug-siteguard/ui
```

## Usage

### Import Styles

Import the global styles in your application:

```tsx
import '@plug-siteguard/ui/globals.css';
```

### Use Components

You can import components from different levels of the atomic design hierarchy:

```tsx
// Import all components
import { Button } from '@plug-siteguard/ui';

// Import from specific levels
import { Button } from '@plug-siteguard/ui/atoms';

function App() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  );
}
```

### Import Utilities

```tsx
import { cn } from '@plug-siteguard/ui/utils';

const className = cn('base-class', condition && 'conditional-class');
```

## Atomic Design Structure

### Atoms (Basic building blocks)
- **Button** - Versatile button component with multiple variants and sizes

### Molecules (Simple combinations)
Coming soon...

### Organisms (Complex components)
Coming soon...

## Development

### Storybook

Launch Storybook for interactive component development:

```bash
pnpm storybook
```

Build Storybook for production:

```bash
pnpm build-storybook
```

### Type Checking

```bash
pnpm type-check
```

### Clean

```bash
pnpm clean
```

## Component Variants

### Button (Atom)

```tsx
// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

## Export Structure

```typescript
// Main export (all components)
import { Button } from '@plug-siteguard/ui';

// Atomic level exports
import { Button } from '@plug-siteguard/ui/atoms';
import { /* molecules */ } from '@plug-siteguard/ui/molecules';
import { /* organisms */ } from '@plug-siteguard/ui/organisms';

// Utilities
import { cn } from '@plug-siteguard/ui/utils';

// Styles
import '@plug-siteguard/ui/globals.css';
```
