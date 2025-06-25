# 1Password CLI Setup Guide

This guide explains how to set up 1Password CLI for secure secrets management in the brAInwav project.

## Quick Setup

The project provides automated setup scripts that will attempt to install 1Password CLI for you:

```bash
# Run the main setup (includes 1Password CLI setup)
bash scripts/setup_dev_env.sh

# Or run just the 1Password CLI setup
bash scripts/setup/onepassword.sh
```

## Manual Installation

If the automated installation fails, follow these manual instructions:

### Linux (Ubuntu/Debian)

1. **Download the package:**
   ```bash
   curl -sSfL https://downloads.1password.com/linux/debian/amd64/stable/1password-cli-amd64-latest.deb -o 1password-cli.deb
   ```

2. **Install the package:**
   ```bash
   sudo dpkg -i 1password-cli.deb
   ```

3. **If you get dependency errors:**
   ```bash
   sudo apt-get update
   sudo apt-get install -f
   ```

### macOS

1. **Using Homebrew (recommended):**
   ```bash
   brew install --cask 1password-cli
   ```

2. **Manual download:**
   - Visit: https://developer.1password.com/docs/cli/get-started/
   - Download the macOS package
   - Follow the installation instructions

### Windows

1. **Using Winget:**
   ```powershell
   winget install AgileBits.1PasswordCLI
   ```

2. **Manual download:**
   - Visit: https://developer.1password.com/docs/cli/get-started/
   - Download the Windows package
   - Follow the installation instructions

## Post-Installation Setup

After installing 1Password CLI:

1. **Sign in to your 1Password account:**
   ```bash
   op signin
   ```

2. **Verify the installation:**
   ```bash
   op --version
   op account list
   ```

3. **Fetch project secrets:**
   ```bash
   python scripts/fetch_secrets.py
   ```

## Working Without 1Password CLI

The development environment is designed to work gracefully without 1Password CLI. If you choose not to use it:

### Option 1: Use the Template .env File

The setup script creates a template `.env` file at `backend/.env`:

```bash
# View the template
cat backend/.env

# Edit with your actual values
nano backend/.env  # or use your preferred editor
```

### Option 2: Copy from Example File

If a `.env.example` file exists:

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your actual values
```

### Required Environment Variables

The application needs these environment variables:

- `POSTGRES_USER` - Database username
- `POSTGRES_PASSWORD` - Database password  
- `OPENAI_API_KEY` - OpenAI API key for AI features

## Troubleshooting

### 1Password CLI Not Found

If you get "op command not found" errors:

1. **Check installation:**
   ```bash
   which op
   op --version
   ```

2. **Check PATH:**
   Make sure `/usr/local/bin` or `/opt/homebrew/bin` is in your PATH

3. **Reinstall:**
   Follow the manual installation steps above

### Authentication Issues

If you get authentication errors:

1. **Sign in again:**
   ```bash
   op signin
   ```

2. **Check account access:**
   ```bash
   op account list
   op vault list
   ```

3. **Verify vault permissions:**
   Make sure you have access to the "Private" vault mentioned in the secret URIs

### Network Issues

If downloads fail due to network restrictions:

1. **Use alternative installation methods:**
   - Package managers (apt, brew, winget)
   - Download from a different network
   - Use manual .env file setup instead

2. **Check firewall/proxy settings:**
   The CLI needs to connect to 1Password servers

## Security Best Practices

1. **Never commit secrets to git:**
   - The `.env` file is already in `.gitignore`
   - Use `git status` to verify before committing

2. **Use 1Password CLI when possible:**
   - More secure than plain text files
   - Centralized secret management
   - Audit trails and access controls

3. **Rotate secrets regularly:**
   - Update in 1Password
   - Re-run `python scripts/fetch_secrets.py`

## Getting Help

If you continue to have issues:

1. **Check the official documentation:**
   https://developer.1password.com/docs/cli/get-started/

2. **Verify system requirements:**
   The CLI requires a supported operating system

3. **Use fallback approach:**
   The development environment will work with manual `.env` file management