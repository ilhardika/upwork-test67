# Batch Processing Dashboard

A modern React + TypeScript frontend application for managing batch processing operations with real API integration.

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI Components
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: TanStack Query
- **Authentication**: JWT with real API backend
- **API**: Integrated with AI Call Agent Backend

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

- Runs on: `http://localhost:3000`
- Hot reload enabled
- Connects to real API backend

### Demo Login Credentials

- **Email**: `pvsavaliya07@gmail.com` | **Password**: `pass123`

## 🌐 Deploy to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will auto-deploy on every push to main branch

### Build Command

```bash
npm run build
```

## 📁 Project Structure

```
├── src/                    # React application source
│   ├── components/         # Reusable UI components
│   ├── pages/             # Route pages (login, dashboard)
│   ├── lib/               # Utilities & mock services
│   │   ├── mockApi.ts     # Mock API services
│   │   ├── mockData.ts    # Dummy data
│   │   └── auth.ts        # Client-side auth
│   └── App.tsx            # Main app component
├── shared/                # Shared types & validation schemas
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies & scripts
```

## ✨ Features

- ✅ **Real API Integration** - Connected to AI Call Agent Backend
- ✅ **JWT Authentication** - Secure login with real credentials
- ✅ **Batch Processing** - Start master batch operations
- ✅ **Form Validation** - Real-time validation with Zod
- ✅ **Responsive Design** - Mobile-friendly UI
- ✅ **Loading States** - Proper async handling
- ✅ **Error Handling** - Comprehensive error management
- ✅ **TypeScript** - Full type safety
- ✅ **Easy Deployment** - Ready for Vercel

## 🎯 Perfect for:

- **Prototyping** - Quick UI/UX testing
- **Demos** - Showcasing frontend capabilities
- **Portfolio** - Clean, professional project
- **Learning** - Modern React patterns & best practices
