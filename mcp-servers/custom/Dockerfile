FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./
COPY package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN npm install -g pnpm && \
    pnpm install

# Copy source code
COPY . .

# Expose the port the MCP server will run on
EXPOSE 3333

# Start the MCP server
CMD ["node", "server.js"]
