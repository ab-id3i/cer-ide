<template>
  <transition name="fade">
    <div
      v-if="visible"
      :class="[
        'fixed top-6 right-6 z-50 px-6 py-4 rounded shadow-lg font-mono text-lg flex items-center gap-3',
        type === 'success' ? 'bg-green-700 text-white border-l-4 border-green-400' : '',
        type === 'error' ? 'bg-red-700 text-white border-l-4 border-red-400' : '',
        type === 'warning' ? 'bg-yellow-600 text-white border-l-4 border-yellow-300' : ''
      ]"
      role="alert"
    >
      <span v-if="type === 'success'">✅</span>
      <span v-if="type === 'error'">❌</span>
      <span v-if="type === 'warning'">⚠️</span>
      <span>{{ message }}</span>
      <button @click="close" class="ml-4 text-white hover:text-gray-200 font-bold">✕</button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  message: string;
  type: 'success' | 'error' | 'warning';
  duration?: number;
  show: boolean;
}>();
const emit = defineEmits(['close']);

const visible = ref(props.show);

watch(() => props.show, (val) => {
  visible.value = val;
  if (val && props.duration !== 0) {
    setTimeout(() => close(), props.duration ?? 3000);
  }
});

function close() {
  visible.value = false;
  emit('close');
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 