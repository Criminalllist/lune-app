import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Note } from '@/types'

const STORAGE_KEY = 'lune-notes'

function loadFromStorage(): Note[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>(loadFromStorage())

  watch(
    notes,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    },
    { deep: true },
  )

  function addNote(note: Note) {
    notes.value.unshift(note)
  }

  function updateNote(updated: Note) {
    const index = notes.value.findIndex((n) => n.id === updated.id)
    if (index !== -1) {
      notes.value[index] = { ...updated, updatedAt: Date.now() }
    }
  }

  function deleteNote(id: string) {
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  function getNoteById(id: string): Note | undefined {
    return notes.value.find((n) => n.id === id)
  }

  return { notes, addNote, updateNote, deleteNote, getNoteById }
})
