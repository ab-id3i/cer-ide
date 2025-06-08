import { ref, watch } from "vue";

interface CodeUpdate {
  content: string;
  version: number;
  userId: string;
  timestamp: number;
}

export function useCodeSync(
  socket: any,
  initialCode: string = "<!DOCTYPE html>\n<html>\n  <head>\n    <title>iD3i CodeLab</title>\n  </head>\n  <body>\n    <h1>Bienvenue sur iD3i CodeLab !</h1>\n  </body>\n</html>"
) {
  const code = ref(initialCode);
  const currentVersion = ref(0);
  const lastUpdateTimestamp = ref(Date.now());
  const isUpdating = ref(false);
  const lastContent = ref(initialCode);

  // Écouter les mises à jour de code depuis le serveur
  socket.on("codeUpdate", (update: CodeUpdate) => {
    console.log('Received codeUpdate:', update, 'version:', update.version, 'currentVersion:', currentVersion.value);
    
    // Ignorer les mises à jour si le contenu est identique
    if (update.content === lastContent.value) {
      console.log('Ignoring update with identical content');
      return;
    }

    if (update.version > currentVersion.value) {
      console.log('Applying update version:', update.version);
      isUpdating.value = true;
      lastContent.value = update.content;
      code.value = update.content;
      currentVersion.value = update.version;
      lastUpdateTimestamp.value = update.timestamp;
      isUpdating.value = false;
    } else {
      console.log('Ignoring older version:', update.version, 'current:', currentVersion.value);
    }
  });

  // Écouter les mises à jour de version
  socket.on("versionUpdate", (update: { version: number; content: string }) => {
    console.log('Received versionUpdate:', update);
    
    // Ignorer les mises à jour si le contenu est identique
    if (update.content === lastContent.value) {
      console.log('Ignoring version update with identical content');
      return;
    }

    if (update.version > currentVersion.value) {
      console.log('Applying version update:', update.version);
      isUpdating.value = true;
      lastContent.value = update.content;
      code.value = update.content;
      currentVersion.value = update.version;
      isUpdating.value = false;
    }
  });

  // Envoyer les changements de code au serveur avec debounce
  let updateTimeout: number | null = null;
  watch(code, (newCode) => {
    if (isUpdating.value) {
      console.log('Skipping update while isUpdating is true');
      return;
    }

    // Ignorer les mises à jour si le contenu est identique
    if (newCode === lastContent.value) {
      console.log('Skipping update with identical content');
      return;
    }

    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    updateTimeout = window.setTimeout(() => {
      console.log('Sending codeChange to server:', {
        content: newCode,
        userId: socket.id,
        timestamp: Date.now()
      });
      lastContent.value = newCode;
      socket.emit("codeChange", {
        content: newCode,
        userId: socket.id,
        timestamp: Date.now()
      });
    }, 500);
  });

  // Demander la dernière version au chargement
  console.log('Requesting initial version');
  socket.emit("requestVersion");

  return {
    code,
    currentVersion,
    isUpdating
  };
}
