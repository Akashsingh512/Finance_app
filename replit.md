# Personal Finance Tracker

## Overview

A Progressive Web Application (PWA) designed as a personal finance tracking system for managing income and expenses in Indian Rupees (₹). The application provides offline-first functionality with local data persistence, allowing users to track transactions across five categories: Savings, Expenses, Debt, Needs, and Wants. Built with a modern web stack that can serve as a foundation for cross-platform deployment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Tailwind CSS** with **shadcn/ui** component library for consistent Material Design-inspired UI
- **Wouter** for lightweight client-side routing
- **React Hook Form** with **Zod** validation for form management and data validation
- **TanStack Query** for state management and data caching
- **PWA capabilities** with service worker for offline functionality and app-like experience

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints
- **RESTful API design** with CRUD operations for transaction management
- **In-memory storage** (MemStorage) as the current data layer with interface abstraction
- **Zod schemas** shared between frontend and backend for consistent data validation
- **Error handling middleware** for centralized error management

### Data Storage Solutions
- **Local-first approach** with IndexedDB for client-side data persistence
- **Interface-based storage abstraction** allowing for future database migrations
- **Drizzle ORM** configuration ready for PostgreSQL integration (currently using in-memory storage)
- **Import/Export functionality** via CSV for data portability and backup

### UI/UX Design Patterns
- **Mobile-first responsive design** optimized for phone screens
- **Bottom navigation** for primary app navigation (Home, History, Analytics, Settings)
- **Material Design principles** with custom color scheme for transaction categories
- **Progressive enhancement** from web app to installable PWA
- **Offline-capable** with service worker caching strategies

### Data Management
- **Category-based transaction system** with predefined types (Saving, Expense, Debt, Need, Want)
- **Monthly transaction organization** with navigation between time periods
- **Search and filtering capabilities** across transactions
- **Real-time balance calculations** and category summaries
- **Data validation** using shared Zod schemas

### State Management Strategy
- **Custom React hooks** for transaction operations and business logic
- **TanStack Query** for server state management and caching
- **Local component state** for UI interactions
- **Context-free architecture** relying on props and custom hooks

## External Dependencies

### UI Framework Dependencies
- **@radix-ui/react-*** components for accessible UI primitives
- **shadcn/ui** component system built on Radix UI
- **class-variance-authority** and **clsx** for conditional styling
- **lucide-react** for consistent iconography
- **tailwindcss** for utility-first styling

### Data and Forms
- **react-hook-form** and **@hookform/resolvers** for form management
- **zod** and **drizzle-zod** for schema validation
- **@tanstack/react-query** for server state management

### Development and Build Tools
- **vite** and **@vitejs/plugin-react** for development and building
- **typescript** for type safety
- **tsx** for TypeScript execution in development

### Database and Storage
- **drizzle-orm** and **drizzle-kit** for future database operations
- **@neondatabase/serverless** configured for PostgreSQL connectivity
- **connect-pg-simple** for session storage (when database is added)

### PWA and Performance
- **@replit/vite-plugin-*** for Replit-specific development enhancements
- Service worker implementation for offline capabilities
- Web App Manifest for installable PWA experience

### Utility Libraries
- **date-fns** for date manipulation and formatting
- **nanoid** for unique ID generation
- **embla-carousel-react** for carousel components (if needed)