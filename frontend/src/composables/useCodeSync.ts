import { ref, watch } from "vue";

export function useCodeSync(
  socket: any,
  initialCode: string = "<!DOCTYPE html>\n<html>\n  <head>\n    <title>iD3i CodeLab</title>\n  </head>\n  <body>\n    <h1>Bienvenue sur iD3i CodeLab !</h1>\n  </body>\n</html>"
) {
  const code = ref(initialCode);

  // Écouter les mises à jour de code depuis le serveur
  socket.on("codeUpdate", (newCode: string) => {
    code.value = newCode;
  });

  // Envoyer les changements de code au serveur
  watch(code, (newCode) => {
    socket.emit("codeChange", newCode);
  });

  return {
    code,
  };
}
