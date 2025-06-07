<template>
  <iframe ref="iframeRef" sandbox="allow-scripts allow-same-origin"
    style="width: 100%; height: 100%; border: 1px solid #ccc;"></iframe>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps<{
  code: string;
}>();

const iframeRef = ref<HTMLIFrameElement | null>(null);

onMounted(() => {
  updateIframe(props.code);
});

function updateIframe(newCode: string) {
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
}

watch(
  () => props.code,
  (newCode) => {
    updateIframe(newCode);
  },
  { immediate: true }
);
</script>
