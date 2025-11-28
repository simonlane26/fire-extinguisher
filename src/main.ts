import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Debug: Log environment variables (excluding sensitive ones)
  console.log('🔍 Environment check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS || 'NOT SET');
  console.log('SMTP_HOST:', process.env.SMTP_HOST ? `${process.env.SMTP_HOST.substring(0, 10)}...` : 'NOT SET');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
  console.log('S3_REGION:', process.env.S3_REGION || 'NOT SET');
  console.log('S3_BUCKET:', process.env.S3_BUCKET ? `${process.env.S3_BUCKET.substring(0, 10)}...` : 'NOT SET');
  console.log('All env keys:', Object.keys(process.env).filter(k => k.includes('SMTP') || k.includes('S3') || k.includes('VAPID')).join(', '));

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
      '/',                    // root
      '/assets/:path*',       // frontend static assets (wildcard)
      '/uploads/:path*',      // uploaded files (wildcard)
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
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (process.env.NODE_ENV === 'development') {
        // Allow all origins in development
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
  });

  // Global Exception Filter for error handling
  app.useGlobalFilters(new AllExceptionsFilter());

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
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Serve frontend static files in production (after all middleware/guards)
  if (process.env.NODE_ENV === 'production') {
    const frontendPath = join(process.cwd(), 'frontend', 'dist');
    logger.log(`📦 Serving frontend from: ${frontendPath}`);

    // Serve static assets (JS/CSS/images) with proper caching
    app.useStaticAssets(frontendPath, {
      index: false, // Don't auto-serve index.html for root
    });

    // SPA fallback: serve index.html for all non-API routes
    // This must come AFTER useStaticAssets so /assets/* are served first
    app.use((req: any, res: any, next: any) => {
      // Only handle non-API, non-upload, non-asset routes
      if (req.path.startsWith('/api/') ||
          req.path.startsWith('/uploads/') ||
          req.path.startsWith('/assets/')) {
        return next();
      }
      // Prevent caching of index.html to ensure users always get the latest version
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.sendFile(join(frontendPath, 'index.html'));
    });
  }

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

