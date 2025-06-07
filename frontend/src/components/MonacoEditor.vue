<template>
  <div ref="editorContainer" style="height: 100%; border: 1px solid #ccc;" @dragover.prevent></div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
  userId: string;
  otherCursors: Record<string, any>;
  userColors: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'cursorPositionChange', value: { userId: string; position: any }): void;
  (e: 'editorCreated', value: any): void;
}>();

const editorContainer = ref<HTMLElement | null>(null);

let editorInstance: any = null;
let monacoEditorLib: any = null;
const decorationsRef = ref<string[]>([]);

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
      });

      // Ajout du provider d'autocomplétion
      const tailwindClasses = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500',
        'text-center', 'text-left', 'text-right',
        'p-4', 'p-8', 'm-4', 'm-8',
        'rounded', 'shadow', 'shadow-lg',
        'flex', 'grid', 'justify-center', 'items-center',
        'w-full', 'h-screen', 'container', 'mx-auto'
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
        emit('update:modelValue', value);
      });
      editorInstance.onDidChangeCursorPosition((e: any) => {
        const position = editorInstance.getPosition();
        if (position) {
          // On émet l’événement via le parent
          emit('cursorPositionChange', {
            userId: props.userId,
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
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        options: {
          className: `remote-cursor-${otherUserId}`,
          isWholeLine: true
        }
      });
      // Injecter dynamiquement la couleur si elle n’existe pas déjà
      if (!document.querySelector(`#remote-cursor-style-${otherUserId}`)) {
        const style = document.createElement('style');
        style.id = `remote-cursor-style-${otherUserId}`;
        style.innerHTML = `
      .remote-cursor-${otherUserId} {
        border-left: 2px solid ${color} !important;
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
