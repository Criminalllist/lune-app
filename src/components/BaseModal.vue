<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal-container" role="dialog" aria-modal="true">
          <div v-if="title" class="modal-header">
            <h3>{{ title }}</h3>
            <button class="modal-close" aria-label="Close" @click="close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $space-md;
}

.modal-container {
  background: $surface;
  border-radius: $radius-lg;
  box-shadow: $shadow-lg;
  width: 100%;
  max-width: 420px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-lg $space-lg $space-md;
  border-bottom: 1px solid $border;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: $text;
  }
}

.modal-close {
  background: none;
  border: none;
  color: $text-muted;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-xs;
  border-radius: $radius-sm;
  transition: background $transition, color $transition;

  &:hover {
    background: $surface-2;
    color: $text;
  }
}

.modal-body {
  padding: $space-lg;

  p {
    color: $text-muted;
    line-height: 1.6;
  }
}

.modal-footer {
  padding: $space-md $space-lg $space-lg;
  display: flex;
  gap: $space-sm;
  justify-content: flex-end;
}

// Transition
.modal-enter-active,
.modal-leave-active {
  transition: opacity $transition;

  .modal-container {
    transition: transform $transition, opacity $transition;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.95) translateY(-8px);
    opacity: 0;
  }
}
</style>
