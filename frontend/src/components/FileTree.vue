<template>
  <div class="p-4">
    <div class="space-y-2">
      <template v-for="(item, index) in fileTree" :key="index">
        <!-- Dossier -->
        <div v-if="item.type === 'folder'" class="space-y-2">
          <div class="flex items-center space-x-2 text-cyan-400 cursor-pointer" @click="toggleFolder(item)">
            <Icon :icon="item.isOpen ? 'mdi:folder-open' : 'mdi:folder'" class="w-5 h-5" />
            <span class="font-mono">{{ item.name }}</span>
          </div>
          
          <!-- Contenu du dossier -->
          <div v-if="item.isOpen" class="ml-6 space-y-2">
            <template v-for="(child, childIndex) in item.children" :key="childIndex">
              <!-- Sous-dossier -->
              <div v-if="child.type === 'folder'" class="space-y-2">
                <div class="flex items-center space-x-2 text-cyan-400 cursor-pointer" @click="toggleFolder(child)">
                  <Icon :icon="child.isOpen ? 'mdi:folder-open' : 'mdi:folder'" class="w-5 h-5" />
                  <span class="font-mono">{{ child.name }}</span>
                </div>
                
                <!-- Contenu du sous-dossier -->
                <div v-if="child.isOpen" class="ml-6 space-y-2">
                  <div v-for="(file, fileIndex) in child.children" :key="fileIndex"
                    class="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 cursor-pointer"
                    :class="{ 'text-cyan-400': selectedFile === file.path }"
                    @click="selectFile(file)"
                    @contextmenu.prevent="showContextMenu($event, file)">
                    <Icon icon="mdi:file-document" class="w-5 h-5" />
                    <span class="font-mono">{{ file.name }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Fichier -->
              <div v-else
                class="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 cursor-pointer"
                :class="{ 'text-cyan-400': selectedFile === item.path }"
                @click="selectFile(child)"
                @contextmenu.prevent="showContextMenu($event, child)">
                <Icon icon="mdi:file-document" class="w-5 h-5" />
                <span class="font-mono">{{ child.name }}</span>
              </div>
            </template>
          </div>
        </div>
        
        <!-- Fichier à la racine -->
        <div v-else
          class="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 cursor-pointer"
          :class="{ 'text-cyan-400': selectedFile === item.path }"
          @click="selectFile(item)"
          @contextmenu.prevent="showContextMenu($event, item)">
          <Icon icon="mdi:file-document" class="w-5 h-5" />
          <span class="font-mono">{{ item.name }}</span>
        </div>
      </template>
    </div>

    <!-- Menu contextuel -->
    <div v-if="contextMenu.show" 
      class="fixed bg-[#181c24] rounded shadow-lg py-2 z-50"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }">
      <div class="px-4 py-2 text-cyan-400 font-mono text-sm hover:bg-cyan-400 hover:text-[#181c24] cursor-pointer"
        @click="openFile">
        Ouvrir
      </div>
      <div class="px-4 py-2 text-cyan-400 font-mono text-sm hover:bg-cyan-400 hover:text-[#181c24] cursor-pointer"
        @click="renameFile">
        Renommer
      </div>
      <div class="px-4 py-2 text-red-400 font-mono text-sm hover:bg-red-400 hover:text-[#181c24] cursor-pointer"
        @click="deleteFile">
        Supprimer
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { fileExamples } from '../data/fileExamples';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  isOpen?: boolean;
  children?: FileItem[];
}

const fileTree = ref<FileItem[]>([
  {
    name: 'src',
    type: 'folder',
    path: '/src',
    isOpen: true,
    children: [
      {
        name: 'components',
        type: 'folder',
        path: '/src/components',
        isOpen: true,
        children: [
          { name: 'Header.vue', type: 'file', path: '/src/components/Header.vue' },
          { name: 'Footer.vue', type: 'file', path: '/src/components/Footer.vue' }
        ]
      },
      {
        name: 'views',
        type: 'folder',
        path: '/src/views',
        isOpen: true,
        children: [
          { name: 'Home.vue', type: 'file', path: '/src/views/Home.vue' },
          { name: 'About.vue', type: 'file', path: '/src/views/About.vue' }
        ]
      },
      { name: 'App.vue', type: 'file', path: '/src/App.vue' },
      { name: 'main.ts', type: 'file', path: '/src/main.ts' }
    ]
  },
  { name: 'index.html', type: 'file', path: '/index.html' },
  { name: 'package.json', type: 'file', path: '/package.json' },
  { name: 'tailwind.config.js', type: 'file', path: '/tailwind.config.js' }
]);

const selectedFile = ref<string>('');
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  file: null as FileItem | null
});

function toggleFolder(folder: FileItem) {
  folder.isOpen = !folder.isOpen;
}

function selectFile(file: FileItem) {
  selectedFile.value = file.path;
  // Charger le contenu du fichier dans l'éditeur
  const fileContent = file.path in fileExamples ? fileExamples[file.path as keyof typeof fileExamples] : null;
  if (fileContent) {
    emit('fileSelected', { ...file, content: fileContent });
  } else {
    emit('fileSelected', file);
  }
}

function showContextMenu(event: MouseEvent, file: FileItem) {
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    file
  };
}

function hideContextMenu() {
  contextMenu.value.show = false;
}

function openFile() {
  if (contextMenu.value.file) {
    selectFile(contextMenu.value.file);
  }
  hideContextMenu();
}

function renameFile() {
  // TODO: Implémenter la logique de renommage
  hideContextMenu();
}

function deleteFile() {
  // TODO: Implémenter la logique de suppression
  hideContextMenu();
}

// Gestionnaire pour fermer le menu contextuel lors d'un clic à l'extérieur
function handleClickOutside() {
  if (contextMenu.value.show) {
    hideContextMenu();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const emit = defineEmits(['fileSelected']);
</script>

