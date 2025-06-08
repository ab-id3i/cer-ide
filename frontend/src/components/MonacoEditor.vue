<template>
  <div ref="editorContainer" style="height: 100%;" @dragover.prevent class="border border-gray-500"></div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch, inject } from 'vue';
import { debounce } from 'lodash';
import { userPseudo } from '../composables/useMonaco';

const props = defineProps<{
  modelValue: string;
  userId: string;
  otherCursors: Record<string, any>;
  userColors: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'cursorPositionChange', value: { userId: string; userPseudo: string; position: any }): void;
  (e: 'editorCreated', value: any): void;
}>();

const socket = inject('socket') as any;
const editorContainer = ref<HTMLElement | null>(null);

let editorInstance: any = null;
let monacoEditorLib: any = null;
const decorationsRef = ref<string[]>([]);

// Fonction de log conditionnelle
const log = (...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

// Fonction appelée quand le contenu change
const sendContentChange = debounce((value: any) => {
  log('MonacoEditor socket:', socket);
  log('Sending content change:', value);
  emit('update:modelValue', value);
  if (socket) {
    socket.emit('codeChange', {
      content: value,
      userId: props.userId,
      timestamp: Date.now()
    });
  }
}, 1000); // envoie toutes les 1000ms max

// Ajout du debounce pour la gestion des positions du curseur
const debouncedCursorPositionChange = debounce((position: any) => {
  if (position) {
    emit('cursorPositionChange', {
      userId: props.userId,
      userPseudo: userPseudo.value || 'Inconnu',
      position
    });
  }
}, 1000); // 1000ms de debounce

onMounted(() => {
  const requireScript = document.createElement('script');
  requireScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js';
  requireScript.onload = () => {
    (window as any).require.config({
      paths: {
        vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs'
      }
    });
    (window as any).require(['vs/editor/editor.main'], () => {
      monacoEditorLib = (window as any).monaco;
      editorInstance = monacoEditorLib.editor.create(editorContainer.value, {
        value: props.modelValue,
        language: 'html',
        theme: 'vs-dark',
        automaticLayout: true,
        renderWhitespace: 'boundary', // optionnelle
        minimap: { enabled: false }, // réduit la charge visuelle
      });

      // Ajout du provider d'autocomplétion
      const tailwindClasses = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-500', 'bg-black', 'bg-white',
        'text-white', 'text-black', 'text-red-500', 'text-blue-500', 'text-green-500',
        'text-center', 'text-left', 'text-right', 'text-justify',
        'p-1', 'p-2', 'p-4', 'p-8', 'm-1', 'm-2', 'm-4', 'm-8',
        'px-4', 'py-2', 'mt-4', 'mb-4', 'ml-4', 'mr-4',
        'w-full', 'w-1/2', 'w-1/3', 'w-1/4', 'h-full', 'h-screen',
        'rounded', 'rounded-full', 'border', 'border-2', 'border-gray-500',
        'flex', 'grid', 'inline-block', 'block', 'hidden',
        'absolute', 'relative', 'fixed', 'sticky',
        'shadow', 'shadow-md', 'shadow-lg',
        'container', 'mx-auto', 'overflow-hidden', 'z-10', 'cursor-pointer'
      ];

      monacoEditorLib.languages.registerCompletionItemProvider('html', {
        provideCompletionItems: () => {
          const suggestions = tailwindClasses.map(className => ({
            label: className,
            kind: monacoEditorLib.languages.CompletionItemKind.Keyword,
            insertText: className
          }));
          return { suggestions };
        }
      });

      emit('editorCreated', editorInstance);

      editorInstance.onDidChangeModelContent(() => {
        const value = editorInstance.getValue();
        log('MonacoEditor socket:', socket);
        log('Editor content changed:', value);
        // Émettre l'événement de mise à jour
        // emit('update:modelValue', value);
        // Envoyer directement au serveur via le socket
        if (socket) {
          sendContentChange(value);
        }
      });
      editorInstance.onDidChangeCursorPosition(() => {
        const position = editorInstance.getPosition();
        debouncedCursorPositionChange(position);
      });
    });
  };
  document.body.appendChild(requireScript);
});

// 🔥 Ajoute un watcher pour écouter les changements côté parent
watch(
  () => props.modelValue,
  (newVal) => {
    if (editorInstance && newVal !== editorInstance.getValue()) {
      // Sauvegarder la position actuelle du curseur
      const currentPosition = editorInstance.getPosition();
      
      // Mettre à jour le contenu
      editorInstance.setValue(newVal);
      
      // Restaurer la position du curseur si elle existe
      if (currentPosition) {
        editorInstance.setPosition(currentPosition);
      }
    }
  }
);

watch(
  () => props.otherCursors,
  (newCursors) => {
    if (!editorInstance) return;
    const decorations: any[] = [];
    Object.entries(newCursors).forEach(([otherUserId, cursorData]) => {
      if (!cursorData || !cursorData.position) return; // Vérification supplémentaire
      const color = props.userColors[otherUserId] || 'red';
      decorations.push({
        range: new monacoEditorLib.Range(
          cursorData.position.lineNumber,
          cursorData.position.column,
          cursorData.position.lineNumber,
          cursorData.position.column
        ),
        options: {
          className: `remote-cursor-${otherUserId}`,
          isWholeLine: true,
          hoverMessage: { value: `👤 ${cursorData.userPseudo}` }
        }
      });
      // Injecter dynamiquement la couleur si elle n'existe pas déjà
      if (!document.querySelector(`#remote-cursor-style-${otherUserId}`)) {
        const style = document.createElement('style');
        style.id = `remote-cursor-style-${otherUserId}`;
        // Récupérer la première lettre du pseudo (ou 'U' par défaut)
        const initial = (cursorData.userPseudo && cursorData.userPseudo.length > 0)
          ? cursorData.userPseudo[0].toUpperCase()
          : 'U';
        style.innerHTML = `
          .remote-cursor-${otherUserId} {
            border-left: 15px solid ${color} !important;
            position: relative;
            cursor: pointer !important;
          }
          .remote-cursor-${otherUserId}::after {
            content: '${initial}';
            position: absolute;
            left: -10px;
            top: -4px;
            z-index: 1000000;
            width: 16px;
            height: 16px;
            background: ${color};
            color: #fff;
            font-size: 11px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-weight: bold;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 4px rgba(0,0,0,0.15);
            z-index: 10;
            border: 1.5px solid #222;
            cursor: pointer;
          }
        `;
        document.head.appendChild(style);
      }
    });
    decorationsRef.value = editorInstance.deltaDecorations(
      decorationsRef.value,
      decorations
    );
  },
  { deep: true }
);
</script>
<style>
.mtkw{
  cursor: pointer !important;
}
</style>
