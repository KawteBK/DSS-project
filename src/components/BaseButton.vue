<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, danger, ghost
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    :disabled="disabled"
    class="base-button"
    :class="[variant, size]"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
}

.base-button:active:not(:disabled) {
  transform: scale(0.96);
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.primary {
  background-color: var(--primary);
  color: white;
  box-shadow: 0 4px 12px var(--primary-glow);
}

.primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.secondary {
  background-color: var(--bg-card);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.secondary:hover:not(:disabled) {
  background-color: var(--border-color);
}

.danger {
  background-color: #dc2626;
  color: white;
}

.danger:hover:not(:disabled) {
  background-color: #b91c1c;
}

.ghost {
  background-color: transparent;
  color: var(--text-muted);
}

.ghost:hover:not(:disabled) {
  background-color: var(--border-color);
  color: var(--text-main);
}

/* Sizes */
.sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.md {
  padding: 0.6rem 1.25rem;
  font-size: 0.95rem;
}

.lg {
  padding: 0.8rem 1.75rem;
  font-size: 1.1rem;
}
</style>

