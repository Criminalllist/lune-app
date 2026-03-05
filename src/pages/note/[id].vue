<script setup lang="ts">
import { useNotesStore } from '@/stores/notes'
import type { Note } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useNotesStore()

const isNew = route.params.id === 'new'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function createEmptyNote(): Note {
  return {
    id: generateId(),
    title: '',
    todos: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function cloneNote(note: Note): Note {
  return JSON.parse(JSON.stringify(note))
}

let initialNote: Note
if (isNew) {
  initialNote = createEmptyNote()
} else {
  const found = store.getNoteById(route.params.id as string)
  if (!found) {
    await navigateTo('/')
    initialNote = createEmptyNote()
  } else {
    initialNote = cloneNote(found)
  }
}

const note = ref<Note>(cloneNote(initialNote))
const savedNote = ref<Note>(cloneNote(initialNote))

const { push, undo, redo, canUndo, canRedo } = useUndoRedo(initialNote)

const hasChanges = computed(() => {
  return JSON.stringify(note.value) !== JSON.stringify(savedNote.value)
})

const cancelModal = ref(false)
const deleteModal = ref(false)

function snapshotForUndo() {
  push(cloneNote(note.value))
}

function onTitleBlur() {
  snapshotForUndo()
}

function addTodo() {
  note.value.todos.push({
    id: generateId(),
    text: '',
    completed: false,
  })
  snapshotForUndo()
}

function toggleTodo(id: string) {
  const todo = note.value.todos.find((t) => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    snapshotForUndo()
  }
}

function updateTodoText(id: string, text: string) {
  const todo = note.value.todos.find((t) => t.id === id)
  if (todo) todo.text = text
}

function onTodoBlur() {
  snapshotForUndo()
}

function deleteTodo(id: string) {
  note.value.todos = note.value.todos.filter((t) => t.id !== id)
  snapshotForUndo()
}

function handleUndo() {
  note.value = undo()
}

function handleRedo() {
  note.value = redo()
}

function save() {
  const toSave = { ...note.value, updatedAt: Date.now() }
  if (isNew) {
    store.addNote(toSave)
  } else {
    store.updateNote(toSave)
  }
  savedNote.value = cloneNote(toSave)
  note.value = cloneNote(toSave)
  router.push('/')
}

function tryCancel() {
  if (hasChanges.value) {
    cancelModal.value = true
  } else {
    router.push('/')
  }
}

function confirmCancel() {
  cancelModal.value = false
  router.push('/')
}

function confirmDelete() {
  if (!isNew) store.deleteNote(note.value.id)
  deleteModal.value = false
  router.push('/')
}

function onKeydown(e: KeyboardEvent) {
  const isCtrl = e.ctrlKey || e.metaKey
  if (!isCtrl) return
  if (e.key === 'z' && !e.shiftKey) {
    e.preventDefault()
    if (canUndo.value) handleUndo()
  } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
    e.preventDefault()
    if (canRedo.value) handleRedo()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="page">
    <header class="edit-header">
      <button class="back-btn" aria-label="Назад" @click="tryCancel">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <h1>{{ isNew ? 'Новая заметка' : 'Редактирование' }}</h1>
      <div class="edit-header__actions">
        <button
          class="icon-btn"
          :class="{ 'icon-btn--disabled': !canUndo }"
          :disabled="!canUndo"
          title="Отменить (Ctrl+Z)"
          aria-label="Отменить"
          @click="handleUndo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
          </svg>
        </button>
        <button
          class="icon-btn"
          :class="{ 'icon-btn--disabled': !canRedo }"
          :disabled="!canRedo"
          title="Повторить (Ctrl+Y)"
          aria-label="Повторить"
          @click="handleRedo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13" />
          </svg>
        </button>
      </div>
    </header>

    <div class="edit-form">
      <div class="edit-form__section">
        <input
          v-model="note.title"
          class="title-input"
          type="text"
          placeholder="Название заметки..."
          @blur="onTitleBlur"
        />
      </div>

      <div class="edit-form__section">
        <div class="todos-header">
          <span class="todos-label">Задачи</span>
          <span class="todos-count">{{ note.todos.filter((t) => t.completed).length }} / {{ note.todos.length }}</span>
        </div>

        <div v-if="note.todos.length" class="todos-list">
          <TransitionGroup name="todo">
            <TodoItemComp
              v-for="todo in note.todos"
              :key="todo.id"
              :item="todo"
              @toggle="toggleTodo(todo.id)"
              @update="updateTodoText(todo.id, $event)"
              @blur="onTodoBlur"
              @delete="deleteTodo(todo.id)"
            />
          </TransitionGroup>
        </div>
        <div v-else class="todos-empty">Нет задач. Добавьте первую задачу.</div>

        <button class="add-todo-btn" @click="addTodo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Добавить задачу
        </button>
      </div>
    </div>

    <div class="edit-footer">
      <div class="edit-footer__left">
        <BaseButton variant="danger" @click="deleteModal = true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
          Удалить
        </BaseButton>
      </div>
      <div class="edit-footer__right">
        <BaseButton variant="secondary" @click="tryCancel">Отмена</BaseButton>
        <BaseButton @click="save">Сохранить</BaseButton>
      </div>
    </div>

    <BaseModal v-model="cancelModal" title="Отменить изменения">
      <p>У вас есть несохранённые изменения. Вы уверены, что хотите выйти?</p>
      <template #footer>
        <BaseButton variant="secondary" @click="cancelModal = false">Остаться</BaseButton>
        <BaseButton variant="danger" @click="confirmCancel">Выйти без сохранения</BaseButton>
      </template>
    </BaseModal>

    <BaseModal v-model="deleteModal" title="Удалить заметку">
      <p>Вы уверены, что хотите удалить эту заметку? Это действие нельзя отменить.</p>
      <template #footer>
        <BaseButton variant="secondary" @click="deleteModal = false">Отмена</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Удалить</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables' as *;

.edit-header {
  display: flex;
  align-items: center;
  gap: $space-md;
  margin-bottom: $space-xl;

  h1 {
    font-size: 1.375rem;
    font-weight: 700;
    flex: 1;
  }

  &__actions {
    display: flex;
    gap: $space-xs;
  }
}

.back-btn {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-muted;
  transition: background $transition, color $transition, border-color $transition;
  flex-shrink: 0;

  &:hover {
    background: $surface-2;
    color: $text;
    border-color: color.adjust($border, $lightness: -8%);
  }
}

.icon-btn {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-muted;
  transition: background $transition, color $transition, opacity $transition;

  &:hover:not(:disabled) {
    background: $surface-2;
    color: $text;
  }

  &--disabled,
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: $space-lg;

  &__section {
    background: $surface;
    border: 1px solid $border;
    border-radius: $radius-lg;
    padding: $space-lg;
  }
}

.title-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 1.5rem;
  font-weight: 700;
  color: $text;
  background: transparent;
  padding: 0;
  line-height: 1.3;

  &::placeholder {
    color: $text-light;
    font-weight: 400;
  }
}

.todos-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-md;
}

.todos-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: $text;
}

.todos-count {
  font-size: 0.8125rem;
  color: $text-light;
  background: $surface-2;
  border: 1px solid $border;
  border-radius: 20px;
  padding: 2px 8px;
}

.todos-list {
  margin-bottom: $space-md;
}

.todos-empty {
  font-size: 0.875rem;
  color: $text-light;
  font-style: italic;
  padding: $space-sm 0;
  margin-bottom: $space-md;
}

.add-todo-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1.5px dashed $border;
  border-radius: $radius;
  padding: 8px 14px;
  font-size: 0.875rem;
  color: $text-muted;
  width: 100%;
  justify-content: center;
  transition: border-color $transition, color $transition, background $transition;

  &:hover {
    border-color: $primary;
    color: $primary;
    background: $primary-light;
  }
}

.edit-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: $space-xl;
  gap: $space-md;
  flex-wrap: wrap;

  &__right {
    display: flex;
    gap: $space-sm;
  }
}

.todo-enter-active,
.todo-leave-active {
  transition: opacity $transition, transform $transition;
}

.todo-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.todo-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
