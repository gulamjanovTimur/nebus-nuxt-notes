<template>
  <div class="container">
    <h1>Список заметок</h1>
    <ul :class="$style.list">
      <li
        v-for="note in notesStore.notes"
        :key="note.id"
        :class="$style.listItem"
      >
        <span :class="$style.listItemTitle">{{ note.title }}</span>
        <ol :class="$style.todoList">
          <li
            v-for="todo in todosShort(note.todos)"
            :key="todo.id"
          >
            <span :class="getTodosStyles(todo.isDone)">
              {{ todo.text }}
            </span>
          </li>
        </ol>
        <div :class="$style.actions">
          <NuxtLink :class="$style.editLink" :to="`/edit/${note.id}`">Редактировать</NuxtLink>
          <button :class="$style.btnRemove" @click="deleteHandler(note)">Удалить</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useNotesStore } from '@/stores'
import type { Note } from '@/types'
import { COUNT_SHORT_TODOS } from '@/consts'
import { useCssModule } from 'vue'

const notesStore = useNotesStore()
const $styles = useCssModule()

const deleteHandler = (note: Note.Item) => {
  if (!confirm(`Вы уверены, что хотите удалить заметку "${note.title}"?`)) {
    return
  }

  notesStore.deleteNote(note.id)
}

const todosShort = (todos: Note.Todo[]) => {
  return todos.slice(0, COUNT_SHORT_TODOS)
}

const getTodosStyles = (isDone: boolean) => ({
  [$styles.todoItem]: true,
  [$styles.todoItemDone]: isDone,
})
</script>

<style lang="scss" module>
.list {
  margin: 0;
  padding: 0;
  list-style: none;

  &Item {
    background-color: var(--white);
    padding: 12px 16px;
    box-shadow: 0 0 4px rgba(0, 0, 0, .3);
    border-radius: 4px;
    margin-bottom: 12px;
    overflow: hidden;

    &Title {
      display: block;
      font-size: 18px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
}

.btnRemove {
  background-color: var(--danger);
}

.actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.todo {
  &Item {
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &Done {
      color: var(--success);
      text-decoration: line-through;
    }
  }
}

.editLink {
  display: block;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  color: var(--light);
  background-color: var(--success);
  font-size: 14px;
  font-weight: bold;
  text-align: center;

  &:not(:disabled):hover {
    opacity: 0.8;
  }

  &:not(:disabled):active {
    opacity: 0.6;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
}


@media (max-width: 768px) {
  .listItem {
    padding: 10px 12px;
  }

  .listItemTitle {
    font-size: 18px;
  }

  .actions {
    gap: 8px;
  }

  .editLink {
    padding: 8px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .listItemTitle {
    text-align: center;
  }

  .editLink {
    width: 100%;
    text-align: center;
    padding: 6px 12px;
  }

  .todoList {
    padding-left: 25px;
  }
}
</style>
