<template>
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-title">issue tracker</div>
        <div class="page-sub">{{ filteredIssues.length }} issues found</div>
      </div>
      <router-link to="/app/create" class="btn btn-primary">+ report bug</router-link>
    </div>

    <div class="filter-bar">
      <div
        v-for="s in statuses"
        :key="s.value"
        :class="['filter-chip', { active: filterStatus === s.value }]"
        @click="filterStatus = s.value"
      >{{ s.label }}</div>
      <div style="margin-left:auto;display:flex;gap:8px;align-items:center;">
        <select v-model="filterPriority" style="width:auto;padding:7px 12px;font-size:.83rem;">
          <option value="">all priorities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
    </div>

    <div class="card" style="padding:0">
      <div v-if="issuesStore.loading" class="empty-state">
        <div class="empty-icon">⏳</div>
        <p>loading issues…</p>
      </div>
      <div v-else-if="filteredIssues.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>no issues match your filters</p>
        <button class="btn btn-ghost" style="margin-top:12px" @click="filterStatus='';filterPriority=''">clear filters</button>
      </div>
      <div class="table-wrap" v-else>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Title</th><th>Status</th><th>Priority</th>
              <th>Assignee</th><th>Tags</th><th>Created</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="issue in filteredIssues"
              :key="issue.id"
              class="issue-row"
              @click="router.push('/app/issues/' + issue.id)"
            >
              <td><span class="issue-id">#{{ issue.id }}</span></td>
              <td><span class="issue-title">{{ issue.title }}</span></td>
              <td><span :class="'status status-' + issue.status.replace(' ','-')">{{ issue.status }}</span></td>
              <td><span :class="'priority prio-' + issue.priority.toLowerCase()">{{ issue.priority }}</span></td>
              <td>
                <div class="assignee-cell">
                  <div class="avatar avatar-sm">{{ issue.assignee?.charAt(0) }}</div>
                  {{ issue.assignee }}
                </div>
              </td>
              <td>
                <span v-for="t in issue.tags" :key="t" class="tag">{{ t }}</span>
              </td>
              <td><span class="issue-date">{{ issue.created }}</span></td>
              <td @click.stop>
                <button class="btn btn-ghost del-btn" @click="handleDelete(issue.id)">🗑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useIssuesStore } from '../stores/issues'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

const props = defineProps({ searchQ: String })

const router = useRouter()
const issuesStore = useIssuesStore()
const auth = useAuthStore()
const toast = useToastStore()

const filterStatus = ref('')
const filterPriority = ref('')

const statuses = [
  { value: '', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

const filteredIssues = computed(() => {
  return issuesStore.issues.filter(i => {
    const matchStatus   = !filterStatus.value   || i.status === filterStatus.value
    const matchPriority = !filterPriority.value || i.priority === filterPriority.value
    const q = (props.searchQ || '').toLowerCase()
    const matchSearch   = !q || i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
    return matchStatus && matchPriority && matchSearch
  })
})

async function handleDelete(id) {
  if (!confirm('Delete this issue?')) return
  await issuesStore.remove(id, auth.fullName)
  toast.info('Issue deleted')
}
</script>

<style scoped>
.issue-row { cursor: pointer; }
.issue-id   { font-family: 'DM Mono', monospace; color: var(--text3); font-size: .78rem; }
.issue-title { font-weight: 500; }
.issue-date  { font-size: .8rem; color: var(--text3); font-family: 'DM Mono', monospace; }
.del-btn     { padding: 5px 10px; font-size: .78rem; }
.assignee-cell { display: flex; align-items: center; gap: 8px; font-size: .87rem; }
.avatar-sm { width: 26px; height: 26px; font-size: .7rem; }
.empty-state { text-align: center; padding: 60px 20px; color: var(--text3); }
.empty-icon  { font-size: 3rem; margin-bottom: 14px; }
.empty-state p { font-size: .9rem; margin-top: 8px; }
</style>
