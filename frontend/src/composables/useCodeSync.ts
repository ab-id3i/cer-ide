import { ref, watch } from "vue";

interface CodeUpdate {
  content: string;
  version: number;
  userId: string;
  timestamp: number;
}

// Fonction de log conditionnelle
const log = (...args: any[]) => {
  if (import.meta.env.DEV) {
    log(...args);
  }
};

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
    log('Received codeUpdate:', update, 'version:', update.version, 'currentVersion:', currentVersion.value);
    
    // Ignorer les mises à jour si le contenu est identique
    if (update.content === lastContent.value) {
      log('Ignoring update with identical content');
      return;
    }

    if (update.version > currentVersion.value) {
      log('Applying update version:', update.version);
      isUpdating.value = true;
      lastContent.value = update.content;
      code.value = update.content;
      currentVersion.value = update.version;
      lastUpdateTimestamp.value = update.timestamp;
      isUpdating.value = false;
    } else {
      log('Ignoring older version:', update.version, 'current:', currentVersion.value);
    }
  });

  // Écouter les mises à jour de version
  socket.on("versionUpdate", (update: { version: number; content: string }) => {
    log('Received versionUpdate:', update);
    
    // Ignorer les mises à jour si le contenu est identique
    if (update.content === lastContent.value) {
      log('Ignoring version update with identical content');
      return;
    }

    if (update.version > currentVersion.value) {
      log('Applying version update:', update.version);
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
      log('Skipping update while isUpdating is true');
      return;
    }

    // Ignorer les mises à jour si le contenu est identique
    if (newCode === lastContent.value) {
      log('Skipping update with identical content');
      return;
    }

    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    updateTimeout = window.setTimeout(() => {
      log('Sending codeChange to server:', {
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
  log('Requesting initial version');
  socket.emit("requestVersion");

  return {
    code,
    currentVersion,
    isUpdating
  };
}
