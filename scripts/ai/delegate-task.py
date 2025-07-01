#!/usr/bin/env python3
"""
scripts/ai/delegate-task.py

A robust task execution engine for AI agents within the brAInwav MAS Platform.
This script is responsible for:
1. Loading agent-specific configurations.
2. Authenticating with AI providers (via 1Password for secrets).
3. Delegating a specific task to the relevant AI model via the AIProviderManager.
4. Prompting the AI model to self-assess its confidence in its output.
5. Generating a detailed, confidence-aware log entry conforming to the
   Advanced Confidence Log Guide (docs/advanced_confidence_log.md).
"""

import argparse
import asyncio
import json
import subprocess
import sys
import uuid
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, Dict

# Import the AI provider manager to get AI service instances
from apps.api.src.core.integrations.providers.ai_provider_manager import (
    AIProviderError,
    BaseAIProvider,
    InvalidProviderError,
    ai_provider_manager,
)

# --- Configuration ---
# Assumes the script is in /scripts/ai/, so resolves to the project root.
PROJECT_ROOT = Path(__file__).parent.parent.parent
AI_CONFIG_DIR = PROJECT_ROOT / ".ai" / "config"
AI_LOGS_DIR = PROJECT_ROOT / ".ai" / "logs"  # Directory for logs and generated artifacts

# Ensure the logs directory exists
AI_LOGS_DIR.mkdir(parents=True, exist_ok=True)


# --- Helper Functions ---
def log_error(message: str, exit_code: int = 1):
    """Prints a structured error message to stderr and exits."""
    print(
        json.dumps(
            {
                "status": "error",
                "message": message,
                "timestamp": datetime.now(UTC).isoformat(),
            }
        ),
        file=sys.stderr,
    )
    sys.exit(exit_code)


def log(message: str):
    """Prints a log message to stdout for visibility in CI."""
    print(f"   [Delegate Task] {message}")


def run_command(command: list[str]) -> str:
    """Executes a command and returns its stdout, handling errors."""
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True,  # Exit with non-zero on error
            encoding="utf-8",
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        log_error(f"Command failed: {e}\nStderr: {e.stderr}")
    except FileNotFoundError:
        log_error(f"Command not found: {command[0]}. Is it installed and in the PATH?")
    return ""  # Should be unreachable due to sys.exit(1)


# --- Core Logic ---
def load_agent_config(agent_name: str) -> Dict[str, Any]:
    """
    Loads and returns the configuration for a specific agent.
    Expected config structure: { "provider_type": "openai", "model_name": "gpt-4o", ... }
    """
    config_path = AI_CONFIG_DIR / f"{agent_name}.json"
    if not config_path.exists():
        log_error(f"Config for agent '{agent_name}' not found at {config_path}.")

    try:
        with open(config_path, encoding="utf-8") as f:
            config = json.load(f)
            # Basic validation for required fields for delegation
            if "provider_type" not in config or "model_name" not in config:
                log_error(
                    f"Agent config '{agent_name}.json' missing 'provider_type' or 'model_name'."
                )
            return config
    except json.JSONDecodeError:
        log_error(f"Invalid JSON in agent config file: {config_path}.")
    except Exception as e:
        log_error(f"Error loading agent config {config_path}: {e}")
    return {}  # Should be unreachable


def get_secret(op_path: str) -> str:
    """Retrieves a secret from 1Password using the 'op' CLI."""
    if not op_path.startswith("op://"):
        # If it's not an 1Password path, assume it's directly the secret value
        # (e.g., for local testing with hardcoded API keys)
        return op_path
    log(f"🔑 Retrieving secret from 1Password: {op_path}")
    return run_command(["op", "read", op_path])


