<template>
  <div class="json-node" :style="{ marginLeft: level * 20 + 'px' }">
    <!-- Objet -->
    <div v-if="isObject" class="json-object">
      <div class="flex items-center cursor-pointer" @click="toggle">
        <span class="text-gray-400">{{ isExpanded ? '▼' : '▶' }}</span>
        <span class="text-cyan-400 ml-1">{{ key ? `"${key}": ` : '' }}</span>
        <span class="text-gray-400">{{ isExpanded ? '{' : '{...}' }}</span>
      </div>
      
      <div v-if="isExpanded" class="mt-1">
        <template v-for="(value) in data" :key="String(k)">
          <JsonNode 
            :data="value" 
            :level="level + 1"
            :expanded="expanded"
            @toggle="$emit('toggle', $event)"
          />
        </template>
        <div class="text-gray-400" :style="{ marginLeft: level * 20 + 'px' }">}</div>
      </div>
    </div>

    <!-- Tableau -->
    <div v-else-if="isArray" class="json-array">
      <div class="flex items-center cursor-pointer" @click="toggle">
        <span class="text-gray-400">{{ isExpanded ? '▼' : '▶' }}</span>
        <span class="text-cyan-400 ml-1">{{ key ? `"${key}": ` : '' }}</span>
        <span class="text-gray-400">{{ isExpanded ? '[' : '[...]' }}</span>
      </div>
      
      <div v-if="isExpanded" class="mt-1">
        <template v-for="(item) in data" :key="String(index)">
          <JsonNode 
            :data="item" 
            :level="level + 1"
            :expanded="expanded"
            @toggle="$emit('toggle', $event)"
          />
        </template>
        <div class="text-gray-400" :style="{ marginLeft: level * 20 + 'px' }">]</div>
      </div>
    </div>

    <!-- Valeur simple -->
    <div v-else class="json-value">
      <span class="text-cyan-400" v-if="key">"{{ key }}": </span>
      <span :class="valueClass">{{ formatValue(data) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any;
  key?: string;
  level: number;
  expanded: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle', path: string): void;
}>();

const isObject = computed(() => {
  return typeof props.data === 'object' && props.data !== null && !Array.isArray(props.data);
});

const isArray = computed(() => {
  return Array.isArray(props.data);
});

const isExpanded = computed(() => {
  return props.expanded;
});

const valueClass = computed(() => {
  const value = props.data;
  if (typeof value === 'string') return 'text-green-400';
  if (typeof value === 'number') return 'text-yellow-400';
  if (typeof value === 'boolean') return 'text-purple-400';
  if (value === null) return 'text-gray-400';
  return 'text-white';
});

function formatValue(value: any): string {
  if (typeof value === 'string') return `"${value}"`;
  if (value === null) return 'null';
  return String(value);
}

function toggle() {
  emit('toggle', props.key || '');
}
</script>

<style scoped>
.json-node {
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
  line-height: 1.5;
}
</style> 