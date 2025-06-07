<template>
    <div class="bg-black shadow-lg overflow-y-auto border-cyan-400 font-mono flex flex-col">
        <div class="flex flex-col gap-4 p-4 flex-1">
            <select id="category-select" v-model="selectedCategory" class="bg-[#23272e] text-cyan-200 border border-cyan-400 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <div v-if="selectedCategory !== 'Actions'">
                <ul class="grid grid-cols-2 gap-4">
                    <li v-for="snippet in filteredSnippets" :key="snippet.id" draggable="true"
                        @dragstart="(e) => handleDragStart(snippet.code, e)"
                        class="neon-snippet-btn">
                        {{ snippet.title }}
                    </li>
                </ul>
            </div>
            <div v-else>
                <ul class="grid grid-cols-1 gap-4">
                    <li v-for="snippet in filteredSnippets" :key="snippet.id" draggable="true"
                        @dragstart="(e) => handleDragStart(snippet.code, e)"
                        class="neon-snippet-btn">
                        {{ snippet.title }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { SNIPPETS, SNIPPET_CATEGORIES } from '../data/snippets';
import { defineEmits } from 'vue';

defineEmits(['close']);

const categories = SNIPPET_CATEGORIES;
const selectedCategory = ref(categories[0]);

const filteredSnippets = computed(() =>
  SNIPPETS.filter(s => s.category === selectedCategory.value)
);

function handleDragStart(code: string, event: DragEvent) {
  event.dataTransfer?.setData('text/plain', code);
}
</script>

<style scoped>
.neon-snippet-btn {
  background: #23272e;
  color: #00fff7;
  border: 2px solid #00fff7;
  border-radius: 0.5rem;
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
  font-weight: bold;
  letter-spacing: 0.05em;
  box-shadow: 0 0 8px #00fff7, 0 0 16px #00fff7, 0 0 2px #00fff7 inset;
  padding: 0.75rem 1rem;
  cursor: grab;
  transition: all 0.18s;
  user-select: none;
}
.neon-snippet-btn:hover {
  background: #00fff7;
  color: #181c24;
  box-shadow: 0 0 16px #00fff7, 0 0 32px #00fff7;
}
.neon-close-btn {
  background: transparent;
  color: #00fff7;
  border: 2px solid #00fff7;
  border-radius: 0.375rem;
  font-size: 1.25rem;
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
  font-weight: bold;
  box-shadow: 0 0 8px #00fff7, 0 0 16px #00fff7;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  transition: all 0.18s;
}
.neon-close-btn:hover {
  background: #00fff7;
  color: #181c24;
  box-shadow: 0 0 16px #00fff7, 0 0 32px #00fff7;
}
.drop-shadow-neon {
  text-shadow: 0 0 6px #00fff7, 0 0 12px #00fff7;
}
</style>
