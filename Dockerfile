# Multi-stage build for FalAI Frontend (Next.js)
# Production-ready without standalone (simpler and more reliable)

# Stage 1: Dependencies
FROM node:18-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Stage 2: Builder - Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# Build Next.js application
RUN npm run build

# Stage 3: Runner - Production image  
FROM node:18-alpine AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy built Next.js application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

# Start the application
CMD ["npm", "start"]
