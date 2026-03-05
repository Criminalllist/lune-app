<script setup lang="ts">
import type { Note } from '@/types'

defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  edit: []
  delete: []
}>()

const PREVIEW_LIMIT = 3
</script>

<template>
  <article class="note-card" @click="emit('edit')">
    <div class="note-card__header">
      <h2 class="note-card__title">{{ note.title || 'Без названия' }}</h2>
      <div class="note-card__meta">
        <span class="note-card__count">{{ note.todos.length }} задач</span>
      </div>
    </div>

    <div v-if="note.todos.length" class="note-card__todos">
      <div
        v-for="todo in note.todos.slice(0, PREVIEW_LIMIT)"
        :key="todo.id"
        class="note-card__todo"
        :class="{ 'note-card__todo--done': todo.completed }"
      >
        <span class="note-card__todo-dot" :class="{ 'note-card__todo-dot--done': todo.completed }" />
        <span class="note-card__todo-text">{{ todo.text || 'Пустая задача' }}</span>
      </div>
      <div v-if="note.todos.length > PREVIEW_LIMIT" class="note-card__more">
        +{{ note.todos.length - PREVIEW_LIMIT }} ещё
      </div>
    </div>
    <div v-else class="note-card__empty">Нет задач</div>

    <div class="note-card__footer">
      <button
        class="note-card__btn note-card__btn--danger"
        aria-label="Удалить заметку"
        @click.stop="emit('delete')"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
        </svg>
        Удалить
      </button>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables' as *;

.note-card {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-lg;
  cursor: pointer;
  transition: box-shadow $transition, border-color $transition, transform $transition;
  display: flex;
  flex-direction: column;
  gap: $space-md;

  &:hover {
    box-shadow: $shadow-md;
    border-color: color.adjust($border, $lightness: -6%);
    transform: translateY(-2px);

    .note-card__btn {
      opacity: 1;
    }
  }
}

.note-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-sm;
}

.note-card__title {
  font-size: 1.0625rem;
  font-weight: 600;
  color: $text;
  line-height: 1.4;
  flex: 1;
  word-break: break-word;
}

.note-card__meta {
  flex-shrink: 0;
}

.note-card__count {
  font-size: 0.75rem;
  color: $text-light;
  background: $surface-2;
  border: 1px solid $border;
  border-radius: 20px;
  padding: 2px 8px;
  white-space: nowrap;
}

.note-card__todos {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.note-card__todo {
  display: flex;
  align-items: center;
  gap: $space-sm;

  &--done .note-card__todo-text {
    text-decoration: line-through;
    color: $text-light;
  }
}

.note-card__todo-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: $border;
  flex-shrink: 0;

  &--done {
    background: $success;
  }
}

.note-card__todo-text {
  font-size: 0.875rem;
  color: $text-muted;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-card__more {
  font-size: 0.8125rem;
  color: $text-light;
  padding-left: 15px;
}

.note-card__empty {
  font-size: 0.875rem;
  color: $text-light;
  font-style: italic;
}

.note-card__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}

.note-card__btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: $radius-sm;
  opacity: 0;
  transition: opacity $transition, background $transition, color $transition;

  &--danger {
    color: $danger;

    &:hover {
      background: $danger-light;
    }
  }
}
</style>
