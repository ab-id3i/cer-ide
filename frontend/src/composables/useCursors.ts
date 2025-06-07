import { ref, type Ref } from 'vue';
import type { editor } from 'monaco-editor';

export function useCursors(userId: string, socket: any) {
  const otherCursors = ref<Record<string, any>>({});
  const userColors = ref<Record<string, string>>({});

  function handleCursorPositionChange(payload: { userId: string; position: any }) {
    socket.emit('cursorPositionChange', payload);
  }

  function getColorForUser(userId: string): string {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 80%, 50%)`;
  }

  // Écouter les mises à jour de position des curseurs
  socket.on('cursorPositionUpdate', (payload: { userId: string; position: any }) => {
    if (payload.userId !== userId) {
      if (!userColors.value[payload.userId]) {
        userColors.value[payload.userId] = getColorForUser(payload.userId);
      }
      otherCursors.value[payload.userId] = payload.position;
    }
  });

  return {
    otherCursors,
    userColors,
    handleCursorPositionChange
  };
} 