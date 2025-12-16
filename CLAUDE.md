# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application called "Acts of Service Coupons" - a web-based coupon redemption system for services. The app allows users to claim and redeem different types of service coupons with visual progress tracking.

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production (runs TypeScript check then Vite build)
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Technology Stack
- **React 19.2.0** with TypeScript for the frontend
- **Vite 7.2.4** as the build tool and dev server
- **Tailwind CSS** for styling with a custom pastel theme
- **Framer Motion** for animations throughout the app
- **Lucide React** for icons
- **Google Sheets API** for persistent data storage
- **Google APIs Client Library** for Google Sheets integration

### Project Structure
```
src/
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (icon mapping, etc.)
├── services/        # External service integrations (Google Sheets)
├── components/
│   ├── layout/      # Layout components (backgrounds)
│   ├── ui/          # Reusable UI components
│   ├── coupons/     # Coupon-specific components
│   ├── modals/      # Modal/dialog components
│   ├── effects/     # Animation components
│   └── views/       # Screen-level components
└── assets/          # Static assets and custom SVG components
```

### Key Components
- `App.tsx` - Main application component with all state management
- `CouponCard` - Individual coupon display with progress tracking
- `RedemptionModal` - Modal for redeeming coupons
- `RequestHistory` - View showing all redemption history
- `Confetti` - Celebration animation effect

### State Management
The application uses React's `useState` hook for state management. All state is currently held in the main `App` component following a props-down, events-up pattern.

**Data Persistence**: The app integrates with Google Sheets for persistent storage:
- Coupon definitions are stored in the "Coupons" sheet
- Current claim states are tracked in the "CouponState" sheet
- The app fetches data on load and includes fallback coupons if Google Sheets is unavailable
- Write operations (updating claim counts) require OAuth2 authentication setup

### Animation System
Framer Motion is used extensively with predefined variants in components. The app features smooth transitions, hover effects, and a confetti celebration animation on successful redemptions.

### Styling Approach
- Tailwind CSS for utility-first styling
- Custom color theme defined in `src/types/theme.ts`
- Pastel color palette (pinks, mints, yellows)
- Mobile-first responsive design

### Type Safety
All components have strict TypeScript prop interfaces. Types are centralized in `src/types/index.ts` for core data structures and `src/types/theme.ts` for styling constants.

## Development Notes

### No Test Framework
Currently, there is no test framework configured. When adding tests, you'll need to set up a testing library like Jest or Vitest.

### Data Storage
The application uses Google Sheets as a simple backend:
- **Reading data**: Uses API key for public sheet access
- **Writing data**: Requires OAuth2 authentication (not yet implemented)
- **Schema**: Normalized with separate sheets for static definitions and dynamic states
- **Offline support**: Includes fallback coupons when Google Sheets is unavailable

### ESLint Configuration
Uses modern ESLint flat config with React-specific rules. The configuration is in `eslint.config.js`.