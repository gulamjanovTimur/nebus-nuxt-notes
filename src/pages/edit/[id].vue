<template>
  <div class="container">
    <div :class="$style.header">
      <h1>{{ isNewNote ? 'Создать новую заметку' : 'Редактировать заметку' }}</h1>
      <div :class="$style.headerActions">
        <button :class="$style.iconBtn" :disabled="isDisabledUndo" @click="onUndo">
          <UndoSvg fill="#fff" />
        </button>
        <button :class="$style.iconBtn" :disabled="isDisabledRedo" @click="onRedo">
          <RedoSvg fill="#fff" />
        </button>
      </div>
    </div>

    <form @submit.prevent="onSaveNote">
      <div :class="$style.formItem">
        <label :class="$style.formItemLabel" for="title">Название заметки</label>
        <input
          id="title"
          :value="note.title"
          required
          @input="onTitleInput(($event.target as HTMLInputElement).value)"
        >
      </div>

      <div :class="$style.formItem">
        <label :class="$style.formItemLabel">Задачи</label>
        <div
          v-for="(todo, index) in note.todos"
          :key="todo.id"
          :class="$style.todoItem"
        >
          <input
            type="checkbox"
            :checked="todo.isDone"
            :class="$style.todoItemCheckbox"
            @change="onChangeDone(($event.target as HTMLInputElement).checked, index)"
          >
          <input
            :value="todo.text"
            type="text"
            :class="$style.todoItemInput"
            required
            @input="onTodoInput(($event.target as HTMLInputElement).value, index)"
          >
          <button
            type="button"
            :class="[$style.iconBtn, $style.todoItemRemove]"
            @click="removeTodo(index)"
          >
            <TrashSvg fill="#fff" />
          </button>
        </div>
        <button type="button" :class="$style.iconBtn" @click="addTodo"><PlusSvg /></button>
      </div>

      <div :class="$style.actions">
        <button type="submit"> {{ isNewNote ? 'Создать' : 'Сохранить' }}</button>
        <button type="button" :class="$style.actionsCancel" @click="onCancelEdit">Отменить</button>
        <button v-if="!isNewNote" type="button" :class="$style.actionsDelete" @click="onDeleteNote">Удалить</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { v4 as uuid } from 'uuid'
import { RedoSvg, TrashSvg, UndoSvg, PlusSvg } from '@icons'
import { useNotesStore } from '@/stores'
import type { Note } from '@/types'
import { NOTE_ROUTE_PARAM_NEW } from '@/consts'
import { useHistoryChanges } from '@/hooks'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const { trackChange, undoChange, redoChange, isDisabledUndo, isDisabledRedo } = useHistoryChanges()

const note = ref<Note.Item>({
  id: uuid(),
  title: '',
  todos: [],
})

const isNewNote = computed(() => route.params.id === NOTE_ROUTE_PARAM_NEW)

const addTodo = () => {
  trackChange(note.value)

  note.value.todos.push({
    id: uuid(),
    text: '',
    isDone: false,
  })
}

const removeTodo = (index: number) => {
  trackChange(note.value)

  note.value.todos.splice(index, 1)
}

const onTitleInput = (newValue: string) => {
  trackChange(note.value)

  note.value.title = newValue.trim()
}

const onTodoInput = (newValue: string, index: number) => {
  trackChange(note.value)

  note.value.todos[index] = {
    ...note.value.todos[index],
    text: newValue,
  }
}

const onChangeDone = (isDone: boolean, index: number) => {
  trackChange(note.value)

  note.value.todos[index] = {
    ...note.value.todos[index],
    isDone,
  }
}

const onSaveNote = () => {
  if (isNewNote.value) {
    notesStore.addNote(note.value)
  } else {
    notesStore.updateNote(note.value.id, note.value)
  }

  alert('Заметка сохранена!')
  router.push('/')
}

const onDeleteNote = () => {
  if (!confirm('Вы уверены, что хотите удалить заметку?')) return

  notesStore.deleteNote(note.value.id)
  router.push('/')
}

const onUndo = () => {
  const previousNote = undoChange(note.value)
  if (!previousNote) return

  note.value = previousNote
}

const onRedo = () => {
  const nextNote = redoChange(note.value)
  if (!nextNote) return

  note.value = nextNote
}

const onCancelEdit = () => {
  if (!confirm('Вы уверены, что хотите отменить изменения?')) return

  router.push('/')
}

// Инициализация заметки при монтировании компонента
onMounted(() => {
  if (isNewNote.value) return

  const currentNote = notesStore.notes.find(note => note.id === route.params.id as string)
  if (!currentNote) {
    alert('Заметка не найдена!')
    router.push('/')
    return
  }

  // Глубокое копирование объекта, чтобы не было проблем с реактивностью
  note.value = JSON.parse(JSON.stringify(currentNote))
})
</script>

<style lang="scss" module>
.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;;

  &Actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.iconBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  height: 32px;
  width: 32px;
  background-color: var(--dark);
}

.formItem {
  margin-bottom: 16px;

  &Label {
    display: block;
    font-size: 18px;
    margin-bottom: 4px;
  }
}

.todoItem {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  &Checkbox {
    width: 32px;
    height: 32px;
    margin: 0;
  }

  &Input {
    flex: 1;
  }

  &Remove {
    background-color: var(--danger);
  }
}

.btn {
  background-color: var(--warm-yellow);
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  &Cancel {
    background-color: var(--dark);
  }

  &Delete {
    background-color: var(--danger);
  }
}

@media (max-width: 480px) {
  .header {
    flex-direction: column;
    gap: 0;
  }

  .iconBtn {
    height: 28px;
    width: 28px;
  }

  .formItemLabel {
    font-size: 16px;
  }

  .todoItem {
    flex-wrap: wrap;
    gap: 6px;
  }

  .todoItemCheckbox {
    width: 28px;
    height: 28px;
  }

  .todoItemInput {
    min-width: 150px;
  }

  .btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  .actions {
    flex-wrap: wrap;
    gap: 6px;
  }

  .actions button {
    padding: 6px 12px;
  }
}
</style>
