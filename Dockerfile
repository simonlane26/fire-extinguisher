FROM node:20-alpine

WORKDIR /app

# Copy package files (build v2 - exclude all .env files)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client with dummy DATABASE_URL (only for this build step)
# Real DATABASE_URL from Railway will be used at runtime
RUN DATABASE_URL="postgresql://user:pass@host:5432/db" npx prisma generate

# Copy source code
COPY . .

# Remove any .env files that might have been copied despite .dockerignore
RUN rm -f .env .env.* || true

# Build the application
RUN npm run build:backend

# Verify build output
RUN ls -la dist/src/ && echo "Build successful - dist/src/main.js exists"

# Expose port
EXPOSE 3000

# Start command - NestJS builds to dist/src/main.js
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
