# Deployment Guide - Fireexcheck.com
## Fire Extinguisher Management System

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Security Requirements](#security-requirements)
4. [Database Setup](#database-setup)
5. [Deployment Options](#deployment-options)
6. [Post-Deployment Steps](#post-deployment-steps)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Critical Security Items
- [ ] `.env` file is NOT committed to git (check with `git log --all --full-history -- .env`)
- [ ] Strong JWT secret generated (64+ characters)
- [ ] Production Stripe keys configured (sk_live_*, pk_live_*)
- [ ] Production database created and accessible
- [ ] Email SMTP credentials tested
- [ ] All exposed AWS keys removed or rotated
- [ ] CORS origins configured for production domains
- [ ] SSL/TLS certificates ready for HTTPS

### Application Requirements
- [ ] Node.js 18+ installed on server
- [ ] PostgreSQL database provisioned
- [ ] Domain DNS configured (firexcheck.com)
- [ ] Puppeteer dependencies installed (for PDF generation)
- [ ] File upload directory writable (`/uploads`)

---

## Environment Configuration

### 1. Generate Production Secrets

```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Configure Production Environment

Copy the production template:
```bash
cp .env.production.example .env.production
```

Then edit `.env.production` with your actual production values:

**Required Variables:**
- `DATABASE_URL` - PostgreSQL connection string from Neon/Railway
- `JWT_SECRET` - Generated secret (MUST be different from development)
- `STRIPE_SECRET_KEY` - Live Stripe key (sk_live_*)
- `STRIPE_PUBLISHABLE_KEY` - Live publishable key (pk_live_*)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret for production
- `SMTP_PASS` - Email password
- `ALLOWED_ORIGINS` - Your production domains (https://firexcheck.com, etc.)
- `FRONTEND_URL` - Your production frontend URL

---

## Security Requirements

### 1. Rotate Compromised Credentials

**IMPORTANT:** If you've ever committed `.env` to git, these credentials are compromised:
- Database password - Create new database or rotate password
- JWT secret - Generate new one
- Stripe keys - Rotate in Stripe dashboard
- Email password - Change password

### 2. Enable HTTPS Only

Ensure your deployment platform uses HTTPS. Never serve production over HTTP.

### 3. Set Strong Firewall Rules

- Only allow ports 80 (HTTP redirect) and 443 (HTTPS)
- Restrict database access to application server IP only
- Enable rate limiting for API endpoints

### 4. Environment Variables

**NEVER:**
- Commit `.env` files to version control
- Share `.env` files via email/Slack
- Use test keys in production
- Expose secrets in client-side code

---

## Database Setup

### Using Neon (Recommended)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project: "fireexcheck-production"
3. Copy the connection string
4. Run migrations:

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Push schema to production database
npm run prisma:push

# Or use migrations (recommended for production)
npx prisma migrate deploy --schema=generated/prisma/schema.prisma
```

---

## Deployment Options

### Option 1: Railway (Recommended for beginners)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Create new project:**
   ```bash
   railway init
   ```

3. **Set environment variables:**
   ```bash
   railway variables set DATABASE_URL="your-production-db-url"
   railway variables set JWT_SECRET="your-jwt-secret"
   # ... set all other variables from .env.production
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

### Option 2: Heroku

1. **Create Heroku app:**
   ```bash
   heroku create fireexcheck
   ```

2. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET="your-secret"
   heroku config:set STRIPE_SECRET_KEY="sk_live_..."
   # ... set all other variables
   ```

4. **Add buildpacks for Puppeteer:**
   ```bash
   heroku buildpacks:add jontewks/puppeteer
   heroku buildpacks:add heroku/nodejs
   ```

5. **Deploy:**
   ```bash
   git push heroku master
   ```

### Option 3: VPS (DigitalOcean, AWS EC2, etc.)

1. **Install Node.js and dependencies:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install -y build-essential
   ```

2. **Install Puppeteer dependencies:**
   ```bash
   sudo apt-get install -y \
     chromium-browser \
     fonts-liberation \
     libnss3 \
     libxss1 \
     libappindicator3-1 \
     libatk-bridge2.0-0 \
     libgtk-3-0
   ```

3. **Clone repository:**
   ```bash
   git clone https://github.com/yourusername/fire-extinguisher.git
   cd fire-extinguisher
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Build application:**
   ```bash
   npm run build:backend
   cd frontend && npm run build
   ```

6. **Setup PM2 process manager:**
   ```bash
   npm install -g pm2
   pm2 start dist/main.js --name fireexcheck
   pm2 startup
   pm2 save
   ```

7. **Setup Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name firexcheck.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Post-Deployment Steps

### 1. Verify Deployment

- [ ] Visit your production URL
- [ ] Test user signup/login
- [ ] Test email verification
- [ ] Test report generation
- [ ] Test QR code generation
- [ ] Test CSV import/export
- [ ] Test Stripe subscription flow (using test mode first!)

### 2. Configure Stripe Webhooks

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://firexcheck.com/api/v1/billing/webhook`
3. Select events: `customer.subscription.*`, `invoice.*`, `checkout.session.completed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET` environment variable
5. Restart application

### 3. Set Up Monitoring

**Recommended tools:**
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [UptimeRobot](https://uptimerobot.com) - Uptime monitoring

### 4. Configure Backups

**Database backups:**
- Neon: Automatic backups included (point-in-time recovery up to 7 days on free tier, 30 days on paid)
- Heroku: Enable continuous backup add-on (`heroku addons:create heroku-postgresql:continuous-protection`)
- VPS: Set up automated daily backups with retention policy

**VPS Backup Script:**
```bash
# Create backup script at /opt/scripts/backup-db.sh
#!/bin/bash
BACKUP_DIR="/opt/backups/fireexcheck"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform backup
pg_dump $DATABASE_URL | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Delete backups older than retention period
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Log the backup
echo "$(date): Backup completed - backup_$DATE.sql.gz" >> $BACKUP_DIR/backup.log
```

**Setup Cron Job:**
```bash
# Make script executable
chmod +x /opt/scripts/backup-db.sh

# Add to crontab (runs daily at 2 AM)
0 2 * * * /opt/scripts/backup-db.sh
```

**File Backups:**
- Uploads directory (`/uploads`) should also be backed up
- Use rsync to backup to S3/B2/DigitalOcean Spaces
- Example: `rsync -avz /path/to/uploads s3://your-bucket/backups/`

**Backup Verification:**
```bash
# Test restore process monthly
gunzip -c /opt/backups/fireexcheck/backup_latest.sql.gz | psql $TEST_DATABASE_URL
```

**Recommended Backup Storage:**
- AWS S3 with lifecycle rules (move to Glacier after 90 days)
- Backblaze B2 (cost-effective)
- DigitalOcean Spaces
- Keep at least 30 days of daily backups
- Keep 12 months of monthly backups

---

## Troubleshooting

### PDF Generation Fails

**Error:** "Failed to launch browser"

**Solution:** Install Puppeteer dependencies
```bash
sudo apt-get install -y chromium-browser libxss1 libappindicator3-1
```

### Email Not Sending

**Error:** "Connection timeout" or "Authentication failed"

**Solution:**
1. Verify SMTP credentials
2. Check SMTP port (465 for SSL, 587 for TLS)
3. Ensure `SMTP_SECURE=true` for port 465
4. Test with: `telnet mail.privateemail.com 465`

### Database Connection Fails

**Error:** "Connection refused" or "SSL required"

**Solution:**
1. Verify `DATABASE_URL` is correct
2. Ensure `?sslmode=require` is in connection string
3. Check database firewall allows your server IP
4. Test connection: `psql $DATABASE_URL`

### CORS Errors

**Error:** "Access-Control-Allow-Origin" errors

**Solution:**
1. Add your domain to `ALLOWED_ORIGINS` in `.env`
2. Restart application
3. Clear browser cache

---

## Security Checklist (Final)

Before going live:

- [ ] All environment variables use production values
- [ ] HTTPS is enforced (no HTTP traffic)
- [ ] Stripe is in live mode (not test mode)
- [ ] Database backups are automated
- [ ] Error monitoring is configured
- [ ] Rate limiting is enabled
- [ ] CORS is restricted to your domains only
- [ ] JWT secret is strong and unique
- [ ] All test data is removed from database
- [ ] `.env` files are in `.gitignore`

---

## Support

For issues or questions:
- GitHub Issues: [your-repo-url]
- Email: support@firexcheck.com

---

**Last Updated:** 2025-11-14
