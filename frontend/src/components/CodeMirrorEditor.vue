<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from '@codemirror/basic-setup';
import { html } from '@codemirror/lang-html';

const router = useRouter();
const editorContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  if (editorContainer.value) {
    new EditorView({
      state: EditorState.create({
        doc: '<h1>Hello CodeMirror!</h1>',
        extensions: [basicSetup, html()]
      }),
      parent: editorContainer.value
    });
  }
});
</script>

<template>
  <div class="editor-wrapper">
    <button @click="router.push('/')" class="back-button">
      ← Retour à l'accueil
    </button>
    <div ref="editorContainer" style="height: 500px; border: 1px solid #ccc;"></div>
  </div>
</template>

<style scoped>
.editor-wrapper {
  position: relative;
  padding: 2rem;
}

.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: none;
  border: none;
  color: #2c3e50;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  transition: color 0.2s;
  z-index: 1;
}

.back-button:hover {
  color: #42b883;
}
</style>
