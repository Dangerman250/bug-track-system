<template>
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-title">activity feed</div>
        <div class="page-sub">Recent changes across all issues</div>
      </div>
      <button class="btn btn-ghost" @click="refresh">↺ Refresh</button>
    </div>

    <div class="card">
      <div v-if="loading" class="empty-state"><div class="empty-icon">⏳</div><p>Loading…</p></div>
      <div v-else-if="feed.length === 0" class="empty-state">
        <div class="empty-icon">⚡</div><p>No activity yet</p>
      </div>
      <template v-else>
        <div class="feed-item" v-for="(a, i) in feed" :key="i">
          <div class="feed-dot" :style="{ background: a.color }"></div>
          <div class="feed-content">
            <div class="feed-action">
              <strong>{{ a.user }}</strong> {{ a.action }}
            </div>
            <div class="feed-time">{{ a.time }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { activityApi } from '../services/api'

const feed    = ref([])
const loading = ref(true)

async function refresh() {
  loading.value = true
  feed.value = await activityApi.getAll()
  loading.value = false
}
onMounted(refresh)
</script>

<style scoped>
.feed-item { display:flex; gap:16px; padding:16px 0; border-bottom:1px solid var(--border); align-items:flex-start; }
.feed-item:last-child { border-bottom:none; }
.feed-dot { width:10px; height:10px; border-radius:50%; margin-top:5px; flex-shrink:0; }
.feed-content { flex:1; }
.feed-action { font-size:.9rem; line-height:1.5; }
.feed-time { font-size:.76rem; color:var(--text3); margin-top:4px; font-family:'DM Mono',monospace; }
.empty-state { text-align:center; padding:60px; color:var(--text3); }
.empty-icon  { font-size:3rem; margin-bottom:12px; }
</style>
