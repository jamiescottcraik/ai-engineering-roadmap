# backend/Dockerfile
# Defines the container image for the brAInwav Python backend service.

# --- Build Stage: Install build-time dependencies, 1Password CLI, uv, and Python dependencies ---
FROM python:3.11-slim-bookworm AS builder

# Set environment variables for non-interactive apt-get operations
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Install system dependencies required for building Python packages, curl, and certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    build-essential \
    gpg \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install 1Password CLI (using official script for robustness and correct pathing)
RUN curl -sSFO https://downloads.1password.com/cli/install.sh \
    && sh install.sh -f --no-sudo \
    && rm install.sh

# Install op-ssh-sign
RUN curl -L -o /usr/local/bin/op-ssh-sign https://github.com/1Password/op-ssh-sign/releases/latest/download/op-ssh-sign_linux_amd64 \
    && chmod +x /usr/local/bin/op-ssh-sign

# Install uv, the fast Python package installer
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.cargo/bin:/root/.local/bin:$PATH"

WORKDIR /app

# Copy only the production requirements file for the API application
COPY apps/api/pyproject.toml /app/
COPY apps/api/uv.lock /app/

# Install only production dependencies using uv
RUN uv pip install --system --no-cache-dir

# --- Runtime Stage: Lean image for running the API application ---
FROM python:3.11-slim-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Security: Remove build tools and unnecessary packages, minimize attack surface
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    tini \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Add a non-root user for runtime security
RUN useradd --create-home --shell /bin/bash --uid 1001 --user-group appuser

WORKDIR /app

# Copy only what is needed from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin/op /usr/local/bin/op
COPY --from=builder /usr/local/bin/op-ssh-sign /usr/local/bin/op-ssh-sign
COPY --from=builder /root/.cargo/bin/uv /usr/local/bin/uv

COPY apps/api/src /app/src

RUN mkdir -p /app/scripts
COPY apps/api/scripts/fetch_secrets.py /app/scripts/fetch_secrets.py

# Set strict permissions on sensitive files and directories
RUN chmod 700 /app/scripts && chmod 600 /app/scripts/fetch_secrets.py \
    && mkdir -p /home/appuser/.cache /app/logs \
    && chown -R appuser:appuser /home/appuser/.cache /app /app/logs

USER appuser

# Use tini as the init system for proper signal handling and zombie reaping
ENTRYPOINT ["/usr/bin/tini", "--"]

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
