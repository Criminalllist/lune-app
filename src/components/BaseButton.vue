<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
)
</script>

<template>
  <button :class="['btn', `btn--${variant}`, `btn--${size}`]" :disabled="disabled" :type="type">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables' as *;

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-xs;
  font-weight: 500;
  border: none;
  border-radius: $radius;
  cursor: pointer;
  transition: background $transition, color $transition, box-shadow $transition, transform $transition-fast;
  white-space: nowrap;
  font-family: inherit;

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Sizes
  &--sm {
    padding: 6px 12px;
    font-size: 0.8125rem;
    border-radius: $radius-sm;
  }

  &--md {
    padding: 10px 18px;
    font-size: 0.9375rem;
  }

  &--lg {
    padding: 13px 24px;
    font-size: 1rem;
    border-radius: $radius-lg;
  }

  // Variants
  &--primary {
    background: $primary;
    color: #fff;

    &:hover:not(:disabled) {
      background: $primary-hover;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }
  }

  &--secondary {
    background: $surface;
    color: $text;
    border: 1px solid $border;

    &:hover:not(:disabled) {
      background: $surface-2;
      border-color: color.adjust($border, $lightness: -8%);
    }
  }

  &--danger {
    background: $danger;
    color: #fff;

    &:hover:not(:disabled) {
      background: $danger-hover;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
    }
  }

  &--ghost {
    background: transparent;
    color: $text-muted;

    &:hover:not(:disabled) {
      background: $surface-2;
      color: $text;
    }
  }
}
</style>
