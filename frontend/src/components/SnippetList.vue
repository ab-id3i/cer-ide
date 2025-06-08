<template>
    <div class="bg-[#252526] shadow-lg overflow-y-auto b font-mono flex flex-col">
        <div class="flex flex-col gap-4 p-4 flex-1">
            <select id="category-select" v-model="selectedCategory" class="bg-gray-800 text-cyan-200 border border-gray-500 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <div v-if="selectedCategory !== 'Actions'">
                <ul class="grid gap-4">
                    <li v-for="snippet in filteredSnippets" :key="snippet.id" draggable="true"
                        @dragstart="(e) => handleDragStart(snippet.code, e)"
                        class="neon-snippet-btn">
                        {{ snippet.title }}
                    </li>
                </ul>
            </div>
            <div v-else>
                <ul class="grid gap-4">
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

