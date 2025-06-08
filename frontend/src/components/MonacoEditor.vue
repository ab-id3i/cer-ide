<template>
  <div ref="editorContainer" style="height: 100%; border: 1px solid #ccc;" @dragover.prevent></div>
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
}, 5000); // envoie toutes les 500ms max

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
        emit('update:modelValue', value);
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
        style.innerHTML = `
          .remote-cursor-${otherUserId} {
            border-left: 10px solid ${color} !important;
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


<style scoped>
/* Styles pour les curseurs distants */
.remote-cursor-style-1 {
  border-left: 10px solid red !important;
}

.remote-cursor-style-2 {
  border-left: 10px solid blue !important;
}

.remote-cursor-style-3 {
  border-left: 10px solid green !important;
}

.remote-cursor-style-4 {
  border-left: 10px solid yellow !important;
}

.remote-cursor-style-5 {
  border-left: 10px solid purple !important;
}

.remote-cursor-style-6 {
  border-left: 10px solid pink !important;
}

.remote-cursor-style-7 {
  border-left: 10px solid gray !important;
}

.remote-cursor-style-8 {
  border-left: 10px solid black !important;
}

.remote-cursor-style-9 {
  border-left: 10px solid white !important;
}

.remote-cursor-style-10 {
  border-left: 10px solid orange !important;
}

.remote-cursor-style-11 {
  border-left: 10px solid teal !important;
}

.remote-cursor-style-12 {
  border-left: 10px solid lime !important;
}

.remote-cursor-style-13 {
  border-left: 10px solid cyan !important;
}

.remote-cursor-style-14 {
  border-left: 10px solid magenta !important;
}

.remote-cursor-style-15 {
  border-left: 10px solid brown !important;
}

.remote-cursor-style-16 {
  border-left: 10px solid indigo !important;
}

.remote-cursor-style-17 {
  border-left: 10px solid violet !important;
}

.remote-cursor-style-18 {
  border-left: 10px solid pink !important;
}

.remote-cursor-style-19 {
  border-left: 10px solid purple !important;
}

.remote-cursor-style-20 {
  border-left: 10px solid red !important;
}
</style>