<template>
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-title">team Members</div>
        <div class="page-sub">{{ members.length }} members across your workspace</div>
      </div>
    </div>

    <div v-if="loading" class="empty-state"><div class="empty-icon">⏳</div><p>Loading…</p></div>

    <div v-else class="grid-3">
      <div class="card member-card" v-for="m in members" :key="m.name">
        <div class="member-top">
          <div class="member-avatar">{{ m.name.charAt(0) }}</div>
          <div>
            <div class="member-name">{{ m.name }}</div>
            <div class="member-role">{{ m.role }}</div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="member-stats">
          <div class="mstat">
            <div class="mstat-n" style="color:var(--accent2)">{{ m.open }}</div>
            <div class="mstat-l">Open</div>
          </div>
          <div class="mstat">
            <div class="mstat-n" style="color:var(--accent3)">{{ m.resolved }}</div>
            <div class="mstat-l">Resolved</div>
          </div>
          <div class="mstat">
            <div class="mstat-n" style="color:var(--accent)">{{ m.open + m.resolved }}</div>
            <div class="mstat-l">Total</div>
          </div>
        </div>
        <div class="progress-bar" style="margin-top:14px">
          <div class="progress-fill"
            :style="{ width: (m.resolved / (m.open + m.resolved) * 100).toFixed(0) + '%' }">
          </div>
        </div>
        <div style="font-size:.74rem;color:var(--text3);margin-top:6px;text-align:right">
          {{ (m.resolved / (m.open + m.resolved) * 100).toFixed(0) }}% resolution rate
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { teamApi } from '../services/api'

const members = ref([])
const loading = ref(true)

onMounted(async () => {
  members.value = await teamApi.getMembers()
  loading.value = false
})
</script>

<style scoped>
.member-card { transition: border-color var(--transition), transform var(--transition); }
.member-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.member-top { display:flex; align-items:center; gap:14px; margin-bottom:16px; }
.member-avatar {
  width:52px; height:52px; border-radius:50%;
  background:linear-gradient(135deg, var(--accent), var(--accent2));
  display:flex; align-items:center; justify-content:center;
  font-size:1.2rem; font-weight:700; color:#fff; flex-shrink:0;
}
.member-name { font-weight:700; font-size:1rem; }
.member-role { color:var(--text3); font-size:.82rem; margin-top:2px; }
.member-stats { display:flex; justify-content:space-around; }
.mstat { text-align:center; }
.mstat-n { font-family:'Syne',sans-serif; font-weight:800; font-size:1.4rem; }
.mstat-l { font-size:.75rem; color:var(--text3); margin-top:2px; }
.empty-state { text-align:center; padding:80px; color:var(--text3); }
.empty-icon { font-size:3rem; margin-bottom:12px; }
</style>
