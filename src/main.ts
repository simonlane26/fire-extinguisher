import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Fail fast if required secrets are missing
  if (!process.env.JWT_SECRET?.trim()) {
    console.error('❌ JWT_SECRET environment variable is required but not set. Exiting.');
    process.exit(1);
  }

  // Ensure database schema is up to date
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    logger.log('🔧 Checking database schema...');

    // Add missing columns to tables if they don't exist
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "PushSubscription"
      ADD COLUMN IF NOT EXISTS "deviceName" TEXT,
      ADD COLUMN IF NOT EXISTS "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "InspectionPhoto"
      ADD COLUMN IF NOT EXISTS "inspectionId" TEXT,
      ADD COLUMN IF NOT EXISTS "caption" TEXT,
      ADD COLUMN IF NOT EXISTS "uploadedBy" TEXT,
      ADD COLUMN IF NOT EXISTS "findings" JSONB;
    `);

    logger.log('✅ Database schema check complete');
    await prisma.$disconnect();
  } catch (error) {
    logger.warn('⚠️  Database schema check failed:', error.message);
  }

  // Log environment status (values only indicate SET/NOT SET, never log actual secrets)
  logger.log(`🔍 Environment: NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  logger.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);
  logger.log(`JWT_SECRET: SET`); // already checked above
  logger.log(`SMTP_HOST: ${process.env.SMTP_HOST ? 'SET' : 'NOT SET'}`);
  logger.log(`S3_BUCKET: ${process.env.S3_BUCKET ? 'SET' : 'NOT SET'}`);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Stripe webhook needs raw body for signature verification
  // We use a custom middleware to capture raw body before JSON parsing
  app.use('/api/v1/billing/webhook', bodyParser.raw({ type: 'application/json' }));

  // JSON body parser for all other routes
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // API Versioning - all routes prefixed with /api/v1
  // Exclude static asset paths from the prefix
  app.setGlobalPrefix('api/v1', {
    exclude: [
      '/',                           // root
      '/assets/*path',               // frontend static assets (wildcard: *before param name)
      '/uploads/*path',              // uploaded files (wildcard: *before param name)
      '/privacy-policy.html',        // policy pages
      '/terms-of-service.html',
      '/cookie-policy.html',
      '/documentation.html',         // documentation
    ],
  });

  // Serve static files from uploads directory
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // CORS Configuration
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',
    'https://www.firexcheck.com',  // Production frontend
    'https://fire-extinguisher-production.up.railway.app', // Railway backend URL (for testing)
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
  });

  // Security headers
  app.use(helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc:    ["'self'"],
        scriptSrc:     ["'self'", 'https://js.stripe.com'],
        styleSrc:      ["'self'", "'unsafe-inline'"],   // Tailwind inline styles
        imgSrc:        ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc:    ["'self'", 'https://api.stripe.com', 'https://js.stripe.com'],
        frameSrc:      ['https://js.stripe.com', 'https://hooks.stripe.com'],
        objectSrc:     ["'none'"],
        baseUri:       ["'self'"],
        formAction:    ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    // HTTP Strict Transport Security — 1 year, include subdomains
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // Permissions-Policy header (not yet in helmet's type definitions)
  app.use((_req: any, res: any, next: any) => {
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), usb=(), magnetometer=(), gyroscope=(), fullscreen=(self), payment=(https://js.stripe.com)',
    );
    next();
  });

  // Global Exception Filter for error handling
  app.useGlobalFilters(new AllExceptionsFilter());

  // Serve frontend static files in production (AFTER guards for proper routing)
  // Policy HTML files are served by PublicController with @Public() decorator
  if (process.env.NODE_ENV === 'production') {
    const frontendPath = join(process.cwd(), 'frontend', 'dist');
    logger.log(`📦 Serving frontend from: ${frontendPath}`);

    // Serve static assets (JS/CSS/images) with proper caching
    app.useStaticAssets(frontendPath, {
      index: false, // Don't auto-serve index.html for root
      etag: false, // Disable ETags to prevent caching issues
      setHeaders: (res, filePath) => {
        const isHTML = filePath.endsWith('.html');

        // Matches hashed files: index-ABCDEFG123.css, vendor-9a8b7c6d.js, etc.
        // This catches files at ANY path with hash pattern, not just /assets/
        const isHashedAsset = /-[a-zA-Z0-9]{8,}\.(css|js|mjs|woff2?|png|jpg|jpeg|svg|webp|gif)$/.test(filePath);

        if (isHTML) {
          res.setHeader('Cache-Control', 'no-store, max-age=0');
          res.setHeader('Pragma', 'no-cache');
          res.removeHeader('ETag');
          return;
        }

        if (isHashedAsset) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          return;
        }

        // Non-hashed assets (manifest.json, robots.txt, etc.) - avoid sticky caching
        res.setHeader('Cache-Control', 'no-cache');
      },
    });

    // SPA fallback: serve index.html for all non-API, non-static routes
    app.use((req: any, res: any, next: any) => {
      // Skip API routes, uploads, and static assets
      if (req.path.startsWith('/api/') ||
          req.path.startsWith('/uploads/') ||
          req.path.startsWith('/assets/')) {
        return next();
      }

      // Skip HTML policy files (handled by PublicController)
      if (req.path.endsWith('.html') && req.path !== '/index.html' && req.path !== '/') {
        return next();
      }

      // For all other routes (SPA fallback): serve index.html with no-store
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.removeHeader('ETag');
      return res.sendFile(join(frontendPath, 'index.html'));
    });
  }

  // Global Validation Pipe with detailed error messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global JWT Authentication (routes must use @Public() to opt-out)
  // Static files are already served above, so this only affects API routes
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
  const HOST = process.env.HOST || '0.0.0.0';

  await app.listen(PORT, HOST);

  logger.log(`🚀 Application is running on: http://${HOST}:${PORT}/api/v1`);
  logger.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🔒 Authentication: Enabled (JWT)`);
  logger.log(`🛡️  CORS: Configured for ${allowedOrigins.join(', ')}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});

