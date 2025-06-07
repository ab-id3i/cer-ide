<template>
  <router-view />
  <div v-if="showPseudoModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div class="bg-[#181c24] p-8  bg-gray-800 rounded-lg shadow-lg flex flex-col items-center gap-4 min-w-[300px]">
      <h2 class="text-cyan-400 text-xl font-bold mb-2">Choisissez un pseudo</h2>
      <input v-model="pseudoInput" @keyup.enter="validatePseudo" class="border border-cyan-400 rounded px-3 py-2 w-full text-black" placeholder="Votre pseudo" />
      <button @click="validatePseudo" class="neon-btn neon-blue w-full mt-2">Valider</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { userPseudo } from './composables/useMonaco';

const pseudoInput = ref('');
const showPseudoModal = ref(false);

function validatePseudo() {
  if (pseudoInput.value.trim().length > 0) {
    userPseudo.value = pseudoInput.value.trim();
    localStorage.setItem('userPseudo', userPseudo.value);
    showPseudoModal.value = false;
  }
}

onMounted(() => {
  const saved = localStorage.getItem('userPseudo');
  if (saved) {
    userPseudo.value = saved;
    showPseudoModal.value = false;
  } else {
    showPseudoModal.value = true;
  }
});

watch(userPseudo, (val) => {
  if (val) {
    showPseudoModal.value = false;
  }
});
</script>

<style>
.min-w-\[300px\] { min-width: 300px; }
</style>

