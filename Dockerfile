FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client with dummy DATABASE_URL
# Prisma generate only needs the env var to exist, doesn't validate connection
ENV DATABASE_URL="postgresql://user:pass@host:5432/db"
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build:backend

# Verify build output
RUN ls -la dist/ && echo "Build successful - dist/main.js exists"

# Expose port
EXPOSE 3000

# Start command will be provided by Railway
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
