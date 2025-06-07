<template>
    <div class="p-4 bg-black shadow-lg h-full overflow-y-auto  border-cyan-400 font-mono">
        <div class="grid grid-cols-2 gap-4">
            <!-- Colonne Structure -->
            <div>
                <h4 class="text-md font-semibold mb-2 text-cyan-300 uppercase tracking-wide">Structures</h4>
                <ul class="space-y-2">
                    <li v-for="(snippet, index) in htmlSnippets" :key="'html-' + index" draggable="true"
                        @dragstart="(e) => handleDragStart(snippet.code, e)"
                        class="neon-snippet-btn">
                        {{ snippet.title }}
                    </li>
                </ul>
            </div>

            <!-- Colonne Actions -->
            <div>
                <h4 class="text-md font-semibold mb-2 text-cyan-300 uppercase tracking-wide">Actions</h4>
                <ul class="space-y-2">
                    <li v-for="(action, index) in actionSnippets" :key="'action-' + index" draggable="true"
                        @dragstart="(e) => handleDragStart(action.code, e)"
                        class="neon-snippet-btn">
                        {{ action.title }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { htmlSnippets, actionSnippets } from '../data/snippets';

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
.drop-shadow-neon {
  text-shadow: 0 0 6px #00fff7, 0 0 12px #00fff7;
}
</style>
