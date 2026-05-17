<template>
  <div class="page" v-if="issue">
    <div class="page-header">
      <div>
        <div class="breadcrumb">
          <router-link to="/app/issues">Issues</router-link>
          <span>›</span>
          <span class="mono">#{{ issue.id }}</span>
        </div>
        <div class="page-title" style="margin-top:6px">{{ issue.title }}</div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-success" @click="handleResolve">✓ Resolve</button>
        <button class="btn btn-danger" @click="handleDelete">🗑 Delete</button>
      </div>
    </div>

    <div class="detail-layout">
      <!-- Left: description + comments -->
      <div class="detail-main">
        <div class="card" style="margin-bottom:20px">
          <div class="card-title">📋 Description</div>
          <p class="description-text">{{ issue.description }}</p>

          <template v-if="issue.steps">
            <div class="divider"></div>
            <div class="card-title">🔁 Steps to Reproduce</div>
            <pre class="steps-text">{{ issue.steps }}</pre>
          </template>
        </div>

        <div class="card">
          <div class="card-title">💬 Comments ({{ issue.comments.length }})</div>

          <div v-if="issue.comments.length === 0" class="no-comments">No comments yet — be the first!</div>

          <div v-for="(c, i) in issue.comments" :key="i" class="comment">
            <div class="avatar comment-avatar">{{ c.author?.charAt(0) }}</div>
            <div class="comment-body">
              <div class="comment-meta">
                <span class="comment-author">{{ c.author }}</span>
                <span class="comment-time">{{ c.time }}</span>
              </div>
              <div class="comment-text">{{ c.text }}</div>
            </div>
          </div>

          <div class="comment-input-row">
            <div class="avatar">{{ auth.initials }}</div>
            <input
              type="text"
              v-model="newComment"
              placeholder="Add a comment…"
              style="flex:1"
              @keyup.enter="handleComment"
            />
            <button class="btn btn-primary" @click="handleComment">Post</button>
          </div>
        </div>
      </div>

      <!-- Right: meta sidebar -->
      <div class="detail-sidebar">
        <div class="card">
          <div class="card-title">📌 Details</div>

          <div class="meta-row">
            <span class="meta-label">Status</span>
            <select v-model="issue.status" @change="handleStatusChange" style="width:auto;padding:5px 10px;font-size:.82rem">
              <option>open</option>
              <option>in progress</option>
              <option>resolved</option>
              <option>closed</option>
            </select>
          </div>

          <div class="meta-row">
            <span class="meta-label">Priority</span>
            <span :class="'priority prio-' + issue.priority.toLowerCase()">{{ issue.priority }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Assignee</span>
            <div class="assignee-mini">
              <div class="avatar" style="width:24px;height:24px;font-size:.65rem">{{ issue.assignee?.charAt(0) }}</div>
              {{ issue.assignee }}
            </div>
          </div>

          <div class="meta-row">
            <span class="meta-label">Environment</span>
            <span class="meta-val">{{ issue.env || '–' }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Created</span>
            <span class="meta-val mono">{{ issue.created }}</span>
          </div>

          <div class="meta-row" style="flex-direction:column;align-items:flex-start;gap:8px">
            <span class="meta-label">Tags</span>
            <div style="display:flex;flex-wrap:wrap;gap:4px">
              <span v-for="t in issue.tags" :key="t" class="tag">{{ t }}</span>
              <span v-if="!issue.tags?.length" style="color:var(--text3);font-size:.82rem">None</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="page">
    <div class="empty-state">
      <div class="empty-icon">{{ loading ? '⏳' : '❌' }}</div>
      <p>{{ loading ? 'Loading…' : 'Issue not found.' }}</p>
      <router-link to="/app/issues" class="btn btn-ghost" style="margin-top:12px">← Back to Issues</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useIssuesStore } from '../stores/issues'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

const route  = useRoute()
const router = useRouter()
const issuesStore = useIssuesStore()
const auth   = useAuthStore()
const toast  = useToastStore()

const newComment = ref('')
const loading    = ref(false)

const issue = computed(() => issuesStore.issues.find(i => i.id === route.params.id))

onMounted(async () => {
  if (!issuesStore.issues.length) {
    loading.value = true
    await issuesStore.fetchAll()
    loading.value = false
  }
})

async function handleStatusChange() {
  await issuesStore.update(issue.value.id, { status: issue.value.status }, auth.fullName)
  toast.success('Status updated')
}

async function handleResolve() {
  await issuesStore.update(issue.value.id, { status: 'resolved' }, auth.fullName)
  toast.success('Issue resolved ✅')
}

async function handleDelete() {
  if (!confirm('Delete this issue?')) return
  await issuesStore.remove(issue.value.id, auth.fullName)
  toast.info('Issue deleted')
  router.push('/app/issues')
}

async function handleComment() {
  if (!newComment.value.trim()) return
  await issuesStore.addComment(issue.value.id, newComment.value, auth.fullName)
  newComment.value = ''
  toast.success('Comment posted')
}
</script>

<style scoped>
.breadcrumb { display:flex; align-items:center; gap:8px; font-size:.83rem; color:var(--text3); }
.breadcrumb a { color:var(--accent); text-decoration:none; }
.breadcrumb a:hover { text-decoration:underline; }
.mono { font-family:'DM Mono',monospace; }

.detail-layout { display:grid; grid-template-columns:1fr 280px; gap:24px; }
@media(max-width:900px){ .detail-layout{ grid-template-columns:1fr; } }

.description-text { font-size:.92rem; line-height:1.8; color:var(--text2); }
.steps-text { font-family:'DM Mono',monospace; font-size:.83rem; color:var(--text2); white-space:pre-wrap; line-height:1.6; background:var(--bg3); padding:14px; border-radius:8px; }

.no-comments { color:var(--text3); font-size:.88rem; margin-bottom:16px; }

.comment { display:flex; gap:12px; margin-bottom:18px; }
.comment-avatar { flex-shrink:0; }
.comment-body { background:var(--bg3); border:1px solid var(--border); border-radius:10px; padding:14px; flex:1; }
.comment-meta { font-size:.78rem; color:var(--text3); margin-bottom:6px; display:flex; gap:12px; }
.comment-author { font-weight:600; color:var(--text2); }
.comment-time { }
.comment-text { font-size:.9rem; line-height:1.6; }

.comment-input-row { display:flex; gap:10px; margin-top:20px; align-items:center; }

.meta-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:.88rem; }
.meta-row:last-child { border-bottom:none; }
.meta-label { color:var(--text3); font-size:.75rem; font-weight:600; text-transform:uppercase; letter-spacing:.05em; font-family:'DM Mono',monospace; }
.meta-val { font-size:.87rem; color:var(--text2); }
.assignee-mini { display:flex; align-items:center; gap:6px; font-size:.87rem; }

.empty-state { text-align:center; padding:80px 20px; color:var(--text3); }
.empty-icon  { font-size:3rem; margin-bottom:14px; }
.empty-state p { font-size:.9rem; }
</style>
