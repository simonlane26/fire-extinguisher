# Security Guide - Fireexcheck.com

## Overview
This document outlines security best practices and requirements for the Fire Extinguisher Management System.

---

## Critical Security Fixes Applied

### ✅ Completed (Development Environment)
- [x] Strong JWT secret generated (128 characters)
- [x] `.env` file excluded from git
- [x] `.env.example` template created without secrets
- [x] SMTP configuration corrected (`SMTP_SECURE=true` for port 465)
- [x] Deprecated AWS S3 credentials removed
- [x] Typo fixed: `STRIPE_PUBLISHABLE-KEY` → `STRIPE_PUBLISHABLE_KEY`

---

## Before Production Deployment

### 🔴 CRITICAL - Must Do

1. **Replace Test Stripe Keys with Live Keys**
   ```bash
   # Current (TEST mode):
   STRIPE_SECRET_KEY=sk_test_51SEZojGwSAqTgcz4...
   STRIPE_PUBLISHABLE_KEY=pk_test_51SEZojGwSAqTgcz49...

   # Required for PRODUCTION:
   STRIPE_SECRET_KEY=sk_live_your_live_key_here
   STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here
   ```

   Get live keys from: https://dashboard.stripe.com/apikeys

2. **Generate NEW Production JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   NEVER use the same JWT secret in production as development!

3. **Update Production Environment Variables**
   - Copy [.env.production.example](.env.production.example) to `.env.production`
   - Fill in ALL production values
   - Set `NODE_ENV=production`
   - Update `ALLOWED_ORIGINS` with your production domains
   - Set `FRONTEND_URL` to your production frontend URL

4. **Enable HTTPS**
   - Ensure SSL/TLS certificates are configured
   - Redirect all HTTP traffic to HTTPS
   - Set secure cookie flags

5. **Test Email Delivery**
   ```bash
   # Verify SMTP settings work
   telnet mail.privateemail.com 465
   ```

---

## Environment Variable Security

### Development (.env)
Your current development environment is now secure:
- ✅ Strong JWT secret in place
- ✅ SMTP correctly configured
- ✅ Test Stripe keys (safe for development)
- ✅ File not committed to git

### Production (.env.production)
**Requirements:**
- Different JWT secret from development
- Live Stripe keys (sk_live_*, pk_live_*)
- Production database URL
- Production-ready email credentials
- HTTPS-only domains in ALLOWED_ORIGINS

---

## Database Security

### Current Setup (Neon PostgreSQL)
- ✅ SSL required (`sslmode=require`)
- ✅ Connection string stored in environment variable
- ⚠️ Currently using development database

### Production Requirements
1. Create separate production database
2. Enable automatic backups
3. Restrict IP access to application server only
4. Use connection pooling (Neon does this automatically)
5. Never log the DATABASE_URL

---

## API Security

### Authentication
- JWT-based authentication implemented
- Token expiration configured
- Password hashing with bcrypt

### Rate Limiting
Currently implemented via `@nestjs/throttler`:
- Default: 10 requests per minute per IP
- Adjust in production based on traffic

### CORS
Current development: `http://localhost:5173`
Production: Update to your domains only

---

## File Upload Security

### Current Implementation
- Files saved to local `/uploads` directory
- Directory excluded from git (✅ in .gitignore)
- Static file serving enabled

### Production Recommendations
1. **Add file size limits** (currently unlimited):
   ```typescript
   // In main.ts or file upload module
   app.use(express.json({ limit: '10mb' }));
   app.use(express.urlencoded({ limit: '10mb', extended: true }));
   ```

2. **Validate file types**:
   - Only allow: PDF, PNG, JPG, JPEG for photos
   - Reject executable files

3. **Consider cloud storage** for production:
   - AWS S3 (infrastructure already in place, just commented out)
   - Cloudinary
   - DigitalOcean Spaces

---

## Password Security

### Current Implementation
- ✅ Bcrypt hashing (salt rounds: 10)
- ✅ Passwords never logged or exposed
- ✅ Password reset with time-limited tokens

### Best Practices
- Minimum password length enforced
- Password reset tokens expire after 1 hour
- Tokens invalidated after use

---

## Email Security

### Current Configuration
- ✅ Secure connection (SSL/TLS on port 465)
- ✅ Authenticated SMTP
- ✅ Email from: info@firexcheck.com

### Production Checklist
- [ ] Test email delivery to common providers (Gmail, Outlook, etc.)
- [ ] Configure SPF records for your domain
- [ ] Set up DKIM signing
- [ ] Add DMARC policy
- [ ] Monitor bounce rates

---

## Secrets Management

### Development
- Secrets in `.env` file (not committed to git)
- `.env.example` template for team members

### Production Options

**Option 1: Environment Variables (Simplest)**
- Set variables in hosting platform dashboard
- Railway, Heroku, Vercel all support this

**Option 2: Secret Management Service**
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault

---

## Monitoring & Logging

### Recommended Setup

1. **Error Tracking**
   - Sentry.io (free tier available)
   - Captures exceptions and stack traces
   - Never logs sensitive data

2. **Access Logs**
   - Log all authentication attempts
   - Track failed login attempts
   - Alert on suspicious activity

3. **Audit Trail**
   - Log important actions (data exports, user deletions)
   - Store in separate audit database table

---

## Compliance Considerations

### GDPR (if serving EU customers)
- [ ] Implement data export functionality ✅ (CSV export exists)
- [ ] Add data deletion/anonymization
- [ ] Cookie consent banner
- [ ] Privacy policy
- [ ] Terms of service

### PCI DSS (Payment Card Industry)
- ✅ Using Stripe (PCI compliant payment processor)
- ✅ No card data stored in your database
- ✅ HTTPS required

---

## Incident Response Plan

### If Credentials Are Compromised

**Immediate Actions:**
1. Rotate compromised credentials immediately
2. Revoke all active JWT tokens (requires deployment)
3. Force password reset for all users
4. Review access logs for suspicious activity

**Database Credentials:**
```bash
# Create new database or rotate password in Neon dashboard
# Update DATABASE_URL in production environment
# Restart application
```

**JWT Secret:**
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Update JWT_SECRET in production
# Restart application (invalidates all existing sessions)
```

**Stripe Keys:**
1. Go to Stripe Dashboard → API Keys
2. Delete compromised keys
3. Generate new keys
4. Update environment variables
5. Restart application

---

## Security Checklist

### Before Every Deployment

- [ ] No secrets in git history (`git log --all --full-history -- .env`)
- [ ] All environment variables use correct values
- [ ] JWT secret is strong (64+ chars) and unique
- [ ] Database backups are configured
- [ ] HTTPS is enabled and enforced
- [ ] CORS is restricted to known domains
- [ ] Error messages don't expose sensitive info
- [ ] Dependencies are up to date (`npm audit`)
- [ ] Rate limiting is enabled
- [ ] File upload limits are set

### Monthly Security Tasks

- [ ] Review npm audit results
- [ ] Update dependencies
- [ ] Review access logs for anomalies
- [ ] Test backup restoration
- [ ] Verify SSL certificate expiration date
- [ ] Review and rotate API keys

---

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: security@firexcheck.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security Best Practices](https://docs.nestjs.com/security/helmet)
- [Stripe Security Best Practices](https://stripe.com/docs/security)
- [Neon Security](https://neon.tech/docs/security/security-overview)

---

**Last Updated:** 2025-11-14
**Next Review:** 2026-01-14
