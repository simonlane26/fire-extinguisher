FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client with dummy DATABASE_URL
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build:backend

# Expose port
EXPOSE 3000

# Start command will be provided by Railway
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
