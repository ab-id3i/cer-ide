<script setup lang="ts">
import { htmlSnippets, actionSnippets } from '../data/snippets';

function handleDragStart(code: string, event: DragEvent) {
    event.dataTransfer?.setData('text/plain', code);
}
</script>

<template>
    <div class="p-4 bg-white rounded-lg shadow-md h-full overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">Snippets</h3>
        <div class="grid grid-cols-2 gap-4">
            <!-- Colonne Structure -->
            <div>
                <h4 class="text-md font-semibold mb-2">Structures</h4>
                <ul class="space-y-2">
                    <li v-for="(snippet, index) in htmlSnippets" :key="'html-' + index" draggable="true"
                        @dragstart="(e) => handleDragStart(snippet.code, e)"
                        class="bg-gray-100 hover:bg-gray-200 transition cursor-grab px-4 py-3 rounded-lg shadow-sm">
                        {{ snippet.title }}
                    </li>
                </ul>
            </div>

            <!-- Colonne Actions -->
            <div>
                <h4 class="text-md font-semibold mb-2">Actions</h4>
                <ul class="space-y-2">
                    <li v-for="(action, index) in actionSnippets" :key="'action-' + index" draggable="true"
                        @dragstart="(e) => handleDragStart(action.code, e)"
                        class="bg-gray-100 hover:bg-gray-200 transition cursor-grab px-4 py-3 rounded-lg shadow-sm">
                        {{ action.title }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
