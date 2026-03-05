<script setup lang="ts">
import { useNotesStore } from '@/stores/notes'

const router = useRouter()
const store = useNotesStore()

const deleteModal = ref(false)
const noteToDelete = ref<string | null>(null)

function openDeleteModal(id: string) {
  noteToDelete.value = id
  deleteModal.value = true
}

function confirmDelete() {
  if (noteToDelete.value) {
    store.deleteNote(noteToDelete.value)
  }
  deleteModal.value = false
  noteToDelete.value = null
}

function cancelDelete() {
  deleteModal.value = false
  noteToDelete.value = null
}

function openNote(id: string) {
  router.push(`/note/${id}`)
}

function createNote() {
  router.push('/note/new')
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1>Мои заметки</h1>
      <BaseButton @click="createNote">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Новая заметка
      </BaseButton>
    </header>

    <TransitionGroup v-if="store.notes.length" name="list" tag="div" class="notes-grid">
      <NoteCard
        v-for="note in store.notes"
        :key="note.id"
        :note="note"
        @edit="openNote(note.id)"
        @delete="openDeleteModal(note.id)"
      />
    </TransitionGroup>

    <div v-else class="empty-state">
      <div class="empty-state__icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>
      <h2>Нет заметок</h2>
      <p>Создайте первую заметку, чтобы начать работу</p>
      <BaseButton @click="createNote">Создать заметку</BaseButton>
    </div>

    <BaseModal v-model="deleteModal" title="Удалить заметку">
      <p>Вы уверены, что хотите удалить эту заметку? Это действие нельзя отменить.</p>
      <template #footer>
        <BaseButton variant="secondary" @click="cancelDelete">Отмена</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Удалить</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $space-lg;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: $space-2xl $space-lg;
  gap: $space-md;

  &__icon {
    color: $text-light;
    margin-bottom: $space-sm;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text;
  }

  p {
    color: $text-muted;
    max-width: 280px;
  }
}

.list-enter-active,
.list-leave-active {
  transition: opacity $transition, transform $transition;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
