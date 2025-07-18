import { ref } from "vue";

export const userPseudo = ref<string | null>(null);
export const userId = ref<string>('');

export function useMonaco() {
  const editorInstance = ref<any>(null);

  function handleEditorCreated(instance: any) {
    editorInstance.value = instance;
  }

  return {
    editorInstance,
    handleEditorCreated,
  };
}
