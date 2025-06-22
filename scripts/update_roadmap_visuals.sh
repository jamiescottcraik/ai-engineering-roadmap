#!/bin/bash
# Regenerate visual roadmaps from roadmap.json
set -e

echo "🔄 Regenerating visual roadmaps..."

# Generate Mermaid and SVG files
python scripts/generate_roadmap_visual.py

echo "✅ Visual roadmaps updated successfully!"
echo "📄 Mermaid: docs/roadmap.mmd"
echo "🖼️ SVG: docs/roadmap.svg"
