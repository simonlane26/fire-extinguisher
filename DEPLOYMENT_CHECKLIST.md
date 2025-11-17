# Railway Deployment Checklist

Quick checklist for deploying to Railway.app

## Pre-Deployment

- [ ] Generate production VAPID keys: `npx web-push generate-vapid-keys`
- [ ] Have Stripe keys ready (Secret Key, Webhook Secret, Price IDs)
- [ ] Have Resend API key ready
- [ ] Push all code to GitHub
- [ ] Test application locally

## Railway Setup

### 1. Create Project & Database
- [ ] Create new Railway project
- [ ] Add PostgreSQL database
- [ ] Copy DATABASE_URL

### 2. Backend Service
- [ ] Create backend service from GitHub repo
- [ ] Set service name: `fire-extinguisher-backend`
- [ ] Set root directory: Leave empty (or `/`)
- [ ] Add all environment variables (see list below)
- [ ] Deploy backend (Railway auto-detects `railway.toml`)
- [ ] Copy backend URL

### 3. Frontend Service
- [ ] Create frontend service from GitHub repo
- [ ] Set service name: `fire-extinguisher-frontend`
- [ ] Set root directory: `frontend`
- [ ] Add environment variable: `VITE_API_URL=https://[backend-url]/api/v1`
- [ ] Deploy frontend (Railway auto-detects `frontend/railway.toml`)
- [ ] Copy frontend URL

### 4. Update Backend CORS
- [ ] Update `ALLOWED_ORIGINS` with frontend URL
- [ ] Update `FRONTEND_URL` with frontend URL
- [ ] Redeploy backend

## Backend Environment Variables

```
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
JWT_SECRET=your-super-secret-jwt-key
ALLOWED_ORIGINS=https://your-frontend.railway.app
FRONTEND_URL=https://your-frontend.railway.app
RESEND_API_KEY=re_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
VAPID_PUBLIC_KEY=your_production_vapid_public_key
VAPID_PRIVATE_KEY=your_production_vapid_private_key
VAPID_SUBJECT=mailto:info@firexcheck.com
```

## Frontend Environment Variables

```
VITE_API_URL=https://your-backend.railway.app/api/v1
```

## Post-Deployment

- [ ] Configure Stripe webhook endpoint: `https://[backend-url]/api/v1/billing/webhook`
- [ ] Test user registration
- [ ] Test login
- [ ] Test extinguisher CRUD operations
- [ ] Test QR code generation
- [ ] Test push notifications
- [ ] Test Stripe subscription flow
- [ ] Verify emails are being sent

## Optional

- [ ] Configure custom domains
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Set up CI/CD pipeline

## URLs to Save

- Backend URL: ___________________________________
- Frontend URL: ___________________________________
- Database URL: ___________________________________
- Custom Backend Domain: ___________________________________
- Custom Frontend Domain: ___________________________________

## Notes

_______________________________________________________
_______________________________________________________
_______________________________________________________
