# Estimator Admin - Authentication & Routing Implementation

## Overview
A full-stack application with JWT-based authentication, protected routes, and Material-UI dark theme.

## Features Implemented

### Backend (NestJS)
✅ **Auth Module** (`src/auth/`)
- JWT authentication with 7-day token expiration
- Login endpoint: `POST /api/auth/login`
- Password validation using bcrypt
- Passport JWT strategy for route protection
- Auth guard for protecting endpoints

✅ **Database**
- MongoDB integration with Mongoose
- Client schema with password hashing
- comparePassword method for authentication

✅ **API Configuration**
- Global `/api` prefix
- CORS enabled with credentials support
- Environment-based ServeStaticModule (production only)

### Frontend (React + TypeScript)
✅ **React Router v6**
- Protected routes that redirect unauthenticated users to login
- Login page (`/login`)
- Home/Dashboard page (`/home`)
- Automatic redirection based on authentication status

✅ **Authentication Services**
- `api.ts` - Centralized API service with auto-token injection
- `auth.ts` - Token and user info management (localStorage)
- `validation.ts` - Form validation logic (email, phone, password)

✅ **UI Components**
- LoginPage - Email/password login with registration link
- HomePage - Dashboard with logout functionality
- RegistrationForm - Create account dialog
- ProtectedRoute - Route guard component

## Authentication Flow

### Registration
1. User clicks "Register here" on login page
2. Registration form opens as a dialog
3. User fills in details (name, email, phone, address, password)
4. Form validates:
   - Email format
   - 10-digit Indian phone number (6-9 start)
   - Password minimum 6 characters
   - Password confirmation match
5. On submit, `POST /api/clients` is called
6. User is created in MongoDB with hashed password
7. Dialog closes, user returns to login

### Login
1. User enters email and password
2. `POST /api/auth/login` is called
3. Server validates credentials against MongoDB
4. On success, server returns:
   - JWT access token
   - User info (id, email, firstName, lastName)
5. Client stores token and user in localStorage
6. User is automatically redirected to `/home`

### Protected Routes
- If user visits `/home` without token → redirected to `/login`
- If user tries to access undefined routes → redirected to `/home`
- If user is authenticated but visits `/login` → they'll see login page (can navigate back with URL)

### Logout
- User clicks logout button on home page
- Token and user info removed from localStorage
- User redirected to `/login`

## Project Structure

```
server/
├── src/
│   ├── auth/                 # Authentication module
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/       # JWT strategy
│   │   ├── guards/           # JWT auth guard
│   │   ├── dto/              # LoginDto
│   │   └── interfaces/       # JwtPayload interface
│   ├── database/
│   │   ├── schemas/          # Client schema
│   │   └── client/           # Client CRUD
│   ├── app.module.ts
│   └── main.ts
└── .env                      # MongoDB URL, Port, JWT_SECRET

client/
├── src/
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   └── HomePage.tsx
│   ├── components/
│   │   ├── RegistrationForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── services/
│   │   ├── api.ts           # API service with auto-token injection
│   │   ├── auth.ts          # Token & user management
│   │   └── validation.ts    # Form validation
│   ├── App.tsx              # Router setup
│   └── main.tsx
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
  - Request: `{ email: string, password: string }`
  - Response: `{ access_token: string, user: { id, email, firstName, lastName } }`

### Clients
- `POST /api/clients` - Register new client
- `GET /api/clients` - Get all clients (protected)
- `GET /api/clients/:id` - Get specific client (protected)
- `PATCH /api/clients/:id` - Update client (protected)
- `DELETE /api/clients/:id` - Delete client (protected)

## Environment Variables

### Server (.env)
```
MONGODB_URL=mongodb+srv://...
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
```

### Client (via Vite)
- Uses `NODE_ENV` from server build process
- Dev: API calls to `http://localhost:3000/api`
- Prod: API calls to `/api` (same domain)

## Running the Application

### Development
```bash
# Terminal 1 - Start server
cd server
yarn.cmd start:dev

# Terminal 2 - Start client
cd client
yarn.cmd dev
```

### Production Build
```bash
# Build server
cd server
yarn.cmd build
NODE_ENV=production yarn.cmd start:prod

# Build client
cd client
NODE_ENV=production yarn.cmd build
```

## Security Features
✅ JWT tokens with 7-day expiration
✅ Bcrypt password hashing (10 salt rounds)
✅ Passwords excluded from API responses
✅ Protected routes with auth guards
✅ CORS enabled for development and production
✅ Environment-based API URL configuration

## Next Steps (Optional Enhancements)
- Refresh token implementation
- Role-based access control (RBAC)
- Protected API endpoints with JwtAuthGuard
- Password reset functionality
- Email verification
- Rate limiting
- Request logging and monitoring
