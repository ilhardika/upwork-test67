# 🚀 Batch Processing Dashboard

A modern, responsive React + TypeScript frontend application for managing AI call agent batch processing operations with seamless Office 365 calendar integration.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)

## 🎯 Overview

This application provides a clean, intuitive interface for managing batch processing operations in an AI call agent system. Users can configure call schedules, set import parameters, and automatically connect their Office 365 calendar for seamless appointment management.

## 🚀 Tech Stack

### Frontend

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript 5.x** - Full type safety and enhanced developer experience
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Radix UI** - Accessible, unstyled UI components

### Form & State Management

- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **TanStack Query** - Powerful data synchronization for React

### Authentication & API

- **JWT Authentication** - Secure token-based authentication
- **Real API Integration** - Connected to AI Call Agent Backend
- **Office 365 Integration** - Automatic calendar connection

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 8.x or higher (or **yarn** 1.22+)
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ranmax123/paul-voice-ai-portal.git
   cd paul-voice-ai-portal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy environment template
   cp .env.example .env

   # The .env file contains:
   VITE_API_URL=https://ai-call-agent-backend-ab55f1d0898d.herokuapp.com
   ```

### Development Mode

```bash
npm run dev
```

**Development Server Details:**

- 🌐 **URL**: `http://localhost:3000`
- 🔥 **Hot Reload**: Enabled for instant updates
- 🔗 **API Connection**: Real backend integration
- 📱 **Responsive**: Mobile-friendly development

### Demo Credentials

- **Email**: `pvsavaliya07@gmail.com`
- **Password**: `pass123`

## 📋 Application Features

### 🔐 Authentication System

- **Secure JWT Login** - Token-based authentication with real API
- **Session Management** - Automatic token storage and validation
- **Protected Routes** - Dashboard access only for authenticated users
- **Auto Logout** - Clean session termination

### 📊 Batch Processing Management

- **Smart Form Validation** - Real-time validation with helpful error messages
- **Configurable Parameters**:
  - **Call Schedule Percentage** (0-100%) - Target percentage of old patients
  - **Import Setup ID** - Positive integer for batch configuration
  - **Hourly Batch Count** (1-100) - Number of batches per hour
- **Async Processing** - Non-blocking batch operations with loading states

### 📅 Office 365 Calendar Integration

- **Automatic Auth URL Generation** - Post-batch calendar connection
- **One-Click Connection** - Seamless Office 365 authentication
- **New Tab Opening** - User-friendly external link handling
- **Error Recovery** - Graceful handling of calendar connection failures

### 🎨 User Experience

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Loading States** - Visual feedback for all async operations
- **Error Handling** - Comprehensive error messages and recovery
- **Success Notifications** - Clear feedback for completed actions
- **Clean UI** - Modern design with Radix UI components

## 🔌 API Integration

### Backend Endpoint

```
Base URL: https://ai-call-agent-backend-ab55f1d0898d.herokuapp.com
```

### Authentication

```http
POST /login
Content-Type: application/json

{
  "email": "pvsavaliya07@gmail.com",
  "password": "pass123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Start Batch Processing

```http
POST /start-master-batch
Authorization: Bearer {token}
Content-Type: application/json

{
  "new_call_schedule_percentage": 60,
  "import_setup_id": 3,
  "hourly_batch_count": 60
}

Success Response:
{
  "task_id": "uuid-string",
  "message": "Steam records fetch task has been triggered successfully"
}
```

### Get Office 365 Auth URL

```http
GET /get_auth_url
Authorization: Bearer {token}

