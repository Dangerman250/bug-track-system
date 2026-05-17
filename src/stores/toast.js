import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  function add(msg, type = 'info') {
    const icons = { success: '✅', error: '❌', info: '💡', warning: '⚠️' }
    const id = Date.now() + Math.random()
    toasts.value.push({ id, msg, type, icon: icons[type] || '💡' })
    setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3500)
  }

  const success = (msg) => add(msg, 'success')
  const error = (msg) => add(msg, 'error')
  const info = (msg) => add(msg, 'info')
  const warning = (msg) => add(msg, 'warning')

  return { toasts, add, success, error, info, warning }
})
