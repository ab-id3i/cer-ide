import { ref } from "vue";

export function useCursors(userId: string, socket: any) {
  const otherCursors = ref<Record<string, any>>({});
  const userColors = ref<Record<string, string>>({});

  function handleCursorPositionChange(payload: {
    userId: string;
    userPseudo: string;
    position: any;
  }) {
    // Vérification de la validité de la position
    if (!payload.position || 
        typeof payload.position.lineNumber !== 'number' || 
        typeof payload.position.column !== 'number' ||
        payload.position.lineNumber < 1 ||
        payload.position.column < 1) {
      return;
    }
    socket.emit("cursorPositionChange", payload);
  }

  function getColorForUser(userId: string): string {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 80%, 50%)`;
  }

  // Écouter les mises à jour de position des curseurs
  socket.on(
    "cursorPositionUpdate",
    (payload: { userId: string; userPseudo: string; position: any }) => {
      if (payload.userId !== userId) {
        // Vérification de la validité de la position
        if (!payload.position || 
            typeof payload.position.lineNumber !== 'number' || 
            typeof payload.position.column !== 'number' ||
            payload.position.lineNumber < 1 ||
            payload.position.column < 1) {
          return;
        }

        if (!userColors.value[payload.userId]) {
          userColors.value[payload.userId] = getColorForUser(payload.userId);
        }

        otherCursors.value[payload.userId] = {
          position: payload.position,
          userPseudo: payload.userPseudo,
        };
      }
    }
  );

  return {
    otherCursors,
    userColors,
    handleCursorPositionChange,
  };
}
