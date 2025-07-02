#!/usr/bin/env python3
"""
scripts/ai/run-orchestration.py

Primary consolidated workflow for the brAInwav Multi-Agent System (MAS) Platform.
This script orchestrates tasks, delegates them to appropriate AI agents,
and applies governance protocols including conflict resolution and audit logging.
"""

import argparse
import asyncio
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

# Import AI provider manager to get AI service instances
try:
    from apps.api.src.integrations.providers.ai_provider_manager import (
        AIProviderError,
        InvalidProviderError,
        ai_provider_manager,
    )
except ImportError:
    # AI provider manager not yet implemented
    print("⚠️  AI provider manager not available. Running in mock mode.")
    AIProviderError = Exception
    InvalidProviderError = Exception
    ai_provider_manager = None

# Mocking governance components for demonstration.
# In a real setup, these would be imported from apps.api.src.governance
# from apps.api.src.governance.policy_enforcer import PolicyEnforcer
# from apps.api.src.governance.conflict_resolver import ConflictResolver
# from apps.api.src.governance.models import AgentPolicy, AuthorityLevel


# --- Mocking placeholder governance components for this script's context ---
class MockAgentPolicy:
    def __init__(self, agent_name: str, authority: str, restrictions: list):
        self.agent_name = agent_name
        self.authority = authority
        self.restrictions = restrictions


class MockAuthorityLevel:
    ARCHITECT = "ARCHITECT"
    ASSISTANT = "ASSISTANT"
    CONTRIBUTOR = "CONTRIBUTOR"


class MockPolicyEnforcer:
    def __init__(self, policies: list):
        self.policies = policies

    def check_authority(self, agent_name: str, required_level: str) -> bool:
        for policy in self.policies:
            if policy.agent_name == agent_name:
                if required_level == MockAuthorityLevel.CONTRIBUTOR:
                    return True
                elif required_level == MockAuthorityLevel.ASSISTANT:
                    return policy.authority in [
                        MockAuthorityLevel.ASSISTANT,
                        MockAuthorityLevel.ARCHITECT,
                    ]
                elif required_level == MockAuthorityLevel.ARCHITECT:
                    return policy.authority == MockAuthorityLevel.ARCHITECT
        return False

    def validate_action(self, agent_name: str, action: str) -> bool:
        for policy in self.policies:
            if policy.agent_name == agent_name and action in policy.restrictions:
                return False
        return True


class MockConflictResolver:
    async def detect_conflict(self, agent_outputs: list) -> bool:
        # Simple demo conflict detection
        if len(agent_outputs) > 1 and len(set(agent_outputs)) > 1:
            return True
        return False

    async def escalate_conflict(self, conflict_details: Dict[str, Any]):
        logger.warning(f"CONFLICT ESCALATED: {json.dumps(conflict_details, indent=2)}")
        # In a real system, this would trigger an ADR creation, human notification, etc.


# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# --- Global instances of governance components (mocked for now) ---
# In a real application, these would be initialized from your governance modules
# and potentially configured from a registry.
SAMPLE_POLICIES = [
    MockAgentPolicy("openai", MockAuthorityLevel.ASSISTANT, ["direct_code_merge"]),
    MockAgentPolicy("google_ai", MockAuthorityLevel.ASSISTANT, ["direct_code_merge"]),
    MockAgentPolicy("anthropic", MockAuthorityLevel.CONTRIBUTOR, ["security_review_override"]),
    MockAgentPolicy("ollama", MockAuthorityLevel.CONTRIBUTOR, ["sensitive_data_processing"]),
]
policy_enforcer = MockPolicyEnforcer(SAMPLE_POLICIES)
conflict_resolver = MockConflictResolver()


async def load_task_definition(task_path: str) -> Dict[str, Any]:
    """
    Loads a task definition from a JSON file.
    :param task_path: Path to the JSON file containing the task definition.
    :return: Dictionary representing the task.
    """
    try:
        with open(task_path, "r", encoding="utf-8") as f:
            task_data = json.load(f)
        logger.info(f"Loaded task from: {task_path}")
        return task_data
    except FileNotFoundError:
        logger.error(f"Task definition file not found: {task_path}")
        raise
    except json.JSONDecodeError:
        logger.error(f"Invalid JSON in task definition file: {task_path}")
        raise
    except Exception as e:
        logger.error(f"Error loading task definition: {e}")
        raise


