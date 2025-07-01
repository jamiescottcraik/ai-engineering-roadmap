#!/bin/bash

# Setup Ollama with 1Password configuration
echo "🦙 Setting up Ollama configuration..."

# Function to configure Ollama
setup_ollama() {
    # Check if Ollama is installed
    if ! command -v ollama &> /dev/null; then
        echo "📦 Installing Ollama..."
        curl -fsSL https://ollama.com/install.sh | sh
    fi

    # Load configuration from 1Password
    if [ -f ".env.1password" ] && command -v op &> /dev/null; then
        # Sign in if needed
        if ! op account list &>/dev/null; then
            eval $(op signin)
        fi

        # Create Ollama config from 1Password
        echo "🔐 Loading Ollama configuration from 1Password..."

        # Get Ollama settings
        OLLAMA_HOST=$(op read "op://Personal/Ollama/host" 2>/dev/null || echo "http://localhost:11434")
        OLLAMA_MODELS=$(op read "op://Personal/Ollama/models" 2>/dev/null || echo "llama3.2,codellama")

        # Set environment variables
        export OLLAMA_HOST="$OLLAMA_HOST"

        # Pull default models
        IFS=',' read -ra MODELS <<< "$OLLAMA_MODELS"
        for model in "${MODELS[@]}"; do
            echo "📥 Pulling model: $model"
            ollama pull "$model"
        done
    fi

    # Create Ollama service configuration
    mkdir -p "$HOME/.config/ollama"
    cat > "$HOME/.config/ollama/config.json" << OLLAMACONFIG
{
    "host": "${OLLAMA_HOST:-http://localhost:11434}",
    "models_path": "$HOME/.ollama/models",
    "keep_alive": "5m",
    "num_parallel": 2
}
OLLAMACONFIG

    echo "✅ Ollama configured"

    # Start Ollama service
    if systemctl is-enabled ollama &>/dev/null; then
        sudo systemctl restart ollama
    else
        ollama serve &
    fi

    echo "✅ Ollama service started"
}

# Function to test Ollama
test_ollama() {
    echo "🧪 Testing Ollama..."

    # List models
    echo "📋 Available models:"
    ollama list

    # Test generation
    echo ""
    echo "🤖 Testing generation with llama3.2..."
    ollama run llama3.2 "Say hello in one sentence" --verbose
}

# Main execution
setup_ollama
test_ollama
