<template>
  <div class="h-full w-full bg-[#181c24] p-4 overflow-auto">
    <div class="max-w-4xl mx-auto">
      <div class="bg-[#23272e] rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-cyan-400">JSON Preview</h2>
          <div class="flex space-x-2">
            <button @click="toggleExpandAll" class="px-3 py-1 text-sm bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors">
              {{ isAllExpanded ? 'Tout réduire' : 'Tout développer' }}
            </button>
            <button @click="copyToClipboard" class="px-3 py-1 text-sm bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors">
              Copier
            </button>
          </div>
        </div>
        
        <div class="font-mono text-sm">
          <JsonNode 
            :data="parsedJson" 
            :expanded="isAllExpanded"
            :level="0"
            @toggle="toggleNode"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import JsonNode from '../components/JsonNode.vue';

const props = defineProps<{
  code: string;
}>();

const isAllExpanded = ref(false);
const expandedNodes = ref(new Set<string>());

// Parser le JSON avec gestion d'erreur
const parsedJson = computed(() => {
  try {
    return JSON.parse(props.code);
  } catch (e) {
    return { error: 'Invalid JSON format' };
  }
});

function toggleExpandAll() {
  isAllExpanded.value = !isAllExpanded.value;
}

function toggleNode(path: string) {
  if (expandedNodes.value.has(path)) {
    expandedNodes.value.delete(path);
  } else {
    expandedNodes.value.add(path);
  }
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.code);
    // TODO: Ajouter une notification de succès
  } catch (err) {
    // TODO: Ajouter une notification d'erreur
    console.error('Failed to copy:', err);
  }
}
</script>

<style scoped>
.font-mono {
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
}
</style> 