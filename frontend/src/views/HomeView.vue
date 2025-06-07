<template>
  <div class="h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
      <span class="font-bold">Mon éditeur collaboratif</span>
      <div class="flex items-center gap-2">
        <button @click="formatCode" class="bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded text-white">
          Réindenter
        </button>
        <button @click="layoutMode = layoutMode === 'vertical' ? 'horizontal' : 'vertical'" class="bg-green-500 hover:bg-green-600 px-3 py-1 rounded">
          {{ layoutMode === 'vertical' ? 'Vue côte à côte' : 'Vue haut/bas' }}
        </button>
        <button @click="showSnippets = !showSnippets" class="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">
          {{ showSnippets ? 'Fermer les snippets' : 'Snippets' }}
        </button>
      </div>
    </nav>

    <!-- Contenu principal avec sidebar dockée -->
    <div class="flex flex-1 min-h-0">
      <!-- Main content -->
      <div :class="layoutMode === 'vertical' ? 'flex-1 flex flex-col min-w-0' : 'flex-1 flex flex-row min-w-0'">
        <div v-if="layoutMode === 'vertical'" class="flex-1 flex flex-col min-h-0">
          <div @drop.prevent="handleDrop" @dragover.prevent class="flex-1 min-h-0">
            <MonacoEditor v-model="code" @editorCreated="handleEditorCreated" :userId="userId"
              @cursorPositionChange="handleCursorPositionChange" :otherCursors="otherCursors" :userColors="userColors" />
          </div>
          <div class="h-1 bg-gray-200"></div>
          <div class="flex-1 min-h-0">
            <PreviewIframe :code="code" :userId="userId" />
          </div>
        </div>
        <template v-else>
          <div class="flex-1 min-w-0">
            <PreviewIframe :code="code" :userId="userId" />
          </div>
          <div class="w-1 bg-gray-200"></div>
          <div @drop.prevent="handleDrop" @dragover.prevent class="flex-1 min-w-0">
            <MonacoEditor v-model="code" @editorCreated="handleEditorCreated" :userId="userId"
              @cursorPositionChange="handleCursorPositionChange" :otherCursors="otherCursors" :userColors="userColors" />
          </div>
        </template>
      </div>
      <!-- Sidebar dockée à droite -->
      <transition name="slide">
        <aside v-if="showSnippets" class="w-80 h-full bg-white border-l border-gray-200 shadow-lg flex flex-col z-40">
          <div class="flex items-center justify-between px-4 py-2 border-b">
            <span class="font-semibold">Snippets</span>
            <button @click="showSnippets = false" class="text-gray-500 hover:text-gray-800">✕</button>
          </div>
          <div class="flex-1 overflow-y-auto">
            <SnippetList @dragstart="handleSnippetDrag" />
          </div>
        </aside>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import MonacoEditor from '../components/MonacoEditor.vue';
import PreviewIframe from '../components/PreviewIframe.vue';
import SnippetList from '../components/SnippetList.vue';
import { v4 as uuidv4 } from 'uuid';
import { useCursors } from '../composables/useCursors';
import { useCodeSync } from '../composables/useCodeSync';
import { useMonaco } from '../composables/useMonaco';
import { useSnippet } from '../composables/useSnippet';

const socket = inject('socket') as any;
const userId = uuidv4();

const showSnippets = ref(false);
const layoutMode = ref<'vertical' | 'horizontal'>('vertical');
const { editorInstance, handleEditorCreated } = useMonaco();
const { otherCursors, userColors, handleCursorPositionChange } = useCursors(userId, socket);
const { code } = useCodeSync(socket);
const { handleSnippetDrag, handleDrop } = useSnippet(editorInstance, code);

function formatCode() {
  if (editorInstance.value) {
    editorInstance.value.getAction('editor.action.formatDocument').run();
  }
}
</script>

<style>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.2s, opacity 0.2s;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
