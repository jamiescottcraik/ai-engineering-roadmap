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
            "   Please ensure you are logged into the 1Password CLI "
            "(`op signin`) and have access to this vault.",
            file=sys.stderr,
        )
        sys.exit(1)
    except FileNotFoundError:
        print("❌ Error: 'op' command not found.", file=sys.stderr)
        print(
            "   Please ensure the 1Password CLI is installed and in your PATH.",
            file=sys.stderr,
        )
        sys.exit(1)


def main() -> None:
    """Main function to fetch all defined secrets and write them to a .env file."""
    print("🔑 Fetching secrets for the brAInwav project...")
    env_content = []
    for env_var, op_uri in SECRETS_TO_FETCH.items():
        print(f"   - Fetching {env_var}...")
        secret_value = fetch_secret(op_uri)
        env_content.append(f'{env_var}="{secret_value}"')

    # Write the fetched secrets to the .env file.
    # This file is gitignored and will be used by your application at runtime.
    try:
        with open(ENV_FILE_PATH, "w") as f:
            f.write("\n".join(env_content))
            f.write("\n")  # Add a final newline for POSIX compliance
        print(f"\n✅ Successfully wrote {len(env_content)} secrets to {ENV_FILE_PATH}")
    except OSError as e:
        print(f"❌ Error writing to .env file at {ENV_FILE_PATH}: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
