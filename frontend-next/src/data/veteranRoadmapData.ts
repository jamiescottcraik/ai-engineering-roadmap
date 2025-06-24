/**
 * AI Engineering Roadmap - 5-Phase Veteran-Led Structure
 * 
 * This data structure represents the comprehensive 5-phase learning path
 * designed specifically for veterans transitioning to AI engineering roles.
 * 
 * @author GitHub Copilot (ai-assisted)
 * @adheresTo /.ai/AGENT.md §2 (Core Requirements), §3.2 (Error Handling)
 */

import { type RoadmapData } from '../types/roadmap';

export const veteranRoadmapData: RoadmapData = {
  items: {
    // Root node
    'root': {
      id: 'root',
      label: 'AI Engineering Roadmap',
      nodeType: 'category',
      status: 'inProgress',
      childrenIds: ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'],
      description: 'Veteran-led 48-week transformation into AI engineering leadership'
    },

    // Phase 1: Technical Foundations (8 weeks)
    'phase1': {
      id: 'phase1',
      label: 'Phase 1: Technical Foundations',
      nodeType: 'category',
      status: 'inProgress',
      estimatedTime: '8 weeks',
      childrenIds: ['python_mastery', 'math_foundations', 'cs_fundamentals', 'github_portfolio'],
      description: 'Build rock-solid technical foundations'
    },
    'python_mastery': {
      id: 'python_mastery',
      label: 'Advanced Python Mastery',
      nodeType: 'topic',
      status: 'inProgress',
      difficulty: 'intermediate',
      estimatedTime: '2 weeks',
      childrenIds: ['data_structures', 'oop_patterns', 'testing_practices'],
      prerequisites: []
    },
    'data_structures': {
      id: 'data_structures',
      label: 'Data Structures & Algorithms',
      nodeType: 'subTopic',
      status: 'completed',
      difficulty: 'beginner',
      estimatedTime: '1 week'
    },
    'oop_patterns': {
      id: 'oop_patterns',
      label: 'OOP & Design Patterns',
      nodeType: 'subTopic',
      status: 'inProgress',
      difficulty: 'intermediate',
      estimatedTime: '3 days'
    },
    'testing_practices': {
      id: 'testing_practices',
      label: 'Testing & TDD',
      nodeType: 'subTopic',
      status: 'todo',
      difficulty: 'intermediate',
      estimatedTime: '4 days',
      prerequisites: ['oop_patterns']
    },
    'math_foundations': {
      id: 'math_foundations',
      label: 'Math for AI',
      nodeType: 'topic',
      status: 'todo',
      difficulty: 'intermediate',
      estimatedTime: '2 weeks',
      childrenIds: ['linear_algebra', 'statistics', 'calculus'],
      prerequisites: ['python_mastery']
    },
    'linear_algebra': {
      id: 'linear_algebra',
      label: 'Linear Algebra',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '1 week'
    },
    'statistics': {
      id: 'statistics',
      label: 'Statistics & Probability',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '5 days'
    },
    'calculus': {
      id: 'calculus',
      label: 'Calculus Fundamentals',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '2 days'
    },
    'cs_fundamentals': {
      id: 'cs_fundamentals',
      label: 'CS Fundamentals',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '2 weeks',
      childrenIds: ['databases', 'networking', 'system_design_basics'],
      prerequisites: ['python_mastery']
    },
    'databases': {
      id: 'databases',
      label: 'Database Systems',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '1 week'
    },
    'networking': {
      id: 'networking',
      label: 'Networking & APIs',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'beginner',
      estimatedTime: '3 days'
    },
    'system_design_basics': {
      id: 'system_design_basics',
      label: 'System Design Basics',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '4 days'
    },
    'github_portfolio': {
      id: 'github_portfolio',
      label: 'GitHub Portfolio',
      nodeType: 'projectIdea',
      status: 'locked',
      difficulty: 'beginner',
      estimatedTime: '2 weeks',
      prerequisites: ['python_mastery', 'cs_fundamentals']
    },

    // Phase 2: ML/DL & Production (10 weeks)
    'phase2': {
      id: 'phase2',
      label: 'Phase 2: ML/DL & Production',
      nodeType: 'category',
      status: 'locked',
      estimatedTime: '10 weeks',
      childrenIds: ['ml_fundamentals', 'deep_learning', 'specialization_track', 'production_deployment'],
      prerequisites: ['phase1'],
      description: 'Master machine learning and production deployment'
    },
    'ml_fundamentals': {
      id: 'ml_fundamentals',
      label: 'ML Fundamentals',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '3 weeks',
      childrenIds: ['supervised_learning', 'unsupervised_learning', 'model_evaluation']
    },
    'supervised_learning': {
      id: 'supervised_learning',
      label: 'Supervised Learning',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '1.5 weeks'
    },
    'unsupervised_learning': {
      id: 'unsupervised_learning',
      label: 'Unsupervised Learning',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '1 week'
    },
    'model_evaluation': {
      id: 'model_evaluation',
      label: 'Model Evaluation & Metrics',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '3 days'
    },
    'deep_learning': {
      id: 'deep_learning',
      label: 'Deep Learning',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '3 weeks',
      childrenIds: ['neural_networks', 'frameworks', 'optimization'],
      prerequisites: ['ml_fundamentals']
    },
    'neural_networks': {
      id: 'neural_networks',
      label: 'Neural Networks',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '1.5 weeks'
    },
    'frameworks': {
      id: 'frameworks',
      label: 'TensorFlow/PyTorch',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '1 week'
    },
    'optimization': {
      id: 'optimization',
      label: 'Training & Optimization',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '3 days'
    },
    'specialization_track': {
      id: 'specialization_track',
      label: 'Specialization Track',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '2 weeks',
      childrenIds: ['nlp_track', 'computer_vision_track', 'generative_ai_track'],
      prerequisites: ['deep_learning']
    },
    'nlp_track': {
      id: 'nlp_track',
      label: 'Natural Language Processing',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '2 weeks'
    },
    'computer_vision_track': {
      id: 'computer_vision_track',
      label: 'Computer Vision',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '2 weeks'
    },
    'generative_ai_track': {
      id: 'generative_ai_track',
      label: 'Generative AI',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '2 weeks'
    },
    'production_deployment': {
      id: 'production_deployment',
      label: 'Production Deployment',
      nodeType: 'projectIdea',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '2 weeks',
      prerequisites: ['specialization_track']
    },

    // Phase 3: Systems & MLOps (8 weeks)
    'phase3': {
      id: 'phase3',
      label: 'Phase 3: Systems & MLOps',
      nodeType: 'category',
      status: 'locked',
      estimatedTime: '8 weeks',
      childrenIds: ['cloud_platforms', 'mlops_pipeline', 'monitoring_logging', 'security_compliance'],
      prerequisites: ['phase2'],
      description: 'Build scalable, secure AI systems'
    },
    'cloud_platforms': {
      id: 'cloud_platforms',
      label: 'Cloud Platforms',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '2 weeks',
      childrenIds: ['aws_ai_services', 'containerization', 'orchestration']
    },
    'aws_ai_services': {
      id: 'aws_ai_services',
      label: 'AWS AI Services',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '1 week'
    },
    'containerization': {
      id: 'containerization',
      label: 'Docker & Containers',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '3 days'
    },
    'orchestration': {
      id: 'orchestration',
      label: 'Kubernetes Basics',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '4 days'
    },
    'mlops_pipeline': {
      id: 'mlops_pipeline',
      label: 'MLOps Pipeline',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '3 weeks',
      childrenIds: ['ci_cd_ml', 'model_versioning', 'automated_testing'],
      prerequisites: ['cloud_platforms']
    },
    'ci_cd_ml': {
      id: 'ci_cd_ml',
      label: 'CI/CD for ML',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '1 week'
    },
    'model_versioning': {
      id: 'model_versioning',
      label: 'Model Versioning',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '1 week'
    },
    'automated_testing': {
      id: 'automated_testing',
      label: 'Automated Testing',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '1 week'
    },
    'monitoring_logging': {
      id: 'monitoring_logging',
      label: 'Monitoring & Logging',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '2 weeks',
      prerequisites: ['mlops_pipeline']
    },
    'security_compliance': {
      id: 'security_compliance',
      label: 'Security & Compliance',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '1 week',
      prerequisites: ['monitoring_logging']
    },

    // Phase 4: Strategic Leadership (10 weeks)
    'phase4': {
      id: 'phase4',
      label: 'Phase 4: Strategic Leadership',
      nodeType: 'category',
      status: 'locked',
      estimatedTime: '10 weeks',
      childrenIds: ['technical_leadership', 'product_strategy', 'team_building', 'veteran_advocacy'],
      prerequisites: ['phase3'],
      description: 'Develop strategic leadership and veteran advocacy skills'
    },
    'technical_leadership': {
      id: 'technical_leadership',
      label: 'Technical Leadership',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '3 weeks',
      childrenIds: ['architecture_decisions', 'code_reviews', 'mentoring']
    },
    'architecture_decisions': {
      id: 'architecture_decisions',
      label: 'Architecture Decisions',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '1 week'
    },
    'code_reviews': {
      id: 'code_reviews',
      label: 'Code Reviews & Standards',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '1 week'
    },
    'mentoring': {
      id: 'mentoring',
      label: 'Technical Mentoring',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '1 week'
    },
    'product_strategy': {
      id: 'product_strategy',
      label: 'AI Product Strategy',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '3 weeks',
      prerequisites: ['technical_leadership']
    },
    'team_building': {
      id: 'team_building',
      label: 'Team Building',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '2 weeks',
      prerequisites: ['product_strategy']
    },
    'veteran_advocacy': {
      id: 'veteran_advocacy',
      label: 'Veteran Advocacy',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '2 weeks',
      prerequisites: ['team_building']
    },

    // Phase 5: Industry Impact (12 weeks)
    'phase5': {
      id: 'phase5',
      label: 'Phase 5: Industry Impact',
      nodeType: 'category',
      status: 'locked',
      estimatedTime: '12 weeks',
      childrenIds: ['thought_leadership', 'open_source', 'speaking_writing', 'industry_recognition'],
      prerequisites: ['phase4'],
      description: 'Make lasting impact in the AI industry'
    },
    'thought_leadership': {
      id: 'thought_leadership',
      label: 'Thought Leadership',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '4 weeks',
      childrenIds: ['research_contributions', 'innovation_projects']
    },
    'research_contributions': {
      id: 'research_contributions',
      label: 'Research Contributions',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '3 weeks'
    },
    'innovation_projects': {
      id: 'innovation_projects',
      label: 'Innovation Projects',
      nodeType: 'subTopic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '1 week'
    },
    'open_source': {
      id: 'open_source',
      label: 'Open Source Leadership',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '3 weeks',
      prerequisites: ['thought_leadership']
    },
    'speaking_writing': {
      id: 'speaking_writing',
      label: 'Speaking & Writing',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'intermediate',
      estimatedTime: '3 weeks',
      prerequisites: ['open_source']
    },
    'industry_recognition': {
      id: 'industry_recognition',
      label: 'Industry Recognition',
      nodeType: 'topic',
      status: 'locked',
      difficulty: 'advanced',
      estimatedTime: '2 weeks',
      prerequisites: ['speaking_writing']
    }
  },
  rootItemIds: ['root']
};

// Phase-based color scheme matching the problem statement requirements
export const phaseColors = {
  phase1: '#1f4e79', // Technical Foundations - Deep blue
  phase2: '#7c3aed', // ML/DL & Production - Deep purple
  phase3: '#059669', // Systems & MLOps - Success green
  phase4: '#d97706', // Strategic Leadership - Attention orange
  phase5: '#dc2626', // Industry Impact - Impact red
  root: '#2563eb',   // Primary focus blue
  completed: '#10b981',
  inProgress: '#f59e0b',
  todo: '#6b7280',
  locked: '#374151',
  needsReview: '#ef4444'
};