# Use Node.js 20 base image
FROM node:20-slim

# Install Chrome and dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Create dummy .env for prisma generate during build
RUN echo "DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy" > .env

# Copy prisma schema first
COPY prisma ./prisma

# Install dependencies (skip Puppeteer's Chromium download)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy application code
COPY . .

# Build the backend
RUN npm run build:backend

# Build the frontend
WORKDIR /app/frontend
RUN npm ci
RUN npm run build

# Verify frontend build output
RUN echo "=== Frontend build verification ===" && \
    ls -la dist/ && \
    echo "=== Assets directory ===" && \
    ls -la dist/assets/ || echo "No assets directory found" && \
    echo "=== HTML files ===" && \
    ls -la dist/*.html || echo "No HTML files found"

# Return to app directory
WORKDIR /app

# Clean up dummy .env
RUN rm -f .env

# Set environment variables
ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Expose port
EXPOSE 3000

# Copy and make start script executable
COPY start.sh .
RUN chmod +x start.sh

# Start command: run migrations then start the app
CMD ["./start.sh"]
