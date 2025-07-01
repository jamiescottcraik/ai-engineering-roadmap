#!/usr/bin/env python3
"""
scripts/ai/agent-monitor.py

This script reads individual AI agent result files (e.g., from .ai/logs/)
and consolidates them into a single, comprehensive summary report.
This report is used by the main AI orchestration workflow to determine
overall task status, identify required human oversight, and trigger escalations
based on agent confidence levels, as defined in docs/advanced_confidence_log.md.
"""

import argparse
import json
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, Dict, List

# --- Helper Functions ---


def log_error(message: str):
    """Prints a structured error message to stderr and exits."""
    # Using JSON output for errors makes it machine-parsable in CI/CD logs
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
    sys.exit(1)


def log(message: str):
    """Prints a log message to stdout for visibility in CI/CD runs."""
    print(f"   [AgentMonitor] {message}")


def validate_agent_result_schema(report: Dict[str, Any], file_path: Path) -> bool:
    """
    Performs a basic validation of an agent's result file against the schema
    defined in docs/advanced_confidence_log.md.
    This is a simplified check; for strict validation, use a JSON schema library.
    """
    required_top_keys = [
        "log_id",
        "timestamp",
        "task_id",
        "agent_id",
        "action",
        "confidence",
        "flags",
    ]
    if not all(key in report for key in required_top_keys):
        log(f"⚠️  Schema validation failed for {file_path}: Missing top-level keys.")
        return False

    if not isinstance(report.get("confidence"), dict) or "score" not in report["confidence"]:
        log(f"⚠️  Schema validation failed for {file_path}: Invalid or missing 'confidence.score'.")
        return False

    if (
        not isinstance(report.get("flags"), dict)
        or "human_oversight_required" not in report["flags"]
    ):
        log(
            f"⚠️  Schema validation failed for {file_path}: Invalid or missing 'flags.human_oversight_required'."
        )
        return False

    return True


# --- Core Logic ---
def consolidate_results(input_dir: Path, output_file: Path):
    """
    Reads all agent result files from an input directory, validates them,
    and consolidates them into a single summary report.
    This report is designed for consumption by CI/CD workflows for decision making.
    """
    log(f"Starting consolidation of agent results from: {input_dir}")
    result_files = list(input_dir.glob("*-result.json"))

    if not result_files:
        log("No agent result files found to process. Generating empty report.")
        # Generate an empty report if no files are found
        final_report = {
            "summary": {
                "report_generated_at": datetime.now(UTC).isoformat(),
                "total_agents_processed": 0,
                "successful_agents": 0,
                "failed_agents": 0,
                "overall_status": "success",
                "overall_human_oversight_required": False,
                "overall_escalation_triggered": False,
                "message": "No agent result files found.",
            },
            "detailed_reports": [],
        }
        try:
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(final_report, f, indent=2)
            log(f"✅ Empty consolidated report written to: {output_file}")
            sys.exit(0)  # Exit successfully if no files were found (not an error scenario)
        except OSError as e:
            log_error(f"Failed to write empty output file to {output_file}: {e}")

    agent_reports: List[Dict[str, Any]] = []
    success_count = 0
    failure_count = 0
    overall_human_oversight_required = False
    overall_escalation_triggered = False

    for file_path in result_files:
        try:
            with open(file_path, encoding="utf-8") as f:
                report_data = json.load(f)

            # Validate the schema of the individual report
            if not validate_agent_result_schema(report_data, file_path):
                log(f"❌ Skipping {file_path} due to schema validation failure.")
                failure_count += 1
                continue  # Skip to next file if validation fails

            agent_reports.append(report_data)

            # Update summary counts
            # Assuming agent result files also have a "status" field, like "success" or "failure"
            if report_data.get("status") == "success":  # If the agent itself reports success
                success_count += 1
            else:
                failure_count += 1  # If the agent reports failure or schema validation failed

            # Aggregate flags for overall report summary
            flags = report_data.get("flags", {})
            if flags.get("human_oversight_required"):
                overall_human_oversight_required = True
            if flags.get("escalation_triggered"):
                overall_escalation_triggered = True

        except (OSError, json.JSONDecodeError) as e:
            log(f"⚠️  Could not read or parse file {file_path}: {e}")
            failure_count += 1
        except Exception as e:
            log(f"An unexpected error occurred processing {file_path}: {e}")
            failure_count += 1

    # --- Build the Final Consolidated Report ---
    final_report_status = "failure" if failure_count > 0 else "success"
    final_report_message = (
        "Consolidation completed with failures."
        if failure_count > 0
        else "All agent reports consolidated successfully."
    )

    final_report = {
        "summary": {
            "report_generated_at": datetime.now(UTC).isoformat(),
            "total_agents_processed": len(result_files),  # Total files attempted to process
            "successful_agents": success_count,
            "failed_agents": failure_count,
            "overall_status": final_report_status,
            "overall_human_oversight_required": overall_human_oversight_required,
            "overall_escalation_triggered": overall_escalation_triggered,
            "message": final_report_message,
        },
        "detailed_reports": agent_reports,  # Contains only reports that passed initial loading/validation
    }

    log(f"Consolidation complete. Overall Status: {final_report['summary']['overall_status']}")
    log(f"Human oversight required: {final_report['summary']['overall_human_oversight_required']}")
    log(f"Escalation triggered: {final_report['summary']['overall_escalation_triggered']}")

    try:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(final_report, f, indent=2)
        log(f"✅ Consolidated report written to: {output_file}")
    except OSError as e:
        log_error(f"Failed to write output file to {output_file}: {e}")

    # Exit with a non-zero status code if there were failures in processing files
    # or if any agent triggered an escalation flag.
    if failure_count > 0 or overall_escalation_triggered:
        log_error("Agent monitoring detected failures or triggered escalations.")
    else:
        sys.exit(0)  # Exit successfully


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Consolidates multiple AI agent result files into a single report.",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument(
        "--input-dir",
        type=Path,
        required=True,
        help="The directory containing the individual agent result JSON files (e.g., .ai/logs/).",
    )
    parser.add_argument(
        "--output-file",
        type=Path,
        required=True,
        help="The path to save the final consolidated JSON report (e.g., .ai/logs/consolidated_report.json).",
    )

    args = parser.parse_args()

    # Ensure the output directory exists
    if not args.output_file.parent.exists():
        try:
            args.output_file.parent.mkdir(parents=True, exist_ok=True)
            log(f"Created output directory: {args.output_file.parent}")
        except OSError as e:
            log_error(f"Failed to create output directory {args.output_file.parent}: {e}")

    consolidate_results(args.input_dir, args.output_file)
