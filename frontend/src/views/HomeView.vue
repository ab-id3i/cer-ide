<template>
  <div class="h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="bg-[#181c24] font-mono border-b-1 border-gray-500 shadow-lg px-6 py-3 flex items-center justify-between relative z-10">
      <div class="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo iD3i CodeLab" class="h-8 w-8 inline-block align-middle" />
        <span class="font-extrabold text-cyan-400 tracking-widest text-lg uppercase drop-shadow-neon">iD3i CodeLab</span>
        <span v-if="userPseudo" class="ml-4 font-extrabold text-cyan-400 tracking-widest text-lg uppercase drop-shadow-neon">- {{ userPseudo }}</span>
      </div>
      <!-- Nom du fichier sélectionné -->
      <div class="absolute left-1/2 transform -translate-x-1/2 text-gray-400 font-mono text-sm truncate max-w-md">
        {{ selectedFile }}
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
        <aside v-if="showSnippets" class="w-80 h-full bg-[#252526] shadow-lg border-t  border-gray-500 flex flex-col z-40">
          <div class="bg-[#252526] flex items-center justify-between px-4 py-2 border-b border-gray-500">
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
        <aside v-if="showFileTree" class="w-80 h-full bg-[#252526] border-t border-l border-gray-500 shadow-lg flex flex-col z-40">
          <div class="bg-[#252526] flex items-center justify-between px-4 py-2 border-b border-gray-500">
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
import { ref, inject, onMounted } from 'vue';
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
import { fileExamples } from '../data/fileExamples';

const socket = inject('socket') as any;
const userId = uuidv4();

const showSnippets = ref(false);
const showFileTree = ref(false);
const layoutMode = ref<'vertical' | 'horizontal'>('horizontal');
const { editorInstance, handleEditorCreated } = useMonaco();
const { otherCursors, userColors, handleCursorPositionChange } = useCursors(userId, socket);
const { code } = useCodeSync(socket);
const { handleSnippetDrag, handleDrop } = useSnippet(editorInstance, code);

// Ajout de la gestion du fichier sélectionné
const selectedFile = ref<string>('/src/views/Home.vue');
const isVueFile = ref(false);
const isJsonFile = ref(false);

// Fonction pour gérer la sélection d'un fichier
function handleFileSelected(file: any) {
  selectedFile.value = file.path;
  if (file.content) {
    code.value = file.content;
  }
  
  // Déterminer le type de fichier pour le preview
  isVueFile.value = file.path.endsWith('.vue');
  isJsonFile.value = file.path.endsWith('.json');
  
  // Mettre à jour le langage de l'éditeur
  if (editorInstance.value) {
    const language = file.path.endsWith('.vue') ? 'html' :
                    file.path.endsWith('.json') ? 'json' :
                    file.path.endsWith('.ts') ? 'typescript' :
                    'plaintext';
    editorInstance.value.updateOptions({ language });
  }
}

// Sélectionner le fichier Home.vue par défaut au chargement
onMounted(() => {
  const homeFile = {
    path: '/src/views/Home.vue',
    content: fileExamples['/src/views/Home.vue']
  };
  handleFileSelected(homeFile);
});

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

</script>