async def assess_confidence(
    provider: BaseAIProvider, model_name: str, task_prompt: str, agent_output: str
) -> Dict[str, Any]:
    """
    Asks an LLM (via the given provider) to assess its own confidence
    in a generated output relative to a given task prompt.
    Conforms to the confidence schema in docs/advanced_confidence_log.md.
    """
    log("🧠 Asking AI to self-assess confidence...")
    assessment_prompt = f"""
    You are an expert AI tasked with self-assessing the confidence of a generated output.
    Assess the following `AGENT_OUTPUT` in relation to the original `TASK_PROMPT`.

    TASK_PROMPT:
    {task_prompt}

    AGENT_OUTPUT:
    {agent_output}

    Provide a confidence score between 0.0 and 1.0 (float) and a concise justification for this score.
    Also, classify the confidence level as 'LOW', 'MEDIUM', or 'HIGH' based on these rules:
    - HIGH: Score >= 0.90 (Task requirements clear, output meets all criteria with high certainty.)
    - MEDIUM: 0.60 <= Score < 0.90 (Task completed, but minor ambiguities, assumptions, or potential edge cases identified.)
    - LOW: Score < 0.60 (Significant uncertainty, potential conflicts, or inability to fully address the prompt. Requires escalation.)

    Respond ONLY with a JSON object containing:
    {{
      "score": <float>,
      "level": "LOW" | "MEDIUM" | "HIGH",
      "justification": "<string>"
    }}
    """

    messages = [{"role": "user", "content": assessment_prompt}]

    try:
        # Use a low temperature for deterministic assessment
        response_text = await provider.generate_text(
            prompt=assessment_prompt,
            model=model_name,
            temperature=0.1,
            response_format={"type": "json_object"},  # Request JSON output where supported
        )
        confidence_data = json.loads(response_text)

        # Basic validation of the LLM's confidence response
        if not all(k in confidence_data for k in ["score", "level", "justification"]):
            raise ValueError("LLM response missing required confidence keys.")
        if not isinstance(confidence_data["score"], (int, float)):
            raise ValueError("LLM confidence score is not a number.")
        if confidence_data["level"] not in ["LOW", "MEDIUM", "HIGH"]:
            raise ValueError("LLM confidence level is not valid.")

        log(f"🧠 AI Confidence: {confidence_data['level']} (Score: {confidence_data['score']:.2f})")
        return confidence_data

    except (json.JSONDecodeError, ValueError) as e:
        log(
            f"⚠️  Failed to parse LLM's confidence assessment response. Defaulting to MEDIUM confidence. Error: {e}"
        )
        return {
            "score": 0.65,
            "level": "MEDIUM",
            "justification": f"LLM failed to provide structured confidence assessment due to parsing error: {e}. Requires human review.",
        }
    except Exception as e:
        log(
            f"⚠️  Error during LLM confidence assessment. Defaulting to MEDIUM confidence. Error: {e}"
        )
        return {
            "score": 0.65,
            "level": "MEDIUM",
            "justification": f"Error during confidence assessment: {e}. Requires human review.",
        }


