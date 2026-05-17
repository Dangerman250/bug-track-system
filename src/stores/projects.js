import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectsApi } from '../services/api'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const loading  = ref(false)
  const error    = ref('')

  const active       = computed(() => projects.value.filter(p => p.status === 'active'))
  const totalIssues  = computed(() => projects.value.reduce((s,p) => s+(p.issueCount||0), 0))

  function getById(id) { return projects.value.find(p => p.id === id) || null }

  async function fetchAll() {
    loading.value = true
    try { projects.value = await projectsApi.getAll() }
    catch(e) { error.value = e.message }
    finally { loading.value = false }
  }

  async function create(data, author) {
    loading.value = true
    try {
      const p = await projectsApi.create(data, author)
      projects.value.unshift(p)
      return p
    } catch(e) { error.value = e.message; return null }
    finally { loading.value = false }
  }

  async function update(id, data, author) {
    try {
      const updated = await projectsApi.update(id, data, author)
      const idx = projects.value.findIndex(p => p.id === id)
      if (idx !== -1) projects.value[idx] = { ...projects.value[idx], ...updated }
      return updated
    } catch(e) { error.value = e.message; return null }
  }

  async function remove(id, author) {
    try {
      await projectsApi.delete(id, author)
      projects.value = projects.value.filter(p => p.id !== id)
      return true
    } catch(e) { error.value = e.message; return false }
  }

  async function getIssues(projectId) {
    return projectsApi.getIssues(projectId)
  }

  return { projects, loading, error, active, totalIssues, getById, fetchAll, create, update, remove, getIssues }
})
