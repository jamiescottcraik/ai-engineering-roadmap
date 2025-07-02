FROM node:22-alpine3.20

# Add security updates and create non-root user
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Copy package files first for better caching
COPY --chown=nextjs:nodejs package.json ./
COPY --chown=nextjs:nodejs package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN npm install -g pnpm && \
    pnpm install

# Copy source code
COPY --chown=nextjs:nodejs . .

# Expose the port the MCP server will run on
EXPOSE 3333

# Start the MCP server with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
