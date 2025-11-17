# Railway Configuration Files

This directory contains Railway.app deployment configuration files for both frontend and backend services.

## Files

- `railway.toml` - Backend service configuration (root directory)
- `frontend/railway.toml` - Frontend service configuration
- `RAILWAY_DEPLOYMENT.md` - Complete deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Quick deployment checklist

## Quick Start

### 1. Backend Deployment

The `railway.toml` file (in project root) configures:
- Build command: `npm install && npx prisma generate`
- Start command: `npm run start:prod`
- Healthcheck: `/api/v1/health`
- Auto-restart on failure

### 2. Frontend Deployment

The `frontend/railway.toml` file configures:
- Build command: `npm install && npm run build`
- Start command: `npx serve -s dist -p $PORT`
- Auto-restart on failure

## Using Configuration Files

Railway automatically detects and uses `railway.toml` files:

1. **Backend Service**: Set Root Directory to `/` (or leave empty)
   - Railway reads `railway.toml` from project root

2. **Frontend Service**: Set Root Directory to `frontend`
   - Railway reads `railway.toml` from `frontend/` directory

## Important Notes

1. **Environment Variables**: The TOML files don't contain environment variables. You must set these in Railway's UI for each service.

2. **Separate Services**: Deploy backend and frontend as separate Railway services for better scalability and management.

3. **Database**: Add PostgreSQL as a separate Railway add-on.

4. **Root Directory Setting**: This is crucial for Railway to find the correct `railway.toml` file:
   - Backend: Root Directory = `/` (empty)
   - Frontend: Root Directory = `frontend`

## See Also

- [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) - Complete step-by-step guide
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Quick checklist
- [.env.production.example](./.env.production.example) - Production environment template
