<template>
  <div class="h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="bg-[#181c24] font-mono border-b-4 border-cyan-400 shadow-lg px-6 py-3 flex items-center justify-between relative z-10">
      <div class="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo iD3i CodeLab" class="h-8 w-8 inline-block align-middle" />
        <span class="font-extrabold text-cyan-400 tracking-widest text-lg uppercase drop-shadow-neon">iD3i CodeLab</span>
        <span v-if="userPseudo" class="ml-4 font-extrabold text-cyan-400 tracking-widest text-lg uppercase drop-shadow-neon">- {{ userPseudo }}</span>
      </div>
      <div class="flex items-center gap-4">
        <button @click="undo" class="neon-btn neon-blue" title="Annuler (Ctrl+Z)">
          <Icon icon="mdi:undo" width="22" height="22" />
        </button>
        <button @click="redo" class="neon-btn neon-blue" title="Rétablir (Ctrl+Y)">
          <Icon icon="mdi:redo" width="22" height="22" />
        </button>
        <button @click="formatCode" class="neon-btn neon-purple" title="Réindenter">
          <Icon icon="mdi:format-indent-increase" width="22" height="22" />
        </button>
        <button @click="layoutMode = layoutMode === 'vertical' ? 'horizontal' : 'vertical'" class="neon-btn neon-green" :title="layoutMode === 'vertical' ? 'Vue côte à côte' : 'Vue haut/bas'">
          <Icon :icon="layoutMode === 'vertical' ? 'mdi:view-split-horizontal' : 'mdi:view-split-vertical'" width="22" height="22" />
        </button>
        <button @click="showSnippets = !showSnippets" class="neon-btn neon-blue" title="Snippets">
          <Icon icon="mdi:code-braces" width="22" height="22" />
        </button>
        <button @click="showFileTree = !showFileTree" class="neon-btn neon-blue" title="Arborescence de fichiers">
          <Icon icon="mdi:file-tree" width="22" height="22" />
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
            <VuePreview v-if="isVueFile" :code="code" />
            <JsonPreview v-else-if="isJsonFile" :code="code" />
            <PreviewIframe v-else :code="code" :userId="userId" />
          </div>
        </div>
        <template v-else>
          <div class="flex-1 min-w-0">
            <VuePreview v-if="isVueFile" :code="code" />
            <JsonPreview v-else-if="isJsonFile" :code="code" />
            <PreviewIframe v-else :code="code" :userId="userId" />
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
        <aside v-if="showSnippets" class="w-80 h-full bg-black border-l border-gray-200 shadow-lg flex flex-col z-40">
          <div class=" bg-black flex items-center justify-between px-4 py-2 border-b">
            <h3 class="text-lg font-extrabold text-cyan-400 tracking-widest uppercase drop-shadow-neon">Snippets</h3>
            <button @click="showSnippets = false" class="text-cyan-400 drop-shadow-neon">✕</button>
          </div>
          <div class="flex-1 overflow-y-auto">
            <SnippetList @dragstart="handleSnippetDrag" />
          </div>
        </aside>
      </transition>
      <!-- Nouveau sidepanel pour l'arborescence de fichiers -->
      <transition name="slide">
        <aside v-if="showFileTree" class="w-80 h-full bg-black border-l border-gray-200 shadow-lg flex flex-col z-40">
          <div class="bg-black flex items-center justify-between px-4 py-2 border-b">
            <h3 class="text-lg font-extrabold text-cyan-400 tracking-widest uppercase drop-shadow-neon">Arborescence</h3>
            <button @click="showFileTree = false" class="text-cyan-400 drop-shadow-neon">✕</button>
          </div>
          <div class="flex-1 overflow-y-auto">
            <FileTree @fileSelected="handleFileSelected" />
          </div>
        </aside>
      </transition>
    </div>

    <NotificationToast
      :message="notification.message"
      :type="notification.type"
      :show="notification.show"
      @close="notification.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
// @ts-ignore
import { Icon } from '@iconify/vue';
import MonacoEditor from '../components/MonacoEditor.vue';
import PreviewIframe from '../components/PreviewIframe.vue';
import VuePreview from '../components/VuePreview.vue';
import JsonPreview from '../components/JsonPreview.vue';
import SnippetList from '../components/SnippetList.vue';
import FileTree from '../components/FileTree.vue';
import NotificationToast from '../components/NotificationToast.vue';
import { v4 as uuidv4 } from 'uuid';
import { useCursors } from '../composables/useCursors';
import { useCodeSync } from '../composables/useCodeSync';
import { useMonaco, userPseudo } from '../composables/useMonaco';
import { useSnippet } from '../composables/useSnippet';

const socket = inject('socket') as any;
const userId = uuidv4();

const showSnippets = ref(false);
const showFileTree = ref(false);
const layoutMode = ref<'vertical' | 'horizontal'>('horizontal');
const { editorInstance, handleEditorCreated } = useMonaco();
const { otherCursors, userColors, handleCursorPositionChange } = useCursors(userId, socket);
const { code, currentVersion, isUpdating } = useCodeSync(socket);
const { handleSnippetDrag, handleDrop } = useSnippet(editorInstance, code);

const notification = ref({ show: false, message: '', type: 'success' as 'success' | 'error' | 'warning' });
function showNotification(message: string, type: 'success' | 'error' | 'warning' = 'success', duration = 3000) {
  notification.value = { show: true, message, type };
  setTimeout(() => notification.value.show = false, duration);
}

function formatCode() {
  if (editorInstance.value) {
    editorInstance.value.getAction('editor.action.formatDocument').run();
    showNotification('Code réindenté avec succès', 'success');
  }
}
function undo() {
  if (editorInstance.value) {
    // editorInstance.value.getAction('undo').run();
    showNotification('En cours de développement', 'warning', 2000);
  }
}
function redo() {
  if (editorInstance.value) {
    // editorInstance.value.getAction('redo').run();
    showNotification('En cours de développement', 'warning', 2000);
  }
}

// Gestionnaire pour le fichier sélectionné
function handleFileSelected(file: any) {
  if (file.content) {
    code.value = file.content;
    // Déterminer le type de fichier
    isVueFile.value = file.name.endsWith('.vue');
    isJsonFile.value = file.name.endsWith('.json');
  }
}

const isVueFile = ref(false);
const isJsonFile = ref(false);

</script>

<style>
/* Neon effect for buttons */
.neon-btn {
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: bold;
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  box-shadow: 0 0 8px #00fff7, 0 0 8px #00fff7, 0 0 2px #00fff7 inset;
  color: #fff;
  background: #23272e;
  transition: all 0.18s;
  position: relative;
  z-index: 1;
}
.neon-btn:active {
  transform: scale(0.97);
}
.neon-purple {
  background: #2d1a4a;
  box-shadow: 0 0 8px #a259ff, 0 0 8px #a259ff, 0 0 2px #a259ff inset;
  border-color: #a259ff;
}
.neon-purple:hover {
  background: #a259ff;
  color: #181c24;
  box-shadow: 0 0 8px #a259ff, 0 0 32px #a259ff;
}
.neon-green {
  background: #1a4a2d;
  box-shadow: 0 0 8px #00ffae, 0 0 8px #00ffae, 0 0 2px #00ffae inset;
  border-color: #00ffae;
}
.neon-green:hover {
  background: #00ffae;
  color: #181c24;
  box-shadow: 0 0 8px #00ffae, 0 0 32px #00ffae;
}
.neon-blue {
  background: #1a274a;
  box-shadow: 0 0 8px #00fff7, 0 0 8px #00fff7, 0 0 2px #00fff7 inset;
  border-color: #00fff7;
}
.neon-blue:hover {
  background: #00fff7;
  color: #181c24;
  box-shadow: 0 0 8px #00fff7, 0 0 32px #00fff7;
}
/* Neon text shadow for title */
.drop-shadow-neon {
  text-shadow: 0 0 6px #00fff7, 0 0 12px #00fff7;
}
.slide-enter-active, .slide-leave-active {
  transition: transform 0.2s, opacity 0.2s;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
