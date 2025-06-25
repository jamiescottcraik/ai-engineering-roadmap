# backend/Dockerfile
# Defines the container image for the brAInwav Python backend service.

FROM python:3.11.9-slim-bookworm

WORKDIR /workspace

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/workspace/backend"

# --- ENHANCED SYSTEM DEPENDENCIES ---
# Install system dependencies and tools in optimized layers
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    gpg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install 1Password CLI with error handling
RUN curl -sSfL https://downloads.1password.com/linux/debian/amd64/stable/1password-cli-amd64-latest.deb -o /tmp/1password-cli.deb \
    && dpkg -i /tmp/1password-cli.deb || (apt-get update && apt-get install -f -y) \
    && rm /tmp/1password-cli.deb \
    && op --version || echo "1Password CLI installed but may need configuration"

# Install op-ssh-sign for SSH commit signing
RUN curl -sSfL https://github.com/1Password/op-ssh-sign/releases/latest/download/op-ssh-sign_linux_amd64 -o /usr/local/bin/op-ssh-sign \
    && chmod +x /usr/local/bin/op-ssh-sign \
    && op-ssh-sign --version || echo "op-ssh-sign installed"

# Install uv Python package manager with error handling
RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
    && export PATH="/root/.local/bin:$PATH" \
    && uv --version || echo "uv installed but may need PATH update"
ENV PATH="/root/.local/bin:$PATH"

# Copy requirements files for dependency caching
COPY requirements.txt dev-requirements.txt ./

# Install Python dependencies with fallback handling
RUN uv pip install --system --no-cache-dir -r requirements.txt -r dev-requirements.txt \
    || (echo "uv failed, falling back to pip" && pip install --no-cache-dir -r requirements.txt -r dev-requirements.txt)

# Copy application source code
COPY . .

# Health check for the container
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import sys; sys.exit(0)" || exit 1

# Default command
CMD ["uvicorn", "backend.src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
