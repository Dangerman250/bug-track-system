import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { issuesApi } from '../services/api'

export const useIssuesStore = defineStore('issues', () => {
  const issues = ref([])
  const loading = ref(false)
  const error = ref('')
  const selectedIssue = ref(null)

  const openCount = computed(() => issues.value.filter(i => i.status === 'open').length)
  const stats = computed(() => ({
    open: issues.value.filter(i => i.status === 'open').length,
    inProgress: issues.value.filter(i => i.status === 'in progress').length,
    resolved: issues.value.filter(i => i.status === 'resolved').length,
    total: issues.value.length
  }))

  async function fetchAll() {
    loading.value = true
    try { issues.value = await issuesApi.getAll() }
    catch (e) { error.value = e.message }
    finally { loading.value = false }
  }

  async function create(data, author) {
    loading.value = true
    try {
      const issue = await issuesApi.create(data, author)
      issues.value.unshift(issue)
      return issue
    } catch (e) { error.value = e.message; return null }
    finally { loading.value = false }
  }

  async function update(id, updates, author) {
    try {
      const updated = await issuesApi.update(id, updates, author)
      const idx = issues.value.findIndex(i => i.id === id)
      if (idx !== -1) issues.value[idx] = updated
      if (selectedIssue.value?.id === id) selectedIssue.value = updated
      return updated
    } catch (e) { error.value = e.message; return null }
  }

  async function remove(id, author) {
    try {
      await issuesApi.delete(id, author)
      issues.value = issues.value.filter(i => i.id !== id)
      if (selectedIssue.value?.id === id) selectedIssue.value = null
      return true
    } catch (e) { error.value = e.message; return false }
  }

  async function addComment(id, text, author) {
    try {
      const updated = await issuesApi.addComment(id, text, author)
      const idx = issues.value.findIndex(i => i.id === id)
      if (idx !== -1) issues.value[idx] = updated
      if (selectedIssue.value?.id === id) selectedIssue.value = { ...updated }
      return updated
    } catch (e) { error.value = e.message; return null }
  }

  function setSelected(issue) { selectedIssue.value = issue }

  return { issues, loading, error, selectedIssue, openCount, stats, fetchAll, create, update, remove, addComment, setSelected }
})
