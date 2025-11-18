# Plug SiteGuard

A modern monorepo project for site guard management built with React, TypeScript, and Tailwind CSS v4.

## Project Structure

```
plug-siteguard/
├── apps/
│   └── yongin-smart-city/  # 용인 스마트시티 애플리케이션
├── packages/
│   └── ui/                 # Shared UI design system
├── pnpm-workspace.yaml     # pnpm workspace configuration
├── turbo.json              # Turborepo configuration
└── package.json            # Root package configuration
```

## Tech Stack

- **Package Manager**: pnpm 10.9.0
- **Build System**: Turborepo 2.4.3
- **Frontend**: React 19, TypeScript 5.8.2
- **Build Tool**: Vite 7.0.0
- **Styling**: Tailwind CSS v4.0.10
- **Components**: Radix UI
- **Documentation**: Storybook 8.6.10
- **Node**: >=22.0.0

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 10.0.0

### Installation

```bash
pnpm install
```

### Development

Run all apps in development mode:
```bash
pnpm dev
```

Run specific app:
```bash
pnpm dev:yongin
```

### Storybook

Launch Storybook for UI components:
```bash
pnpm storybook
```

### Build

Build all packages:
```bash
pnpm build
```

Build specific app:
```bash
pnpm build:yongin
```

### Other Commands

```bash
# Type checking
pnpm type-check

# Preview production build
pnpm preview

# Clean all build artifacts
pnpm clean
```

## Packages

### Apps

- **@plug-siteguard/yongin** - 용인 스마트시티 웹 애플리케이션

### Shared Packages

- **@plug-siteguard/ui** - Shared UI component library with Tailwind CSS v4 and Radix UI primitives (Atomic Design)

## Architecture

This project follows the **Atomic Design** methodology for UI components:

- **Atoms**: Basic building blocks (buttons, inputs, etc.)
- **Molecules**: Simple component combinations
- **Organisms**: Complex, feature-complete components
- **Templates**: Page-level layouts

## License

Private
