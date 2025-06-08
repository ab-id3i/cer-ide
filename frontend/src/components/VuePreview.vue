<template>
  <div class="h-full w-full">
    <iframe ref="previewFrame" class="w-full h-full border-none"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  code: string;
}>();

const previewFrame = ref<HTMLIFrameElement | null>(null);

// Fonction pour extraire le template du code Vue
function extractTemplate(code: string): string {
  const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
  return templateMatch ? templateMatch[1].trim() : '';
}

// Fonction pour créer le HTML complet avec les styles nécessaires
function createPreviewHtml(template: string): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vue Preview</title>
        <script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <style>
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="app">${template}</div>
        <script>
          const { createApp } = Vue;
          createApp({
            template: \`${template}\`
          }).mount('#app');
        <\/script>
      </body>
    </html>
  `;
}

// Fonction pour mettre à jour la prévisualisation
function updatePreview() {
  if (!previewFrame.value) return;
  
  const template = extractTemplate(props.code);
  const html = createPreviewHtml(template);
  
  const frame = previewFrame.value;
  frame.srcdoc = html;
}

// Mettre à jour la prévisualisation quand le code change
watch(() => props.code, updatePreview, { immediate: true });

onMounted(() => {
  updatePreview();
});
</script> 