async def select_agent(task_type: str, required_authority: str) -> Optional[str]:
    """
    Selects the most suitable AI agent for a given task type and required authority.
    This logic would typically be driven by the /.ai/registry.yml.
    For this example, it's a simple lookup.
    :param task_type: The type of task (e.g., "code_generation", "architecture_review").
    :param required_authority: The minimum authority level required for the task.
    :return: The name of the selected provider/agent (e.g., "openai", "google_ai"), or None if no suitable agent found.
    """
    # This is a highly simplified agent selection logic.
    # In a real system, it would query /.ai/registry.yml and use more sophisticated matching.
    logger.info(
        f"Attempting to select agent for task type '{task_type}' with required authority '{required_authority}'"
    )

    # Iterate through available providers and check their policy compliance
    # Assume ai_provider_manager.get_provider_names() exists
    available_providers = ai_provider_manager._providers.keys()  # Direct access for this demo

    # Prioritize agents based on capabilities and authority
    if required_authority == MockAuthorityLevel.ARCHITECT:
        if "google_ai" in available_providers and policy_enforcer.check_authority(
            "google_ai", MockAuthorityLevel.ARCHITECT
        ):
            return "google_ai"  # Assuming Google Jules (Gemini) maps to ARCHITECT
    elif required_authority == MockAuthorityLevel.ASSISTANT:
        if "openai" in available_providers and policy_enforcer.check_authority(
            "openai", MockAuthorityLevel.ASSISTANT
        ):
            return "openai"
        if "google_ai" in available_providers and policy_enforcer.check_authority(
            "google_ai", MockAuthorityLevel.ASSISTANT
        ):
            return "google_ai"
    elif required_authority == MockAuthorityLevel.CONTRIBUTOR:
        if "ollama" in available_providers and policy_enforcer.check_authority(
            "ollama", MockAuthorityLevel.CONTRIBUTOR
        ):
            return "ollama"
        if "anthropic" in available_providers and policy_enforcer.check_authority(
            "anthropic", MockAuthorityLevel.CONTRIBUTOR
        ):
            return "anthropic"
        if "openai" in available_providers and policy_enforcer.check_authority(
            "openai", MockAuthorityLevel.CONTRIBUTOR
        ):
            return "openai"
        # Fallback to other available if none specific match

    logger.warning(
        f"No suitable agent found for task type '{task_type}' with required authority '{required_authority}'."
    )
    return None


async def delegate_task_to_agent(
    agent_name: str,
    task_description: str,
    messages: Optional[List[Dict[str, str]]] = None,
    **kwargs,
) -> str:
    """
    Delegates a task to a specific AI agent and retrieves its response.
    :param agent_name: The name of the AI provider/agent to use.
    :param task_description: The prompt or instruction for the AI.
    :param messages: Optional list of messages for chat completion.
    :param kwargs: Additional arguments to pass to the AI provider (e.g., model, temperature).
    :return: The agent's generated response.
    """
    logger.info(f"Delegating task to agent: {agent_name}")
    try:
        provider = ai_provider_manager.get_provider(agent_name)

        # Use chat_completion if messages are provided, otherwise use generate_text
        if messages:
            response_obj = await provider.chat_completion(messages=messages, **kwargs)
            # Assuming a generic way to extract content from diverse chat_completion responses
            if agent_name == "openai":
                content = response_obj["choices"][0]["message"]["content"]
            elif agent_name == "google_ai":
                content = response_obj["candidates"][0]["content"]["parts"][0]["text"]
            elif agent_name == "anthropic":
                content = response_obj["content"][0]["text"]
            elif agent_name == "ollama":
                content = response_obj["content"]
            else:
                content = str(response_obj)  # Fallback
            return content
        else:
            return await provider.generate_text(prompt=task_description, **kwargs)

    except InvalidProviderError as e:
        logger.error(f"Failed to delegate task: {e}")
        raise
    except AIProviderError as e:
        logger.error(f"AI Provider error during task delegation to {agent_name}: {e}")
        raise
    except Exception as e:
        logger.error(f"An unexpected error occurred during task delegation: {e}")
        raise


async def update_ai_audit_log(
    agent_name: str,
    summary: str,
    citation_details: List[Dict[str, Any]],
    log_file_path: str = "AI_CONTRIB_LOG.yaml",
):
    """
    Updates the AI contribution audit log with agent actions.
    This calls the external update_audit_log.py script's logic.
    """
    logger.info(f"Updating AI audit log for {agent_name}...")
    try:
        # Importing the function directly from the script
        from scripts.ai import update_audit_log_script_logic

        await update_audit_log_script_logic.update_log_entry(
            agent_name=agent_name,
            summary=summary,
            citation_details=citation_details,
            log_file_path=log_file_path,
        )
        logger.info("AI audit log updated successfully.")
    except ImportError:
        logger.error(
            "Could not import update_audit_log_script_logic. Make sure the path is correct."
        )
    except Exception as e:
        logger.error(f"Failed to update AI audit log: {e}")


