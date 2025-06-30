#!/bin/sh
# Health check script for Docker container
# Implements Phase 5 Priority 2: Docker health monitoring

# Use wget instead of curl for smaller image size
wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/api/health || exit 1
