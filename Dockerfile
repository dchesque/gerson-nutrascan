# ============================================
# NUTRASCAN AI - PRODUCTION DOCKERFILE
# ============================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for Vite (needed at build time)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Convert ARGs to ENVs so Vite can access them during build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application with environment variables
# 1. Build frontend (Vite) -> dist/public
# 2. Build backend (esbuild) -> dist/index.js
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy attached_assets (images used by frontend)
COPY --from=builder /app/attached_assets ./attached_assets

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
