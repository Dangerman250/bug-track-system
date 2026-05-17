import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('bn_current_user') || 'null'))
  const loading = ref(false)
  const error = ref('')

  const isLoggedIn = computed(() => !!user.value)
  const initials = computed(() => {
    if (!user.value) return '?'
    return (user.value.firstName?.charAt(0) + user.value.lastName?.charAt(0)).toUpperCase()
  })
  const fullName = computed(() => user.value ? `${user.value.firstName} ${user.value.lastName}` : '')

  function persist(u) {
    user.value = u
    localStorage.setItem('bn_current_user', JSON.stringify(u))
  }

  async function login(email, password) {
    loading.value = true; error.value = ''
    try {
      const u = await authApi.login(email, password)
      persist(u)
      return true
    } catch (e) {
      error.value = e.message; return false
    } finally { loading.value = false }
  }

  async function loginDemo() {
    loading.value = true
    await new Promise(r => setTimeout(r, 400))
    persist({ id: 1, firstName: 'Alex', lastName: 'Dev', email: 'alex@bugtrack.io', role: 'Senior Developer', bio: 'Full-stack dev who loves clean code.', location: 'San Francisco, CA', github: 'github.com/alexdev', avatarUrl: '' })
    loading.value = false
  }

  async function register(data) {
    loading.value = true; error.value = ''
    try {
      const u = await authApi.register(data)
      persist(u)
      return true
    } catch (e) {
      error.value = e.message; return false
    } finally { loading.value = false }
  }

  async function updateProfile(updates) {
    loading.value = true; error.value = ''
    try {
      const u = await authApi.updateProfile(user.value.id, updates)
      persist(u)
      return true
    } catch (e) {
      error.value = e.message; return false
    } finally { loading.value = false }
  }

  async function changePassword(currentPw, newPw) {
    loading.value = true; error.value = ''
    try {
      await authApi.changePassword(user.value.id, currentPw, newPw)
      return true
    } catch (e) {
      error.value = e.message; return false
    } finally { loading.value = false }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('bn_current_user')
  }

  return { user, loading, error, isLoggedIn, initials, fullName, login, loginDemo, register, updateProfile, changePassword, logout }
})
