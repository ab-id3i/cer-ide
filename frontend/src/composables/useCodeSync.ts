import { ref, watch } from 'vue';

export function useCodeSync(socket: any, initialCode: string = '<h1>Hello World</h1>') {
  const code = ref(initialCode);

  // Écouter les mises à jour de code depuis le serveur
  socket.on('codeUpdate', (newCode: string) => {
    code.value = newCode;
  });

  // Envoyer les changements de code au serveur
  watch(code, (newCode) => {
    socket.emit('codeChange', newCode);
  });

  return {
    code
  };
} 