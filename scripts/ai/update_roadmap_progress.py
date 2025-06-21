#!/usr/bin/env python3
"""
Auto-update roadmap progress based on GitHub activity and external APIs
"""

import json
import os
import requests
from datetime import datetime
from pathlib import Path

class RoadmapProgressTracker:
    def __init__(self):
        self.github_token = os.getenv('GITHUB_TOKEN')
        self.username = 'jamiescottcraik'
        self.repo_name = 'ai-engineering-roadmap'
        self.api_base = "https://api.github.com"
        
    def get_github_activity(self):
        """Get recent GitHub activity for progress tracking"""
        headers = {"Authorization": f"token {self.github_token}"}
        
        # Get user repositories
        repos_url = f"{self.api_base}/users/{self.username}/repos"
        response = requests.get(repos_url, headers=headers)
        repos = response.json() if response.status_code == 200 else []
        
        # Check for roadmap-related repositories
        roadmap_projects = {
            'github-profile-generator': 'build-github-stats',
            'sql-analytics-automation': 'build-sql-reports',
            'cognitive-load-reducer': 'build-cognitive-reducer',
            'ethical-ai-guardian': 'build-ethical-guardian',
            'paragon-ai': 'build-paragon-ai'
        }
        
        project_status = {}
        for repo in repos:
            repo_name = repo['name'].lower()
            for project_key, node_id in roadmap_projects.items():
                if project_key in repo_name:
                    project_status[node_id] = {
                        'exists': True,
                        'last_updated': repo['updated_at'],
                        'description': repo['description'],
                        'url': repo['html_url']
                    }
        
        return project_status
    
    def update_roadmap_json(self):
        """Update the roadmap.json file with current progress"""
        data_file = Path('frontend/public/data/roadmap.json')
        
        # Ensure directory exists
        data_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Load existing data or create new
        if data_file.exists():
            with open(data_file, 'r') as f:
                roadmap_data = json.load(f)
        else:
            roadmap_data = self.create_initial_roadmap()
        
        # Update metadata
        roadmap_data['metadata']['last_updated'] = datetime.utcnow().isoformat() + 'Z'
        
        # Get GitHub activity
        github_activity = self.get_github_activity()
        
        # Update node progress based on activity
        for phase in roadmap_data['phases']:
            for node in phase['nodes']:
                node_id = node['id']
                
                # Update progress based on GitHub activity
                if node_id in github_activity:
                    activity = github_activity[node_id]
                    if activity['exists']:
                        # Repository exists, increase progress
                        node['progress'] = max(node['progress'], 50)
                        if 'url' not in node:
                            node['repository_url'] = activity['url']
                
                # Special progress rules
                if node_id == 'learn-python-math':
                    # This would integrate with DataCamp/Coursera APIs in production
                    node['progress'] = min(node['progress'] + 1, 100)
        
        # Calculate phase progress
        for phase in roadmap_data['phases']:
            if phase['nodes']:
                phase['progress'] = sum(node['progress'] for node in phase['nodes']) / len(phase['nodes'])
                
                # Update phase status
                if phase['progress'] == 100:
                    phase['status'] = 'completed'
                elif phase['progress'] > 0:
                    phase['status'] = 'in_progress'
                else:
                    phase['status'] = 'not_started'
        
        # Save updated data
        with open(data_file, 'w') as f:
            json.dump(roadmap_data, f, indent=2)
        
        print(f"✅ Roadmap updated: {data_file}")
        return roadmap_data
    
    def create_initial_roadmap(self):
        """Create initial roadmap data structure"""
        return {
            "metadata": {
                "title": "AI Leadership Engineering Roadmap",
                "author": "Jamie Scott Craik",
                "last_updated": datetime.utcnow().isoformat() + 'Z',
                "version": "2.1",
                "total_duration_months": 30
            },
            "phases": [
                {
                    "id": "phase-1",
                    "title": "Advanced Technical Foundations",
                    "duration_months": 7,
                    "status": "in_progress",
                    "progress": 15,
                    "x": 50,
                    "y": 100,
                    "width": 1000,
                    "height": 200,
                    "color": "#1f4e79",
                    "nodes": [
                        {
                            "id": "learn-python-math",
                            "title": "Advanced Python & Math",
                            "type": "learn",
                            "progress": 25,
                            "isActive": True,
                            "isUnlocked": True,
                            "position": {"x": 100, "y": 150},
                            "resources": [
                                {
                                    "title": "DataCamp: Associate Python Developer",
                                    "url": "https://www.datacamp.com/tracks/associate-python-developer",
                                    "type": "course"
                                }
                            ]
                        },
                        {
                            "id": "build-github-stats",
                            "title": "GitHub Profile Stats Generator",
                            "type": "practice",
                            "progress": 0,
                            "isActive": False,
                            "isUnlocked": True,
                            "position": {"x": 350, "y": 150},
                            "resources": []
                        }
                    ]
                }
            ]
        }

if __name__ == "__main__":
    tracker = RoadmapProgressTracker()
    roadmap_data = tracker.update_roadmap_json()
    
    print("🚀 Interactive roadmap updated successfully!")
    print(f"📊 Current overall progress: {sum(p['progress'] for p in roadmap_data['phases']) / len(roadmap_data['phases']):.1f}%")