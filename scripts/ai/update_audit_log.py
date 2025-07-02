#!/usr/bin/env python3
"""
scripts/ai/update_audit_log.py

This script is responsible for appending structured, schema-compliant
AI contribution log entries to the root 'AI_CONTRIB_LOG.yaml' file.
It ensures an immutable, auditable trail of all AI-assisted contributions
to the repository, conforming to the schema defined in
'docs/advanced_confidence_log.md'.
"""

import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml  # Requires PyYAML: uv pip install pyyaml

# --- Configuration ---
PROJECT_ROOT = Path(__file__).parent.parent.parent
AUDIT_LOG_FILE = PROJECT_ROOT / "AI_CONTRIB_LOG.yaml"


# --- Helper Functions ---
def log_error(message: str):
    """Prints a structured error message to stderr and exits."""
    print(f"❌ [Audit Log] ERROR: {message}", file=sys.stderr)
    sys.exit(1)


def log(message: str):
    """Prints a log message to stdout for visibility."""
    print(f"   [Audit Log] {message}")


# --- Core Logic ---
def update_log_entry(
    agent_name: str,
    summary: str,
    citation_details: List[Dict[str, Any]],
    log_file_path: Path = AUDIT_LOG_FILE,
    log_id: Optional[str] = None,
    task_id: str = "N/A",
    confidence_data: Optional[Dict[str, Any]] = None,
    flags_data: Optional[Dict[str, bool]] = None,
) -> None:
    """
    Appends a new, schema-compliant entry to the AI_CONTRIB_LOG.yaml file.

    :param agent_name: The ID of the assisting agent (e.g., 'openai_codex', 'github_copilot').
    :param summary: A one-sentence summary of the action taken by the agent.
    :param citation_details: A list of artifacts/citations related to the contribution,
                             following the Advanced Confidence Log 'artifacts' schema.
                             (e.g., [{"type": "file_path", "path": "src/new_feature.py"}])
    :param log_file_path: The path to the AI_CONTRIB_LOG.yaml file.
    :param log_id: Optional UUID for the log entry. If None, a new one is generated.
    :param task_id: Optional ID of the task associated with this log entry (e.g., GitHub Issue ID).
    :param confidence_data: Optional dictionary for agent's confidence,
                            e.g., {"score": 0.95, "level": "HIGH", "justification": "..."}.
                            If None, a default (unknown) confidence will be used.
    :param flags_data: Optional dictionary for flags, e.g., {"human_oversight_required": false, "escalation_triggered": false}.
                       If None, default (false) flags will be used.
    """
    log(f"Preparing log entry for agent '{agent_name}' with summary: '{summary[:50]}...'")

    # Generate default values if not provided
    if log_id is None:
        import uuid

        log_id = str(uuid.uuid4())
    if confidence_data is None:
        confidence_data = {
            "score": 0.0,
            "level": "UNKNOWN",
            "justification": "Confidence not assessed for this entry type.",
        }
    if flags_data is None:
        flags_data = {"human_oversight_required": False, "escalation_triggered": False}

    new_entry = {
        "log_id": log_id,
        "timestamp": datetime.now(UTC).isoformat(),
        "task_id": task_id,
        "agent_id": agent_name,
        "action": {
            "type": "unspecified_action",  # More specific type should come from caller
            "summary": summary,
        },
        "confidence": confidence_data,
        "flags": flags_data,
        "artifacts": citation_details,
    }

    # Load existing content or initialize
    existing_content: List[Dict[str, Any]] = []
    if log_file_path.exists() and log_file_path.stat().st_size > 0:
        try:
            with open(log_file_path, "r", encoding="utf-8") as f:
                # Use safe_load to avoid arbitrary code execution
                existing_content = yaml.safe_load(f)
            if not isinstance(existing_content, list):
                # If the file exists but isn't a list of entries,
                # it's malformed or not in the expected format.
                log(f"⚠️  Existing log file {log_file_path} is not a list. Initializing anew.")
                existing_content = []
        except (OSError, yaml.YAMLError) as e:
            log(
                f"⚠️  Could not read or parse existing audit log file {log_file_path}: {e}. Starting fresh."
            )
            existing_content = []

    existing_content.append(new_entry)

    try:
        with open(log_file_path, "w", encoding="utf-8") as f:
            # Use safe_dump for secure YAML serialization
            yaml.safe_dump(existing_content, f, indent=2, sort_keys=False, default_flow_style=False)
        log("✅ Successfully updated AI_CONTRIB_LOG.yaml.")
    except OSError as e:
        log_error(f"Failed to write to audit log file {log_file_path}: {e}")
    except Exception as e:
        log_error(f"An unexpected error occurred while writing log: {e}")


# Expose the function for import by other scripts
update_log_entry_script_logic = update_log_entry

# --- Main execution block (for standalone testing/demonstration) ---
if __name__ == "__main__":
    # Ensure the audit log file path exists (its parent directory)
    if not AUDIT_LOG_FILE.parent.exists():
        AUDIT_LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

    log("Running update_audit_log.py in standalone mode (demonstration).")

    # Example 1: Basic entry
    log("\n--- Demo 1: Basic AI-assisted commit ---")
    update_log_entry(
        agent_name="github_copilot",
        summary="Added initial setup files for FastAPI backend.",
        citation_details=[{"type": "file_path", "path": "apps/api/src/main.py"}],
        task_id="INIT-001",
    )

    # Example 2: Entry with confidence and flags (simulating from a task delegation)
    log("\n--- Demo 2: Agent-executed task with confidence ---")
    update_log_entry(
        agent_name="openai_codex",
        summary="Implemented classifier service based on feature plan.",
        citation_details=[
            {"type": "file_path", "path": "apps/api/src/services/classifier.py"},
            {"type": "generated_content", "path": ".ai/logs/classifier-output-123.txt"},
        ],
        task_id="BRAIN-123",
        confidence_data={
            "score": 0.92,
            "level": "HIGH",
            "justification": "Task requirements were explicit; implementation directly followed Provider Abstraction Pattern.",
        },
        flags_data={"human_oversight_required": False, "escalation_triggered": False},
    )

    # Example 3: Low confidence entry (requiring human oversight)
    log("\n--- Demo 3: Agent task with low confidence, requiring oversight ---")
    update_log_entry(
        agent_name="google_jules",
        summary="Performed architectural review, identified potential scaling bottleneck.",
        citation_details=[
            {
                "type": "pr_comment_url",
                "path": "https://github.com/org/repo/pull/123#issuecomment-xyz",
            },
            {"type": "log_file", "path": ".ai/logs/jules-review-report-456.json"},
        ],
        task_id="ARCH-789",
        confidence_data={
            "score": 0.45,
            "level": "LOW",
            "justification": "Ambiguity in load projection data. Cannot confirm scalability without further clarification.",
        },
        flags_data={"human_oversight_required": True, "escalation_triggered": True},
    )

    log("\nDemonstration complete. Check AI_CONTRIB_LOG.yaml for entries.")
