# Server Setup Instructions

## What's been configured:

1. **Database Module** (`src/database/database.module.ts`)
   - Connects to MongoDB using Mongoose
   - Reads `MONGODB_URL` from `.env` file

2. **Main Bootstrap** (`src/main.ts`)
   - Checks if `MONGODB_URL` is provided - exits gracefully if not
   - Sets global API prefix to `/api`
   - Uses `ConfigService` to read configuration

3. **App Module** (`src/app.module.ts`)
   - Loads environment variables from `.env` file globally
   - Imports `DatabaseModule`
   - Serves static files from `client/dist` **only in production** (when `NODE_ENV=production`)
   - Excludes `/api/*` routes from static file serving

4. **Environment File** (`.env`)
   - `MONGODB_URL`: MongoDB connection string (required)
   - `PORT`: Server port (default: 3000)
   - `NODE_ENV`: Set to `production` to enable static file serving

## Installation:

```bash
cd server
npm install
```

## Running:

**Development:**
```bash
npm run start:dev
```

**Production:**
```bash
set NODE_ENV=production
npm run start:prod
```

## Notes:
- API routes will be available at `/api/...`
- In development, static files are NOT served
- In production, requests to `/` will serve `client/dist/index.html`
- If `MONGODB_URL` is missing in `.env`, the server will exit with an error message