Response:
{
  "auth_url": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?..."
}
```

## 🌐 Deploy to Vercel

### Quick Deploy (Recommended)

1. **Fork this repository** on GitHub
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
   - Vercel auto-detects React/Vite settings
3. **Deploy** - Click deploy and you're live! 🚀

### Manual Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Build Configuration

**Vercel Settings:**

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x

**Environment Variables:**

```
VITE_API_URL=https://ai-call-agent-backend-ab55f1d0898d.herokuapp.com
```

### Auto-Deploy Setup

- ✅ **GitHub Integration** - Auto-deploy on push to main
- ✅ **Preview Deployments** - Every PR gets a preview URL
- ✅ **Custom Domain** - Easy custom domain setup
- ✅ **HTTPS** - Automatic SSL certificates

## 📁 Project Structure

```
upwork-test67/
├── 📂 src/                          # React application source
│   ├── 📂 components/               # Reusable UI components
│   │   └── 📂 ui/                   # Radix UI components
│   ├── 📂 pages/                    # Application pages
│   │   ├── 📄 login.tsx             # Login page with form validation
│   │   └── 📄 dashboard.tsx         # Main dashboard interface
│   ├── 📂 lib/                      # Utility libraries
│   │   ├── 📄 auth.ts               # Authentication service
│   │   ├── 📄 batchService.ts       # Batch processing API calls
│   │   └── 📄 queryClient.ts        # TanStack Query configuration
│   ├── 📄 App.tsx                   # Main app component with routing
│   └── 📄 main.tsx                  # React app entry point
├── 📂 shared/                       # Shared utilities
│   └── 📄 schema.ts                 # Zod validation schemas & types
├── 📄 index.html                    # HTML template
├── 📄 vite.config.ts                # Vite build configuration
├── 📄 tailwind.config.ts            # Tailwind CSS configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 vercel.json                   # Vercel deployment config
├── 📄 .env                          # Environment variables
└── 📄 package.json                  # Dependencies & scripts
```

### Key Directories Explained

- **`src/components/ui/`** - Pre-built Radix UI components (Button, Input, Alert, etc.)
- **`src/pages/`** - Route-based page components with full functionality
- **`src/lib/`** - Business logic, API services, and utility functions
- **`shared/`** - Type definitions and validation schemas used across the app

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run check        # Run TypeScript type checking

# Utilities
npm install          # Install all dependencies
npm run build        # Create optimized production build
```

## ✨ Features Showcase

### 🔐 Secure Authentication Flow

1. **Login Form** - Email/password with real-time validation
2. **JWT Token Storage** - Secure token management in localStorage
3. **Protected Routes** - Automatic redirect for unauthenticated users
4. **Session Persistence** - Stay logged in across browser sessions

### 📊 Batch Processing Workflow

1. **Form Configuration** - Set call percentage, import ID, and batch count
2. **Real-time Validation** - Instant feedback on input errors
3. **API Integration** - Direct connection to backend services
4. **Success Handling** - Automatic Office 365 calendar integration

### 📅 Calendar Integration Flow

1. **Batch Success** → Automatic auth URL generation
2. **User Notification** → Clear success message with action button
3. **One-Click Connect** → Opens Office 365 auth in new tab
4. **Seamless Integration** → Calendar ready for appointment scheduling

## 🛠️ Development Guidelines

### Code Style

- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality and consistency
- **Prettier** - Automatic code formatting
- **Tailwind CSS** - Utility-first styling approach

### Component Architecture

- **Functional Components** - Modern React with hooks
- **Custom Hooks** - Reusable logic extraction
- **Form Handling** - React Hook Form with Zod validation
- **State Management** - TanStack Query for server state

### API Integration Patterns

- **Service Layer** - Dedicated API service files
- **Error Handling** - Comprehensive error boundaries
- **Loading States** - User-friendly async feedback
- **Type Safety** - Full TypeScript coverage

## 🚨 Troubleshooting

### Common Issues

**Build Errors:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port Already in Use:**

```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- --port 3001
```

**Environment Variables:**

```bash
# Ensure .env file exists with correct API URL
echo "VITE_API_URL=https://ai-call-agent-backend-ab55f1d0898d.herokuapp.com" > .env
```

### API Connection Issues

- ✅ **Check API URL** - Verify VITE_API_URL in .env
- ✅ **Network Access** - Ensure backend is accessible
- ✅ **CORS Settings** - Backend should allow frontend domain
- ✅ **Token Validity** - Check JWT token expiration

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vercel** - For seamless deployment platform
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For utility-first CSS framework
- **TanStack** - For powerful data synchronization tools

---
