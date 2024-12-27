import type { Note } from '@/types'

export const getExampleNote = (): Note.Item => ({
  id: '1',
  title: 'Пример заметки',
  todos: [
    { id: '1', text: 'Пример задачи №1', isDone: false },
    { id: '2', text: 'Пример задачи №2 с выполненным статусом', isDone: true },
  ],
})
