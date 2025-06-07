<template>
  <div ref="editorContainer" style="height: 100%; border: 1px solid #ccc;" @dragover.prevent></div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
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

const editorContainer = ref<HTMLElement | null>(null);

let editorInstance: any = null;
let monacoEditorLib: any = null;
const decorationsRef = ref<string[]>([]);

// Fonction appelée quand le contenu change
const sendContentChange = debounce((value: any) => {
  emit('update:modelValue', value);

}, 500); // envoie toutes les 100ms max

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
        sendContentChange(value)
      });
      editorInstance.onDidChangeCursorPosition(() => {
        const position = editorInstance.getPosition();
        if (position) {
          // On émet l’événement via le parent
          emit('cursorPositionChange', {
            userId: props.userId,
            userPseudo: userPseudo.value || 'Inconnu',
            position
          });
        }
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
      editorInstance.setValue(newVal);
    }
  }
);

watch(
  () => props.otherCursors,
  (newCursors) => {
    if (!editorInstance) return;
    const decorations: any[] = [];
    Object.entries(newCursors).forEach(([otherUserId, position]) => {
      const color = props.userColors[otherUserId] || 'red'; // fallback au cas où
      decorations.push({
        range: new monacoEditorLib.Range(
          position.position.lineNumber,
          position.position.column,
          position.position.lineNumber,
          position.position.column
        ),
        options: {
          className: `remote-cursor-${otherUserId}`,
          isWholeLine: true,
          hoverMessage: { value: `👤 ${position.userPseudo}` }
        }
      });
      // Injecter dynamiquement la couleur si elle n’existe pas déjà
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