async def main(task_path: str):
    """
    Main orchestration function.
    :param task_path: Path to the task definition JSON file.
    """
    logger.info("Starting brAInwav AI Orchestration Engine.")

    task = None
    try:
        task = await load_task_definition(task_path)
    except Exception as e:
        logger.critical(f"Aborting orchestration: Failed to load task definition. {e}")
        return

    task_id = task.get("id", "unknown_task")
    task_type = task.get("type", "generic")
    task_description = task.get("description")
    required_authority = task.get("required_authority", MockAuthorityLevel.CONTRIBUTOR)
    messages = task.get("messages")  # For chat-based tasks
    additional_kwargs = task.get("model_params", {})

    if not task_description:
        logger.error(f"Task '{task_id}' has no description. Aborting.")
        return

    selected_agent_name = await select_agent(task_type, required_authority)

    if not selected_agent_name:
        logger.error(f"No suitable agent found for task '{task_id}'. Cannot proceed.")
        return

    logger.info(f"Task '{task_id}': Delegating to '{selected_agent_name}' for '{task_type}'")

    try:
        # --- Task Execution ---
        agent_response = await delegate_task_to_agent(
            selected_agent_name,
            task_description,
            messages=messages,
            **additional_kwargs,
        )
        logger.info(f"Agent '{selected_agent_name}' responded for task '{task_id}'.")
        logger.debug(f"Agent response (truncated): {agent_response[:500]}...")

        # --- Governance: Conflict Resolution (if applicable) ---
        # If this task involves multiple agents or human inputs,
        # conflict resolution would happen here. For now, simulate single agent.
        # This part assumes outputs from multiple agents would be collected elsewhere
        # and passed to conflict_resolver.
        if task.get("expect_multiple_outputs", False):
            # Example: collect_outputs_from_other_agents()
            all_outputs = [agent_response]  # + other_agent_outputs
            if await conflict_resolver.detect_conflict(all_outputs):
                conflict_details = {
                    "task_id": task_id,
                    "agents_involved": [selected_agent_name],  # Extend if multiple
                    "outputs": all_outputs,
                    "reason": "Divergent outputs detected",
                }
                await conflict_resolver.escalate_conflict(conflict_details)
                logger.warning(
                    f"Conflict detected for task '{task_id}'. Human intervention required."
                )
                # Decide whether to halt or proceed with potentially conflicting output
                # For now, we proceed to audit log but flag the warning.

        # --- Governance: Policy Enforcement (Pre-execution validation should happen here) ---
        # For simplicity, policy enforcement is simulated during agent selection.
        # More granular validation of the *content* of the agent's response could go here.
        if not policy_enforcer.validate_action(selected_agent_name, "generate_response"):
            logger.warning(
                f"Agent '{selected_agent_name}' generated a response that violates a policy. Review required."
            )

        # --- Audit Logging ---
        # Construct citation details based on the task and response.
        # This needs to be specific to what the agent actually *did* (e.g., generated code, reviewed doc).
        # For this example, we'll use a generic citation.
        citation_details = [
            {
                "type": "agent_generated_text",
                "summary": f"Response for task '{task_id}' by {selected_agent_name}",
                "content_snippet": agent_response[:200],  # Log a snippet of the content
            }
        ]
        await update_ai_audit_log(
            selected_agent_name, f"Completed task: {task_id}", citation_details
        )

        logger.info(f"Orchestration for task '{task_id}' completed successfully.")

    except AIProviderError as e:
        logger.critical(f"Orchestration failed for task '{task_id}' due to AI provider error: {e}")
    except Exception as e:
        logger.critical(
            f"Orchestration failed for task '{task_id}' due to unexpected error: {e}",
            exc_info=True,
        )
    finally:
        # Ensure all HTTP clients are closed upon completion or failure
        await ai_provider_manager.close_all_providers()
        logger.info("AI Provider clients closed.")


if __name__ == "__main__":
    # Add a mock for PROJECT_ROOT if running main directly for development purposes.
    # In a real setup, this script would likely be called from the project root
    # or have PROJECT_ROOT correctly defined from its execution context.
    try:
        from scripts.ai.update_audit_log import (
            update_log_entry as update_audit_log_script_logic,
        )
    except ImportError:
        logger.warning(
            "Could not import update_audit_log_script_logic directly. "
            "Ensure its path is correct or mock it for local testing."
        )

        # Create a dummy function if import fails, for local execution without breaking
        async def dummy_update_log_entry(*args, **kwargs):
            logger.info("Dummy audit log update called.")

        update_audit_log_script_logic = dummy_update_log_entry

    # Argument parsing for task path
    parser = argparse.ArgumentParser(description="Run brAInwav AI Orchestration Engine.")
    parser.add_argument(
        "task_path",
        type=str,
        help="Path to the JSON file containing the task definition (e.g., 'data/sample_task.json').",
    )
    args = parser.parse_args()

    # Create a dummy task file for testing if it doesn't exist
    sample_task_file = Path(args.task_path)
    if not sample_task_file.exists():
        logger.info(f"Creating sample task file: {sample_task_file}")
        sample_task_file.parent.mkdir(parents=True, exist_ok=True)
        sample_task_content = {
            "id": "sample_code_gen_001",
            "type": "code_generation",
            "description": "Generate a Python function to calculate the Nth Fibonacci number iteratively.",
            "required_authority": "ASSISTANT",
            "model_params": {"temperature": 0.5, "max_tokens": 200},
            "messages": [
                {"role": "system", "content": "You are an expert Python programmer."},
                {
                    "role": "user",
                    "content": "Write a Python function `fibonacci_iterative(n)` that calculates the Nth Fibonacci number using an iterative approach. Include docstrings and type hints.",
                },
            ],
        }
        with open(sample_task_file, "w", encoding="utf-8") as f:
            json.dump(sample_task_content, f, indent=2)
        logger.info(
            "Sample task file created. You can run: python scripts/ai/run-orchestration.py data/sample_task.json"
        )

    asyncio.run(main(args.task_path))
