import { defineStore } from 'pinia'
import { onBeforeMount, ref } from 'vue'
import { getExampleNote } from './utils'
import type { Note } from '@/types'
import { LOCAL_STORAGE_NOTES_KEY } from '@/consts'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note.List>([])

  const saveNotes = () => {
    localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(notes.value))
  }

  const addNote = (note: Note.Item) => {
    notes.value.push(note)
    saveNotes()
  }

  const updateNote = (id: string, updatedNote: Note.Item) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value[index] = updatedNote
      saveNotes()
    }
  }

  const deleteNote = (id: string) => {
    notes.value = notes.value.filter(note => note.id !== id)
    saveNotes()
  }

  onBeforeMount(() => {
    const notesStorage = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY)
    if (!notesStorage) {
      notes.value = [getExampleNote()]
      return
    }
    notes.value = JSON.parse(notesStorage)
  })

  return { notes, addNote, updateNote, deleteNote }
})
