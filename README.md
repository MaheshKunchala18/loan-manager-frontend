# CreditSea Loan Manager

A full-stack loan management system built for CreditSea fintech platform with role-based authentication and comprehensive dashboard functionality.

## Features

- **Role-based Authentication**
  - Verifier: Can verify or reject loan applications
  - Admin: Can approve/reject applications and manage other admins

- **Loan Management**
  - Application submission forms
  - Application tracking and status updates
  - Statistics dashboard with real-time data

- **Admin Panel**
  - User management for admins
  - Application approval workflow
  - System statistics and analytics

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express and TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens with role-based access control

## Project Structure

```
creditsea-loan-manager/
├── backend/          # Node.js + TypeScript backend
├── frontend/         # React.js + TypeScript frontend

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### 1. Environment Setup

Create environment files in both backend and frontend directories:

#### Backend Environment (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/creditsea

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Admin Setup
ADMIN_EMAIL=admin@creditsea.com
ADMIN_PASSWORD=Admin123!
```

#### Frontend Environment (.env)
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=CreditSea
VITE_APP_VERSION=1.0.0
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Or install individually
cd backend && npm install
cd ../frontend && npm install
```

### 3. Start Development Servers

```bash
# Start both backend and frontend
npm run dev

# Or start individually
cd backend && npm run dev    # Backend: http://localhost:5000
cd frontend && npm run dev   # Frontend: http://localhost:3000
```

## Demo Accounts

The system comes with pre-configured demo accounts:

- **Admin**: `admin@creditsea.com` / `Admin123!`
- **Verifier**: `verifier@creditsea.com` / `Verifier123!`  
- **User**: `user1@example.com` / `User123!`

## API Documentation

When the backend is running, API documentation is available at:
- Health Check: `http://localhost:5000/api/health`
- Full API docs: See `backend/API_DOCUMENTATION.md`

## Environment Variables

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/creditsea` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `ADMIN_EMAIL` | Default admin email | `admin@creditsea.com` |
| `ADMIN_PASSWORD` | Default admin password | `Admin123!` |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name | `CreditSea` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## Roles & Permissions

### Verifier
- View loan applications
- Verify or reject applications
- Access verification dashboard

### Admin
- All verifier permissions
- Approve or reject pending applications
- Add new admin users
- Delete existing admin users
- Access full system statistics

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run type-check   # TypeScript type checking
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
```

## Production Deployment

1. Set `NODE_ENV=production` in backend
2. Update environment variables for production
3. Build both applications:
   ```bash
   npm run server:build
   npm run client:build
   ```
4. Deploy backend to your server
5. Deploy frontend to a static hosting service

## Security Features

- JWT-based authentication
- Role-based access control
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Password hashing with bcrypt