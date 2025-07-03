FROM node:22-alpine3.20

# Add security updates, Python, and create non-root user
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init python3 py3-pip bash && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    ln -sf /usr/bin/python3 /usr/bin/python && \
    echo "DOCKER_CONTAINER=true" >> /etc/environment

WORKDIR /app

# Install some basic Python packages
RUN python3 -m pip install --upgrade pip && \
    python3 -m pip install --no-cache-dir requests flask

# Create a Python configuration file before changing user
RUN echo '{"python_executable": "/usr/bin/python3", "platform": "linux", "python_version": "Docker Alpine", "shell_required": true, "docker_environment": true}' > /app/python-config.json && \
    chmod 666 /app/python-config.json

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

# Create dist directory if it doesn't exist
RUN mkdir -p /app/dist

# Expose the port the MCP server will run on
EXPOSE 3333

# Create a debug script for startup
RUN echo '#!/bin/sh\necho "Docker environment information:"\nls -la /usr/bin/python*\nwhoami\nid\necho "PATH=$PATH"\nnode docker-python-config.js\nnode server.js\n' > /app/start.sh && \
    chmod +x /app/start.sh

# Start the MCP server with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/start.sh"]
