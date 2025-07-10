# Batch Processing Dashboard

A modern React + TypeScript frontend application for managing batch processing operations with dummy data.

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI Components
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: TanStack Query
- **Authentication**: Client-side with localStorage (mock)
- **Data**: Mock/dummy data (no backend required)

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
- No backend server needed!

### Demo Login Credentials
- **Email**: `demo@example.com` | **Password**: `password123`
- **Email**: `admin@example.com` | **Password**: `admin123`
- **Email**: `user@example.com` | **Password**: `user123`

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

- ✅ **Pure Frontend** - No backend dependencies
- ✅ **Mock Authentication** - Client-side login simulation
- ✅ **Dummy Data** - Pre-populated batch settings
- ✅ **Form Validation** - Real-time validation with Zod
- ✅ **Responsive Design** - Mobile-friendly UI
- ✅ **Loading States** - Realistic loading simulations
- ✅ **Error Handling** - Proper error states
- ✅ **TypeScript** - Full type safety
- ✅ **Easy Deployment** - Ready for Vercel/Netlify

## 🎯 Perfect for:
- **Prototyping** - Quick UI/UX testing
- **Demos** - Showcasing frontend capabilities  
- **Portfolio** - Clean, professional project
- **Learning** - Modern React patterns & best practices
