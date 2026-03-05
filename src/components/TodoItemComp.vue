<script setup lang="ts">
import type { TodoItem } from '@/types'

const props = defineProps<{
  item: TodoItem
  readonly?: boolean
}>()

const emit = defineEmits<{
  toggle: []
  update: [text: string]
  delete: []
  blur: []
}>()
</script>

<template>
  <div class="todo-item" :class="{ 'todo-item--completed': item.completed, 'todo-item--readonly': readonly }">
    <label class="todo-item__checkbox">
      <input
        type="checkbox"
        :checked="item.completed"
        :disabled="readonly"
        @change="emit('toggle')"
      />
      <span class="checkmark" />
    </label>

    <input
      v-if="!readonly"
      class="todo-item__input"
      type="text"
      :value="item.text"
      placeholder="Текст задачи..."
      @input="emit('update', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur')"
    />
    <span v-else class="todo-item__text">{{ item.text }}</span>

    <button v-if="!readonly" class="todo-item__delete" aria-label="Удалить задачу" @click="emit('delete')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.todo-item {
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: 10px $space-sm;
  border-radius: $radius-sm;
  transition: background $transition;

  &:hover:not(&--readonly) {
    background: $surface-2;

    .todo-item__delete {
      opacity: 1;
    }
  }

  &--completed {
    .todo-item__text,
    .todo-item__input {
      text-decoration: line-through;
      color: $text-light;
    }
  }
}

.todo-item__checkbox {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;

  input[type='checkbox'] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .checkmark {
      background: $primary;
      border-color: $primary;

      &::after {
        display: block;
      }
    }

    &:disabled {
      cursor: default;
    }

    &:disabled + .checkmark {
      cursor: default;
    }
  }

  .checkmark {
    width: 18px;
    height: 18px;
    border: 2px solid $border;
    border-radius: 5px;
    transition: background $transition, border-color $transition;
    position: relative;

    &::after {
      content: '';
      display: none;
      position: absolute;
      left: 4px;
      top: 1px;
      width: 5px;
      height: 9px;
      border: 2px solid #fff;
      border-top: none;
      border-left: none;
      transform: rotate(45deg);
    }
  }
}

.todo-item__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.9375rem;
  color: $text;
  padding: 2px 0;

  &::placeholder {
    color: $text-light;
  }

  &:focus {
    color: $text;
  }
}

.todo-item__text {
  flex: 1;
  font-size: 0.9375rem;
  color: $text;
  padding: 2px 0;
}

.todo-item__delete {
  background: none;
  border: none;
  color: $text-light;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: $radius-sm;
  opacity: 0;
  transition: opacity $transition, color $transition, background $transition;
  flex-shrink: 0;

  &:hover {
    color: $danger;
    background: $danger-light;
  }
}
</style>
