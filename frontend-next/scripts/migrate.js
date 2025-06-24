#!/usr/bin/env node

/**
 * Migration runner script - converts legacy roadmap.json to modern format
 */

const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');

const LEGACY_PATH = join(__dirname, '../../frontend/public/data/roadmap.json');
const OUTPUT_PATH = join(__dirname, '../content');

async function main() {
  try {
    console.log('🚀 Starting roadmap migration...');
    console.log(`📂 Reading from: ${LEGACY_PATH}`);
    console.log(`📁 Output to: ${OUTPUT_PATH}`);

    if (!existsSync(LEGACY_PATH)) {
      throw new Error(`Legacy roadmap file not found at: ${LEGACY_PATH}`);
    }

    console.log('📖 Reading legacy roadmap data...');
    const legacyData = JSON.parse(readFileSync(LEGACY_PATH, 'utf8'));
    console.log(`✅ Loaded legacy data with ${legacyData.phases?.length || 0} phases`);
    
    if (!existsSync(OUTPUT_PATH)) {
      mkdirSync(OUTPUT_PATH, { recursive: true });
      console.log(`📁 Created output directory: ${OUTPUT_PATH}`);
    }

    console.log('�� Converting to modern format...');
    const modernRoadmap = {
      metadata: {
        title: legacyData.metadata.title,
        description: legacyData.metadata.description,
        version: '2.0.0',
        createdAt: legacyData.metadata.startDate,
        updatedAt: legacyData.metadata.lastUpdated,
        totalNodes: 0,
        estimatedHours: legacyData.metadata.totalHours,
        phases: legacyData.phases.map(p => p.id)
      },
      nodes: [],
      checkpoints: legacyData.checkpoints.map((checkpoint, index) => ({
        id: checkpoint.id,
        title: checkpoint.title,
        description: checkpoint.description,
        requiredNodes: [checkpoint.nodeId],
        criteria: checkpoint.criteria,
        phase: checkpoint.nodeId.match(/^(p\d+)/)?.[1] || 'phase1',
        order: index + 1
      }))
    };

    // Convert nodes
    let nodeIndex = 0;
    for (const phase of legacyData.phases) {
      console.log(`📝 Converting phase: ${phase.title}`);
      
      for (let i = 0; i < phase.nodes.length; i++) {
        const legacyNode = phase.nodes[i];
        const typeMapping = { 'learn': 'concept', 'practice': 'practice', 'portfolio': 'project' };
        
        const modernNode = {
          id: legacyNode.id,
          title: legacyNode.title,
          type: typeMapping[legacyNode.type] || 'concept',
          phase: phase.id,
          position: { x: (i % 3) * 250 + 100, y: Math.floor(i / 3) * 150 + 100 },
          prerequisites: i === 0 ? [] : [phase.nodes[i - 1]?.id].filter(Boolean),
          estimatedHours: legacyNode.estimatedHours,
          difficulty: 'intermediate',
          description: legacyNode.description,
          learningObjectives: legacyNode.completionCriteria,
          content: {
            resources: (legacyNode.resources || []).map((res, idx) => ({
              id: `resource_${idx}`,
              title: res.title,
              type: res.type.toLowerCase(),
              url: res.url,
              description: res.description,
              estimatedTime: res.estimatedTime,
              difficulty: res.difficulty.toLowerCase().includes('beginner') ? 'beginner' : 
                         res.difficulty.toLowerCase().includes('advanced') ? 'advanced' : 'intermediate',
              isOptional: res.category === 'optional'
            }))
          },
          progress: {
            status: !legacyNode.isUnlocked ? 'locked' : 
                   legacyNode.progress === 0 ? 'available' :
                   legacyNode.progress === 100 ? 'completed' : 'in_progress',
            masteryLevel: legacyNode.progress,
            reviewCount: 0
          },
          metadata: {
            tags: [phase.title.toLowerCase().replace(/\s+/g, '-')],
            skills: legacyNode.keyTopics,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };
        
        modernRoadmap.nodes.push(modernNode);
      }
      nodeIndex += phase.nodes.length;
    }

    modernRoadmap.metadata.totalNodes = modernRoadmap.nodes.length;

    console.log('💾 Writing roadmap.json...');
    writeFileSync(
      join(OUTPUT_PATH, 'roadmap.json'),
      JSON.stringify(modernRoadmap, null, 2)
    );

    console.log('✅ Migration completed successfully!');
    console.log(`📊 Created ${modernRoadmap.nodes.length} nodes across ${legacyData.phases.length} phases`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

main();
