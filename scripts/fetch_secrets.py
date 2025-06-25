# scripts/fetch_secrets.py
import os
import subprocess
import sys

# Define the secrets you need for your application.
# The format is: EnvironmentVariableName="op://vault/item/field"
# This keeps your secret references clean and manageable.
SECRETS_TO_FETCH = {
    "POSTGRES_USER": "op://Private/Postgres-DB/username",
    "POSTGRES_PASSWORD": "op://Private/Postgres-DB/password",
    "OPENAI_API_KEY": "op://Private/OpenAI/api-key",
    # Add other secrets your application needs here
}

# The name of the environment file to be created in the `backend` directory.
ENV_FILE_PATH = os.path.join("backend", ".env")


def fetch_secret(op_uri: str) -> str:
    """Uses the 1Password CLI to fetch a secret for a given URI."""
    try:
        # The 'op read' command securely retrieves the secret value.
        result = subprocess.run(
            ["op", "read", op_uri], capture_output=True, text=True, check=True
        )
        # Return the secret value, stripping any trailing newlines.
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ Error fetching secret for URI: {op_uri}", file=sys.stderr)
        print(f"   Error details: {e.stderr.strip()}", file=sys.stderr)
        print(
            "   Please ensure you are logged into the 1Password CLI (`op signin`) and have access to this vault.",
            file=sys.stderr,
        )
        return None
    except FileNotFoundError:
        print("❌ Error: 'op' command not found.", file=sys.stderr)
        print(
            "   Please ensure the 1Password CLI is installed and in your PATH.",
            file=sys.stderr,
        )
        print(
            "   For installation instructions: https://developer.1password.com/docs/cli/get-started/",
            file=sys.stderr,
        )
        return None


def main() -> None:
    """Main function to fetch all defined secrets and write them to a .env file."""
    print("🔑 Fetching secrets for the brAInwav project...")
    
    # Check if 1Password CLI is available
    if not subprocess.run(["command", "-v", "op"], capture_output=True).returncode == 0:
        print("❌ 1Password CLI not found.", file=sys.stderr)
        print("   Creating a template .env file instead...", file=sys.stderr)
        create_env_template()
        return
    
    env_content = []
    failed_secrets = []
    
    for env_var, op_uri in SECRETS_TO_FETCH.items():
        print(f"   - Fetching {env_var}...")
        secret_value = fetch_secret(op_uri)
        if secret_value is not None:
            env_content.append(f'{env_var}="{secret_value}"')
        else:
            failed_secrets.append((env_var, op_uri))

    # If we have any successful secrets, write them to .env
    if env_content:
        try:
            with open(ENV_FILE_PATH, "w") as f:
                f.write("\n".join(env_content))
                f.write("\n")  # Add a final newline for POSIX compliance
            print(f"\n✅ Successfully wrote {len(env_content)} secrets to {ENV_FILE_PATH}")
        except OSError as e:
            print(f"❌ Error writing to .env file at {ENV_FILE_PATH}: {e}", file=sys.stderr)
            sys.exit(1)
    
    # If we had failures, provide guidance
    if failed_secrets:
        print(f"\n⚠️  Failed to fetch {len(failed_secrets)} secrets:", file=sys.stderr)
        for env_var, op_uri in failed_secrets:
            print(f"   - {env_var}: {op_uri}", file=sys.stderr)
        print("\n💡 To resolve this:", file=sys.stderr)
        print("   1. Ensure you're logged into 1Password CLI: op signin", file=sys.stderr)
        print("   2. Verify you have access to the specified vaults", file=sys.stderr)
        print("   3. Or manually set these variables in backend/.env", file=sys.stderr)
        
        if not env_content:
            print("\n   Creating a template .env file with placeholder values...", file=sys.stderr)
            create_env_template()


def create_env_template() -> None:
    """Create a template .env file with placeholder values."""
    template_content = []
    template_content.append("# Environment variables for brAInwav project")
    template_content.append("# Replace placeholder values with actual secrets")
    template_content.append("")
    
    for env_var, op_uri in SECRETS_TO_FETCH.items():
        template_content.append(f"# From: {op_uri}")
        template_content.append(f'{env_var}="REPLACE_WITH_ACTUAL_VALUE"')
        template_content.append("")
    
    try:
        with open(ENV_FILE_PATH, "w") as f:
            f.write("\n".join(template_content))
        print(f"✅ Created template .env file at {ENV_FILE_PATH}")
        print("   Please edit this file and replace placeholder values with actual secrets.")
    except OSError as e:
        print(f"❌ Error writing template .env file at {ENV_FILE_PATH}: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
