# backend/Dockerfile
# Defines the container image for the brAInwav Python backend service.

FROM python:3.11.9-slim-bookworm

WORKDIR /workspace

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# --- UPDATED SECTION ---
# Install system dependencies and the 1Password CLI in a single, efficient layer.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    gpg \
    # Download and install the 1Password CLI directly for version consistency
    && curl -sSO https://downloads.1password.com/linux/debian/amd64/stable/1password-cli-amd64-latest.deb \
    && dpkg -i 1password-cli-amd64-latest.deb \
    # Clean up to keep the image size small
    && rm 1password-cli-amd64-latest.deb \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*
# --- END UPDATED SECTION ---

# Install op-ssh-sign for SSH commit signing (latest Linux x86_64 binary from 1Password GitHub releases)
RUN curl -L -o /usr/local/bin/op-ssh-sign https://github.com/1Password/op-ssh-sign/releases/latest/download/op-ssh-sign_linux_amd64 && \
    chmod +x /usr/local/bin/op-ssh-sign

# Install uv, the fast Python package installer
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

# Copy only the requirements files first to leverage Docker's layer caching.
COPY ./requirements.txt /workspace/
COPY ./dev-requirements.txt /workspace/

# Install all Python dependencies using uv.
RUN uv pip install --system --no-cache-dir -r requirements.txt -r dev-requirements.txt

# Copy the rest of your application's source code into the container.
COPY . .
