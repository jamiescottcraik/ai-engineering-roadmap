#!/bin/bash
set -e
for file in .ai/RULES_OF_AI.md .ai/AGENTS.md .ai/copilot-instructions.md .docs/feature_plan.md; do
  if [ ! -s "$file" ]; then
    echo "❌ $file is missing or empty. This file is protected."
    exit 1
  fi
done
echo "✅ All doctrine and agent instruction files are present."
