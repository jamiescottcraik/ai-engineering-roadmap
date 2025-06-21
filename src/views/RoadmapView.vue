<template>
  <div class="roadmap-container">
    <header class="roadmap-header">
      <h1>AI Leadership Engineering Roadmap</h1>
      <div class="progress-summary">
        <div class="current-phase">
          <span class="phase-label">Current Phase</span>
          <h2>{{ currentPhase.title }}</h2>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: currentPhase.progress + '%' }"
            ></div>
          </div>
          <span class="progress-text">{{ currentPhase.progress }}% Complete</span>
        </div>
      </div>
    </header>

    <div class="roadmap-canvas" ref="canvas">
      <svg :width="canvasWidth" :height="canvasHeight">
        <!-- Phase containers -->
        <g v-for="(phase, index) in roadmap.phases" :key="phase.id">
          <rect 
            :x="phase.x" 
            :y="phase.y" 
            :width="phase.width" 
            :height="phase.height"
            :class="['phase-container', phase.status]"
          />
          <text 
            :x="phase.x + 20" 
            :y="phase.y + 30" 
            class="phase-title"
          >
            {{ phase.title }}
          </text>
          
          <!-- Nodes within phase -->
          <g v-for="node in phase.nodes" :key="node.id">
            <RoadmapNode 
              :node="node"
              :phase-color="phase.color"
              @click="openNodeDetails"
            />
          </g>
        </g>
        
        <!-- Connection lines -->
        <g class="connections">
          <path
            v-for="connection in connections"
            :key="connection.id"
            :d="connection.path"
            class="connection-line"
          />
        </g>
      </svg>
    </div>

    <!-- Node Details Modal -->
    <NodeDetailsModal 
      v-if="selectedNode"
      :node="selectedNode"
      @close="selectedNode = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import RoadmapNode from '@/components/RoadmapNode.vue'
import NodeDetailsModal from '@/components/NodeDetailsModal.vue'
import { loadRoadmapData } from '@/services/roadmapService'

const roadmap = ref({})
const selectedNode = ref(null)
const canvasWidth = ref(1200)
const canvasHeight = ref(800)

const currentPhase = computed(() => {
  return roadmap.value.phases?.find(phase => phase.status === 'in_progress') || {}
})

const connections = computed(() => {
  // Generate SVG paths for node connections
  return [] // Will implement connection logic
})

onMounted(async () => {
  roadmap.value = await loadRoadmapData()
})

function openNodeDetails(node) {
  selectedNode.value = node
}
</script>

<style scoped>
.roadmap-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
}

.roadmap-header {
  padding: 2rem;
  text-align: center;
  background: rgba(0,0,0,0.3);
}

.progress-summary {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.current-phase {
  background: rgba(31, 78, 121, 0.2);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #1f4e79;
  min-width: 300px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  margin: 1rem 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4b8a36, #1f4e79);
  transition: width 0.3s ease;
}

.roadmap-canvas {
  padding: 2rem;
  overflow: auto;
}

.phase-container {
  fill: rgba(255,255,255,0.05);
  stroke: rgba(255,255,255,0.2);
  stroke-width: 2;
  rx: 12;
}

.phase-container.in_progress {
  fill: rgba(31, 78, 121, 0.1);
  stroke: #1f4e79;
}

.phase-container.completed {
  fill: rgba(75, 138, 54, 0.1);
  stroke: #4b8a36;
}

.phase-title {
  fill: white;
  font-size: 16px;
  font-weight: bold;
}

.connection-line {
  stroke: rgba(255,255,255,0.3);
  stroke-width: 2;
  fill: none;
}
</style>