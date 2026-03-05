import { ref, computed } from 'vue'

function deepClone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val))
}

export function useUndoRedo<T>(initialState: T) {
  const history = ref<T[]>([deepClone(initialState)]) as { value: T[] }
  const index = ref(0)

  const canUndo = computed(() => index.value > 0)
  const canRedo = computed(() => index.value < history.value.length - 1)

  function push(state: T) {
    history.value.splice(index.value + 1)
    history.value.push(deepClone(state))
    index.value = history.value.length - 1
  }

  function undo(): T {
    if (canUndo.value) index.value--
    return deepClone(history.value[index.value])
  }

  function redo(): T {
    if (canRedo.value) index.value++
    return deepClone(history.value[index.value])
  }

  return { push, undo, redo, canUndo, canRedo }
}
