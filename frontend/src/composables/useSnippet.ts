import { ref } from "vue";

export function useSnippet(editorInstance: any, code: any) {
  const snippetCode = ref<string | null>(null);

  function handleSnippetDrag(code: string) {
    snippetCode.value = code;
  }

  function handleDrop(event: DragEvent) {
    const snippet = event.dataTransfer?.getData("text/plain");
    if (snippet && editorInstance.value) {
      const position = editorInstance.value.getPosition();
      if (position && editorInstance.value.monaco) {
        editorInstance.value.executeEdits("", [
          {
            range: new editorInstance.value.monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
            text: snippet,
          },
        ]);
        const newValue = editorInstance.value.getValue();
        code.value = newValue;
      }
    }
  }

  return {
    snippetCode,
    handleSnippetDrag,
    handleDrop,
  };
}
