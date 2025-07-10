# System Overview

This is a full-stack web application built with a React frontend and Express.js backend, featuring user authentication and batch settings management. The application uses modern TypeScript throughout and follows a monorepo structure with shared schemas.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state, React Hook Form for form state
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Authentication**: JWT-based authentication with Bearer tokens
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Development**: Hot reload with tsx for TypeScript execution

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Migrations**: Drizzle Kit for schema management
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Development Storage**: In-memory storage fallback for development

## Key Components

### Authentication System
- JWT-based authentication with 24-hour token expiration
- Protected routes using route guards
- Token storage in localStorage
- Automatic redirects for authenticated/unauthenticated users

### Database Schema
- **Users Table**: Basic user management with email/password
- **Batch Settings Table**: User-specific configuration settings
- **Relationships**: Foreign key relationship between users and batch settings

### Form Management
- React Hook Form with Zod validation
- Shared validation schemas between frontend and backend
- Type-safe form handling with TypeScript inference

### UI System
- shadcn/ui component library with Radix UI primitives
- Consistent design system with CSS custom properties
- Dark/light theme support built-in
- Responsive design with mobile-first approach

## Data Flow

1. **Authentication Flow**:
   - User submits login form
   - Backend validates credentials and returns JWT
   - Frontend stores token and redirects to dashboard
   - Protected routes verify token on each request

2. **Settings Management Flow**:
   - Dashboard loads current user settings via TanStack Query
   - Form pre-populates with existing settings
   - Form submission sends data to backend
   - Backend validates and upserts settings
   - Frontend shows success/error feedback

3. **API Communication**:
   - RESTful API design with Express routes
   - JSON request/response format
   - Error handling with proper HTTP status codes
   - Request logging middleware for debugging

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Uses DATABASE_URL environment variable
- **Pooling**: Built-in connection pooling via Neon serverless

### Development Tools
- **Replit Integration**: Special handling for Replit environment
- **Vite Plugins**: Runtime error overlay and development banner
- **TypeScript**: Strict mode with modern ES features

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Icon library for UI elements
- **date-fns**: Date manipulation utilities
- **class-variance-authority**: Dynamic CSS class management

## Deployment Strategy

### Production Build
- Frontend builds to `dist/public` directory
- Backend bundles with esbuild to `dist/index.js`
- Static file serving in production mode
- Environment-based configuration

### Development Setup
- Concurrent frontend and backend development
- Vite dev server with HMR for frontend
- tsx for TypeScript execution on backend
- Automatic database migration on startup

### Environment Configuration
- Separate development and production modes
- Environment variables for database connection
- JWT secret configuration
- Replit-specific optimizations when detected

### Database Management
- Schema-first approach with Drizzle
- Migration files generated in `/migrations` directory
- Push-based deployment with `db:push` command
- Type-safe database queries with Drizzle ORM