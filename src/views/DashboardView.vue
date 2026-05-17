<template>
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-title">dashboard</div>
        <div class="page-sub">welcome back, {{ auth.user?.firstName }} 👋 here's what's happening</div>
      </div>
      <router-link to="/app/create" class="btn btn-primary">+ report bug</router-link>
    </div>

    <!-- Stat Cards -->
    <div class="grid-4" style="margin-bottom: 22px">
      <div class="stat-card" v-for="s in statCards" :key="s.label">
        <div class="stat-card-icon" :style="{ background: s.bg }">{{ s.icon }}</div>
        <div>
          <div class="stat-card-n" :style="{ color: s.color }">{{ s.n }}</div>
          <div class="stat-card-l">{{ s.label }}</div>
          <div class="stat-card-delta" :style="{ color: s.deltaColor }">{{ s.delta }}</div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid-2" style="margin-bottom: 22px">
      <div class="card">
        <div class="card-title">📈 issues this week</div>
        <div class="mini-bar">
          <div v-for="(h, i) in chartData" :key="i" class="bar"
            :style="{ height: h + '%', background: i === 6 ? 'var(--accent)' : 'var(--surface2)', '--delay': i * 0.07 + 's' }">
          </div>
        </div>
        <div class="bar-labels">
          <span v-for="d in ['mon','tue','wed','thu','fri','sat','sun']" :key="d">{{ d }}</span>
        </div>
      </div>
      <div class="card">
        <div class="card-title">🎯 resolution rate by priority</div>
        <div v-for="r in resolutionRates" :key="r.label" class="resolution-row">
          <div class="resolution-meta">
            <span class="resolution-label">{{ r.label }}</span>
            <span class="resolution-pct" :style="{ color: r.color }">{{ r.pct }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: r.pct + '%', background: `linear-gradient(90deg, ${r.color}, ${r.color2})` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Issues Table -->
    <div class="card" style="padding: 0">
      <div class="table-header">
        <div class="card-title" style="margin: 0">🕐 recent issues</div>
        <router-link to="/app/issues" class="btn btn-ghost" style="padding: 6px 14px; font-size: 0.8rem">view all →</router-link>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>id</th><th>title</th><th>status</th><th>priority</th><th>assignee</th><th>created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="issue in issuesStore.issues.slice(0, 5)" :key="issue.id"
              style="cursor: pointer" @click="router.push('/app/issues/' + issue.id)">
              <td><span class="issue-id">#{{ issue.id }}</span></td>
              <td class="issue-title-cell">{{ issue.title }}</td>
              <td><span :class="'status status-' + issue.status.replace(' ', '-').toLowerCase()">{{ issue.status }}</span></td>
              <td><span :class="'priority prio-' + issue.priority.toLowerCase()">{{ issue.priority }}</span></td>
              <td style="font-size: 0.83rem; color: var(--text2)">{{ issue.assignee }}</td>
              <td><span class="issue-date">{{ issue.created }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useIssuesStore } from '../stores/issues'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const issuesStore = useIssuesStore()
const router = useRouter()

const statCards = computed(() => [
  { icon: '🐛', label: 'open issues', n: issuesStore.stats.open, color: 'var(--accent2)', bg: 'var(--accent2-light)', delta: '↑ 3 this week', deltaColor: 'var(--accent2)' },
  { icon: '⚙️', label: 'in progress', n: issuesStore.stats.inProgress, color: 'var(--accent4)', bg: 'var(--accent4-light)', delta: 'active', deltaColor: 'var(--accent4)' },
  { icon: '✅', label: 'resolved', n: issuesStore.stats.resolved, color: 'var(--accent3)', bg: 'var(--accent3-light)', delta: '↑ 8 this week', deltaColor: 'var(--accent3)' },
  { icon: '📦', label: 'total issues', n: issuesStore.stats.total, color: 'var(--accent)', bg: 'var(--accent-light)', delta: 'all time', deltaColor: 'var(--text3)' },
])

const chartData = [40, 65, 50, 80, 60, 75, 90]
const resolutionRates = [
  { label: 'critical', pct: 72, color: '#e5484d', color2: '#ff7089' },
  { label: 'high', pct: 85, color: '#e07b39', color2: '#ffd200' },
  { label: 'medium', pct: 94, color: '#3f4452', color2: '#6b7280' },
  { label: 'low', pct: 98, color: '#18a979', color2: '#6ee7b7' },
]
</script>

<style scoped>
.stat-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 20px; display: flex; align-items: center; gap: 16px;
  box-shadow: var(--shadow-sm); transition: all var(--transition);
}
.stat-card:hover { box-shadow: var(--shadow); transform: translateY(-1px); }
.stat-card-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.stat-card-n { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.8rem; line-height: 1; letter-spacing: -0.03em; }
.stat-card-l { font-size: 0.78rem; color: var(--text2); margin-top: 3px; font-weight: 500; text-transform: lowercase; }
.stat-card-delta { font-size: 0.74rem; margin-top: 5px; font-weight: 600; }

.mini-bar { display: flex; align-items: flex-end; gap: 6px; height: 80px; }
.bar {
  flex: 1; border-radius: 4px 4px 0 0; min-width: 8px;
  animation: barGrow 0.6s ease both var(--delay);
}
@keyframes barGrow { from { transform: scaleY(0); transform-origin: bottom; } to { transform: scaleY(1); } }

.bar-labels { display: flex; justify-content: space-between; margin-top: 8px; }
.bar-labels span { font-size: 0.68rem; color: var(--text3); flex: 1; text-align: center; font-family: 'JetBrains Mono', monospace; }

.resolution-row { margin: 12px 0; }
.resolution-meta { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 6px; }
.resolution-label { color: var(--text2); font-weight: 500; text-transform: lowercase; }
.resolution-pct { font-weight: 700; font-family: 'JetBrains Mono', monospace; }

.table-header { padding: 18px 22px 0; display: flex; align-items: center; justify-content: space-between; }
.issue-id { font-family: 'JetBrains Mono', monospace; color: var(--text3); font-size: 0.75rem; }
.issue-title-cell { font-weight: 500; font-size: 0.85rem; }
.issue-date { font-size: 0.77rem; color: var(--text3); font-family: 'JetBrains Mono', monospace; }
</style>
