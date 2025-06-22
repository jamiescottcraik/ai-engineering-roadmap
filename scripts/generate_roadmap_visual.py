#!/usr/bin/env python3
"""
Generates a Mermaid syntax visual roadmap from the roadmap.json file.
"""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

def generate_mermaid_graph(data: dict) -> str:
    """Generates a Mermaid graph from roadmap data."""
    mermaid_lines = ["graph TD"]
    
    for phase in data.get("phases", []):
        phase_id = phase.get("id")
        phase_title = phase.get("title", "Unnamed Phase")
        mermaid_lines.append(f"    subgraph {phase_id} [\"{phase_title}\"]")
        
        nodes = phase.get("nodes", [])
        for i, node in enumerate(nodes):
            node_id = node.get("id")
            node_title = node.get("title", "Unnamed Node").replace('"', '&quot;')
            mermaid_lines.append(f'        {node_id}[\"{node_title}\"]')
            
            # Link nodes sequentially within a phase
            if i > 0:
                prev_node_id = nodes[i-1].get("id")
                mermaid_lines.append(f"        {prev_node_id} --> {node_id}")
        
        mermaid_lines.append("    end")

    # Link phases sequentially
    phases = data.get("phases", [])
    for i in range(len(phases) - 1):
        current_phase_nodes = phases[i].get("nodes", [])
        next_phase_nodes = phases[i+1].get("nodes", [])
        if current_phase_nodes and next_phase_nodes:
            last_node_of_current_phase = current_phase_nodes[-1].get("id")
            first_node_of_next_phase = next_phase_nodes[0].get("id")
            mermaid_lines.append(f"    {last_node_of_current_phase} --> {first_node_of_next_phase}")
            
    return "\n".join(mermaid_lines)

def main():
    """Main function to generate and save the roadmap visual."""
    print("🚀 Generating visual roadmap...")
    
    roadmap_file = Path("roadmaps/roadmap.json")
    output_file = Path("docs/roadmap.mmd")
    
    if not roadmap_file.exists():
        print(f"❌ Roadmap file not found at {roadmap_file}")
        return

    with open(roadmap_file) as f:
        roadmap_data = json.load(f)
        
    mermaid_syntax = generate_mermaid_graph(roadmap_data)
    
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w") as f:
        f.write(mermaid_syntax)
        
    print(f"✅ Visual roadmap saved to {output_file}")
    
    # Generate SVG from Mermaid file
    svg_file = output_file.with_suffix('.svg')
    try:
        subprocess.run(['mmdc', '-i', str(output_file), '-o', str(svg_file)], check=True)
        print(f"✅ SVG roadmap generated at {svg_file}")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Failed to generate SVG: {e}")
    except FileNotFoundError:
        print("⚠️ mmdc not found. Install with: npm install -g @mermaid-js/mermaid-cli")

if __name__ == "__main__":
    main()
