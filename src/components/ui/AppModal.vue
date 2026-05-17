<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal" :style="{ width: width }">
          <div class="modal-header">
            <div>
              <slot name="title"><div class="modal-title">{{ title }}</div></slot>
            </div>
            <button class="close-btn" @click="$emit('update:modelValue', false)">✕</button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({ modelValue: Boolean, title: String, width: { type: String, default: '560px' } })
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: #00000088; backdrop-filter: blur(4px);
  z-index: 200; display: flex; align-items: center; justify-content: center;
}
.modal {
  background: var(--bg2); border: 1px solid var(--border); border-radius: 16px;
  padding: 32px; max-width: calc(100vw - 32px); max-height: 90vh; overflow-y: auto;
}
.modal-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 12px; }
.modal-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem; }
.close-btn { background: none; border: none; color: var(--text2); cursor: pointer; font-size: 1.2rem; padding: 4px; border-radius: 6px; transition: color var(--transition); flex-shrink: 0; }
.close-btn:hover { color: var(--text); }
.modal-enter-active { animation: modalIn 0.2s cubic-bezier(0.4,0,0.2,1); }
.modal-leave-active { animation: modalIn 0.15s cubic-bezier(0.4,0,0.2,1) reverse; }
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
