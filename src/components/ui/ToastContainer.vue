<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div v-for="t in toastStore.toasts" :key="t.id" :class="['toast', t.type]">
          <span>{{ t.icon }}</span> {{ t.msg }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '../../stores/toast'
const toastStore = useToastStore()
</script>

<style scoped>
.toast-container {
  position: fixed; bottom: 28px; right: 28px; z-index: 9999;
  display: flex; flex-direction: column; gap: 10px;
}
.toast {
  background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
  padding: 14px 20px; font-size: 0.88rem; display: flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 32px #00000055; min-width: 260px;
}
.toast.success { border-left: 3px solid var(--accent3); }
.toast.error   { border-left: 3px solid var(--accent2); }
.toast.info    { border-left: 3px solid var(--accent); }
.toast.warning { border-left: 3px solid var(--accent4); }
.toast-enter-active { animation: slideIn 0.25s ease; }
.toast-leave-active { animation: slideIn 0.2s ease reverse; }
@keyframes slideIn {
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>