async def delegate_task(
    agent_name: str,
    task_summary: str,
    task_prompt: str,
    pr_number: str,
    output_dir: Path,
):
    """
    Delegates a task to a specific AI agent, executes it, and generates a
    detailed, confidence-aware log entry conforming to the Advanced Confidence Log Guide.

    :param agent_name: The machine-readable name of the agent (e.g., 'copilot', 'codex').
                       This name maps to a JSON config file in .ai/config/.
    :param task_summary: A one-sentence summary of the action to be logged.
    :param task_prompt: The actual prompt/instruction sent to the LLM for the task.
    :param pr_number: The pull request number being operated on.
    :param output_dir: Directory to save the result JSON file and generated content.
    """
    log(f"Starting task delegation for agent '{agent_name}' on PR #{pr_number}.")

    # Load agent configuration
    agent_config = load_agent_config(agent_name)
    provider_type = agent_config.get("provider_type")
    model_name = agent_config.get("model_name")
    capabilities = agent_config.get("capabilities", [])

    if task_summary not in capabilities:
        log_error(
            f"Agent '{agent_name}' does not have the capability '{task_summary}'. "
            f"Available capabilities: {capabilities}"
        )

    log(
        f"✅ Agent '{agent_name}' is configured to use provider '{provider_type}' and model '{model_name}'."
    )

    # Get the AI provider instance
    try:
        provider = ai_provider_manager.get_provider(provider_type)
    except InvalidProviderError as e:
        log_error(f"Failed to get AI provider for agent '{agent_name}': {e}")
    except Exception as e:
        log_error(f"Error accessing AIProviderManager for '{agent_name}': {e}")

    # --- Execute the actual AI task ---
    log(f"🚀 Executing task '{task_summary}' using {provider_type}/{model_name}...")
    agent_output_content: str = ""
    try:
        # Assuming most tasks are either text generation or chat completions
        # If your tasks are more complex, this logic would branch based on task_summary/type
        if agent_config.get("api_type") == "chat":
            messages = [{"role": "user", "content": task_prompt}]
            # Pass additional model parameters from agent config
            response_obj = await provider.chat_completion(
                messages=messages,
                model=model_name,
                **agent_config.get("model_params", {}),
            )
            # Extract content from various chat completion formats
            if provider_type == "openai":
                agent_output_content = response_obj["choices"][0]["message"]["content"]
            elif provider_type == "google_ai":
                agent_output_content = response_obj["candidates"][0]["content"]["parts"][0]["text"]
            elif provider_type == "anthropic":
                agent_output_content = response_obj["content"][0]["text"]
            elif provider_type == "ollama":
                agent_output_content = response_obj["content"]
            else:
                agent_output_content = str(response_obj)  # Fallback for unknown provider types
        else:  # Default to text generation if not explicitly chat
            agent_output_content = await provider.generate_text(
                prompt=task_prompt,
                model=model_name,
                **agent_config.get("model_params", {}),
            )

        log(
            f"✅ Task executed by agent '{agent_name}'. Output length: {len(agent_output_content)} chars."
        )
        log(f"   └── Snippet: {agent_output_content[:100]}...")

    except AIProviderError as e:
        log_error(f"AI Provider error during task execution for '{agent_name}': {e}")
    except Exception as e:
        log_error(f"An unexpected error occurred during task execution: {e}")

    # --- Save generated content to a file ---
    output_filename = f"{uuid.uuid4()}-{agent_name}-{task_summary.replace(' ', '_')}-output.txt"
    output_filepath = output_dir / output_filename
    try:
        with open(output_filepath, "w", encoding="utf-8") as f:
            f.write(agent_output_content)
        log(f"✅ Generated content saved to: {output_filepath}")
    except OSError as e:
        log_error(f"Failed to save generated content to {output_filepath}: {e}")

    # --- Generate Confidence Log ---
    confidence_data = await assess_confidence(
        provider, model_name, task_prompt, agent_output_content
    )
    confidence_level = confidence_data.get("level")

    human_oversight_required = confidence_level in ["MEDIUM", "LOW"]
    escalation_triggered = confidence_level == "LOW"

    # Define the path for the log entry file
    log_filename = f"{uuid.uuid4()}-{agent_name}-{task_summary.replace(' ', '_')}-result.json"
    log_filepath = output_dir / log_filename

    # Build the log entry according to the Advanced Confidence Log schema
    log_entry = {
        "log_id": str(uuid.uuid4()),  # New UUID for the log entry itself
        "timestamp": datetime.now(UTC).isoformat(),
        "task_id": f"pr-{pr_number}",
        "agent_id": agent_name,
        "action": {
            "type": task_summary,  # Maps to 'action.type' from schema
            "summary": f"Performed {task_summary} on PR #{pr_number}.",  # Maps to 'action.summary'
        },
        "confidence": confidence_data,
        "flags": {
            "human_oversight_required": human_oversight_required,
            "escalation_triggered": escalation_triggered,
        },
        "artifacts": [
            {"type": "log_file", "path": str(log_filepath)},
            {"type": "generated_content", "path": str(output_filepath)},
        ],
    }

    try:
        with open(log_filepath, "w", encoding="utf-8") as f:
            json.dump(log_entry, f, indent=2)
        log(f"✅ Confidence log entry saved to: {log_filepath}")
        # Print a machine-readable success message for the calling script (e.g., CI/CD)
        print(
            json.dumps(
                {
                    "status": "success",
                    "agent": agent_name,
                    "log_file": str(log_filepath),
                    "generated_output_file": str(output_filepath),
                }
            )
        )
        sys.exit(0)  # Exit successfully
    except OSError as e:
        log_error(f"Failed to write confidence log file to {log_filepath}: {e}")
    except Exception as e:
        log_error(f"An unexpected error occurred while writing log: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Delegates a task to a specific AI agent and logs its confidence.",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument(
        "--agent",
        required=True,
        help="The machine-readable name of the agent (e.g., 'copilot', 'codex'). "
        "This maps to a config file in .ai/config/<agent>.json.",
    )
    parser.add_argument(
        "--task-summary",
        required=True,
        help="A one-sentence summary of the action performed by the agent (e.g., 'code_generation', 'security_review').",
    )
    parser.add_argument(
        "--task-prompt",
        required=True,
        help="The full prompt/instruction string that will be sent to the AI model for the task.",
    )
    parser.add_argument(
        "--pr-number",
        required=True,
        help="The pull request number relevant to this task (e.g., '123').",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=AI_LOGS_DIR,  # Default to the dedicated AI logs directory
        help=f"Directory to save the result JSON file and generated content. Defaults to {AI_LOGS_DIR}.",
    )

    args = parser.parse_args()

    # Ensure the output directory exists
    if not args.output_dir.exists():
        try:
            args.output_dir.mkdir(parents=True, exist_ok=True)
            log(f"Created output directory: {args.output_dir}")
        except OSError as e:
            log_error(f"Failed to create output directory {args.output_dir}: {e}")

    # Run the main async function
    try:
        asyncio.run(
            delegate_task(
                args.agent,
                args.task_summary,
                args.task_prompt,
                args.pr_number,
                args.output_dir,
            )
        )
    except Exception as e:
        log_error(f"Orchestration script encountered a critical error: {e}", exit_code=1)
