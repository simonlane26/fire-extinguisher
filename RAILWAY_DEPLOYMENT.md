# Railway.app Deployment Guide

This guide explains how to deploy your Fire Extinguisher Management System to Railway.app with separate frontend and backend services.

## Architecture

- **Backend Service**: NestJS API (Port 3000)
- **Frontend Service**: React + Vite SPA (served via `serve`)
- **Database**: PostgreSQL (Railway add-on)

---

## Prerequisites

1. Railway account (sign up at https://railway.app)
2. GitHub repository connected to Railway
3. Stripe account (for billing features)
4. VAPID keys generated for push notifications

---

## Step 1: Create Railway Project

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway will create a project

---

## Step 2: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a `DATABASE_URL` variable
4. Copy the `DATABASE_URL` for use in backend service

---

## Step 3: Deploy Backend Service

### Create Backend Service

1. Click "+ New" → "GitHub Repo"
2. Select your repository again (for the backend service)
3. Click on the service name to configure it

### Configure Backend Service

1. **Settings** → **Service Name**: `fire-extinguisher-backend`

2. **Settings** → **Root Directory**: Leave empty (uses project root)
   - Railway will detect `railway.toml` in the root directory

3. **Variables** → Add all environment variables:

```env
# Database (from PostgreSQL add-on)
DATABASE_URL=postgresql://...

# Application
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS - Update after frontend is deployed
ALLOWED_ORIGINS=https://your-frontend.railway.app
FRONTEND_URL=https://your-frontend.railway.app

# Email (Resend.com)
RESEND_API_KEY=re_...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# Push Notifications (generate with: npx web-push generate-vapid-keys)
VAPID_PUBLIC_KEY=your_production_vapid_public_key
VAPID_PRIVATE_KEY=your_production_vapid_private_key
VAPID_SUBJECT=mailto:info@firexcheck.com

# Optional: AWS S3 (if using S3 for storage)
# S3_BUCKET_NAME=your-bucket
# S3_REGION=us-east-1
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...

# Optional: AI features
# ANTHROPIC_API_KEY=sk-ant-...
```

4. Click "Deploy" to start the backend service
   - Railway will automatically use the commands from `railway.toml`:
     - Build: `npm install && npx prisma generate`
     - Start: `npm run start:prod`
     - Healthcheck: `/api/v1/health`

5. Once deployed, copy the Railway-provided URL (e.g., `https://fire-extinguisher-backend-production.up.railway.app`)

---

## Step 4: Deploy Frontend Service

### Create Frontend Service

1. Click "+ New" → "GitHub Repo"
2. Select your repository again (for frontend service)
3. Click on the service name to configure it

### Configure Frontend Service

1. **Settings** → **Service Name**: `fire-extinguisher-frontend`

2. **Settings** → **Root Directory**: `frontend`
   - Railway will detect `railway.toml` in the frontend directory

3. **Variables** → Add environment variable:

```env
VITE_API_URL=https://your-backend.railway.app/api/v1
```
(Replace with your actual backend Railway URL)

4. Click "Deploy" to start the frontend service
   - Railway will automatically use the commands from `frontend/railway.toml`:
     - Build: `npm install && npm run build`
     - Start: `npx serve -s dist -p $PORT`

5. Once deployed, copy the Railway-provided URL (e.g., `https://fire-extinguisher-frontend-production.up.railway.app`)

---

## Step 5: Update CORS Settings

1. Go back to your **Backend Service** settings
2. Update the environment variables:
   - `ALLOWED_ORIGINS` → Your frontend Railway URL
   - `FRONTEND_URL` → Your frontend Railway URL

3. Redeploy the backend service

---

## Step 6: Database Migration

Railway automatically runs `npx prisma migrate deploy` during backend deployment via the `start:prod` script.

If you need to manually run migrations:

1. Click on your backend service
2. Click "Settings" → "Deployments"
3. Find the latest deployment
4. Click the three dots → "View Logs"
5. Verify that Prisma migrations ran successfully

---

## Step 7: Custom Domains (Optional)

### Backend Custom Domain
1. Go to Backend Service → Settings → Networking
2. Click "Generate Domain" or "Custom Domain"
3. Add your domain (e.g., `api.firexcheck.com`)
4. Configure DNS records as Railway instructs

### Frontend Custom Domain
1. Go to Frontend Service → Settings → Networking
2. Click "Generate Domain" or "Custom Domain"
3. Add your domain (e.g., `app.firexcheck.com`)
4. Configure DNS records as Railway instructs

### Update Environment Variables After Custom Domains

**Backend:**
```env
ALLOWED_ORIGINS=https://app.firexcheck.com
FRONTEND_URL=https://app.firexcheck.com
```

**Frontend:**
```env
VITE_API_URL=https://api.firexcheck.com/api/v1
```

---

## Step 8: Configure Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "+ Add endpoint"
3. Enter your endpoint URL: `https://your-backend.railway.app/api/v1/billing/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret
6. Add it to your backend environment variables as `STRIPE_WEBHOOK_SECRET`

---

## Step 9: Generate VAPID Keys for Production

Run this command locally to generate production VAPID keys:

```bash
npx web-push generate-vapid-keys
```

Add the keys to your backend environment variables:
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`

**Important**: Use different keys for production than development!

---

## Step 10: Test Your Deployment

1. Visit your frontend URL
2. Test user registration
3. Test login
4. Test creating an extinguisher
5. Test QR code generation
6. Test push notifications (enable in Settings)
7. Test Stripe subscription flow
8. Verify email delivery works

---

## Monitoring & Logs

### View Logs
1. Click on a service
2. Click "Deployments" tab
3. Click on a deployment → "View Logs"

### Metrics
Railway provides built-in metrics:
- CPU usage
- Memory usage
- Network traffic
- Request count

Access metrics by clicking on a service and viewing the "Metrics" tab.

---

## Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secret-key` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://app.firexcheck.com` |
| `FRONTEND_URL` | Frontend URL for emails | `https://app.firexcheck.com` |
| `RESEND_API_KEY` | Resend.com API key | `re_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `VAPID_PUBLIC_KEY` | VAPID public key for push | `BN...` |
| `VAPID_PRIVATE_KEY` | VAPID private key for push | `...` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.firexcheck.com/api/v1` |

---

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set
- Check if PostgreSQL add-on is running
- Verify Prisma schema is up to date

### CORS Errors
- Ensure `ALLOWED_ORIGINS` includes your frontend URL
- Check that URLs match exactly (including https://)
- Verify no trailing slashes

### Build Failures
- Check build logs in Railway
- Verify all dependencies are in package.json
- Ensure Node.js version compatibility

### Push Notifications Not Working
- Verify VAPID keys are set correctly
- Check service worker is registered
- Ensure frontend is served over HTTPS

### Stripe Webhooks Failing
- Verify webhook URL is correct
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Review webhook logs in Stripe dashboard

---

## Scaling

Railway automatically scales based on usage. For manual scaling:

1. Go to service Settings → Resources
2. Adjust CPU and RAM allocations
3. Enable autoscaling if needed

---

## Cost Optimization

- Use Railway's free tier for development
- Monitor usage in the Railway dashboard
- Optimize database queries to reduce load
- Use caching where appropriate
- Consider using Railway's sleep mode for dev environments

---

## Security Checklist

- [ ] All environment variables are set
- [ ] JWT_SECRET is strong and unique
- [ ] Database has strong password
- [ ] CORS is properly configured
- [ ] HTTPS is enabled (Railway provides this by default)
- [ ] Stripe webhook secret is configured
- [ ] Different VAPID keys for production
- [ ] .env files are in .gitignore
- [ ] Sensitive data is not in source code

---

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Your repository issues page

---

## Quick Commands

### View Backend Logs
```bash
railway logs --service fire-extinguisher-backend
```

### View Frontend Logs
```bash
railway logs --service fire-extinguisher-frontend
```

### Redeploy Service
```bash
railway up --service fire-extinguisher-backend
```

### Run Prisma Studio (local)
```bash
DATABASE_URL="your-railway-db-url" npx prisma studio
```

---

## Next Steps

After successful deployment:

1. Set up monitoring and alerting
2. Configure backup strategy for database
3. Set up CI/CD pipeline (GitHub Actions)
4. Add error tracking (Sentry, LogRocket, etc.)
5. Configure CDN for static assets
6. Set up uptime monitoring (UptimeRobot, Pingdom)
