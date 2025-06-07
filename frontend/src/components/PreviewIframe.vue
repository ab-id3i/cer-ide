<template>
  <iframe ref="iframeRef" sandbox="allow-scripts allow-same-origin"
    style="width: 100%; height: 500px; border: 1px solid #ccc;"></iframe>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  code: string;
}>();

const iframeRef = ref<HTMLIFrameElement | null>(null);

watch(
  () => props.code,
  (newCode) => {
    if (iframeRef.value) {
      iframeRef.value.srcdoc = `
        <!DOCTYPE html>
        <html>
          <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <link rel="stylesheet" href="/styles/global.css">
          </head>
          <body>
            ${newCode}
          </body>
        </html>
      `;
    }
  },
  { immediate: true }
);

window.console.log = function (...args) {
  parent.postMessage({ type: 'log', message: args }, '*');
};
window.alert = function (msg) {
  parent.postMessage({ type: 'alert', message: msg }, '*');
};
</script>
