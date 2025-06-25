# Educational Dockerfile for brAInwav Learning Frontend
# This demonstrates modern Node.js containerization for learning

FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency caching
COPY package*.json ./

# Install dependencies (educational: shows layer caching)
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application (educational: shows build process)
RUN npm run build

# Production stage (educational: demonstrates multi-stage builds)
FROM node:18-alpine AS production

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port for the application
EXPOSE 3000

# Health check for learning about container health
HEALTHCHECK --interval=30s --timeout=10s \
    CMD curl -f http://localhost:3000 || exit 1

# Start the application
CMD ["npm", "start"]
