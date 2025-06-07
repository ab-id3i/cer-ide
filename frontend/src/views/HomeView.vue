<template>
  <div style="flex: 1; height: 100%;">
    <SnippetList @dragstart="handleSnippetDrag" />
    <div @drop.prevent="handleDrop" @dragover.prevent>
      <MonacoEditor v-model="code" @editorCreated="handleEditorCreated" :userId="userId"
        @cursorPositionChange="handleCursorPositionChange" :otherCursors="otherCursors" :userColors="userColors" />
    </div>
  </div>
  <PreviewIframe :code="code" :userId="userId" />
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import MonacoEditor from '../components/MonacoEditor.vue';
import PreviewIframe from '../components/PreviewIframe.vue';
import SnippetList from '../components/SnippetList.vue';
import { v4 as uuidv4 } from 'uuid';
import { useCursors } from '../composables/useCursors';
import { useCodeSync } from '../composables/useCodeSync';

const socket = inject('socket') as any;
const userId = uuidv4();
const editorInstance = ref<any>(null);
const snippetCode = ref<string | null>(null);

const { otherCursors, userColors, handleCursorPositionChange } = useCursors(userId, socket);
const { code } = useCodeSync(socket);

function handleSnippetDrag(code: string) {
  snippetCode.value = code;
}

function handleEditorCreated(instance: any) {
  if (editorInstance) {
    editorInstance.value = instance;
  }
}

function handleDrop(event: DragEvent) {
  const snippet = event.dataTransfer?.getData('text/plain');
  if (snippet && editorInstance.value) {
    const position = editorInstance.value.getPosition();
    if (position && editorInstance.value.monaco) {
      editorInstance.value.executeEdits('', [
        {
          range: new editorInstance.value.monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
          ),
          text: snippet
        }
      ]);
      const newValue = editorInstance.value.getValue();
      code.value = newValue;
    }
  }
}

window.addEventListener('message', (event) => {
  if (event.data.type === 'log') {
    console.log('[Preview]', ...event.data.message);
  } else if (event.data.type === 'alert') {
    alert(event.data.message);
  }
});
</script>
