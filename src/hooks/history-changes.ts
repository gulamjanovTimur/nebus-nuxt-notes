import { computed, ref } from 'vue'
import type { Note } from '@/types'

/**
 *  Отслеживание изменений и история изменений
 * @returns
 *   - isDisabledUndo - Отключение кнопки отмены
 *   - isDisabledRedo - Отключение кнопки повтора
 *   - trackChange - Отслеживание изменений
 *   - undoChange - Отмена последнего изменения
 *   - redoChange - Повтор последнего отмененного изменения
 */
export const useHistoryChanges = () => {
  const history = ref<Note.Item[]>([]) // История изменений
  const redoStack = ref<Note.Item[]>([]) // Для повторов изменений

  const isDisabledUndo = computed(() => !history.value.length)
  const isDisabledRedo = computed(() => !redoStack.value.length)

  // Отслеживание изменений и добавление в историю
  const trackChange = (note: Note.Item) => {
    // Глубокое копирование текущего состояния
    history.value.push(JSON.parse(JSON.stringify(note)))
    redoStack.value = [] // Очистка стека повторов
  }

  // Отмена последнего изменения
  const undoChange = (note: Note.Item): Note.Item | null => {
    if (!history.value.length) {
      alert('Нет изменений для отмены.')
      return null
    }

    redoStack.value.push(JSON.parse(JSON.stringify(note)))
    return history.value.pop()!
  }

  // Повтор последнего отмененного изменения
  const redoChange = (note: Note.Item): Note.Item | null => {
    if (!redoStack.value.length) {
      alert('Нет изменений для повтора.')
      return null
    }

    history.value.push(JSON.parse(JSON.stringify(note)))
    return redoStack.value.pop()!
  }

  return {
    trackChange,
    undoChange,
    redoChange,
    isDisabledUndo,
    isDisabledRedo,
  }
}
