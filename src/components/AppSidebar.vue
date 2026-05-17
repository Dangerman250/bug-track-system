<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <div class="sidebar-logo">
      <div class="logo-mark">🐛</div>
      <span>bugnest</span>
    </div>

    <div class="sidebar-nav">
      <!-- MAIN -->
      <div class="sidebar-section">
        <div class="section-label">main</div>
        <router-link class="sidebar-item" to="/app/dashboard" active-class="active">
          <div class="si-icon">📊</div><span>dashboard</span>
        </router-link>
        <router-link class="sidebar-item" to="/app/issues" active-class="active">
          <div class="si-icon">🐞</div><span>issues</span>
          <span v-if="issuesStore.openCount" class="sidebar-badge">{{ issuesStore.openCount }}</span>
        </router-link>
        <router-link class="sidebar-item" to="/app/create" active-class="active">
          <div class="si-icon">➕</div><span>report bug</span>
        </router-link>
      </div>

      <!-- PROJECTS -->
      <div class="sidebar-section">
        <div class="section-label-row">
          <span class="section-label" style="flex:1;padding:0">projects</span>
          <router-link to="/app/projects" class="pj-all-btn">all</router-link>
          <button class="pj-add-btn" @click.prevent="showNewProject=true">+</button>
        </div>

        <div v-if="!projectsStore.projects.length" class="pj-sidebar-empty">no projects yet</div>

        <router-link
          v-for="p in projectsStore.projects.slice(0,6)"
          :key="p.id"
          class="sidebar-item pj-item"
          to="/app/projects"
          active-class="active"
        >
          <div class="pj-dot" :style="{background: p.color}"></div>
          <span class="pj-item-name">{{ p.name }}</span>
          <span v-if="p.openCount" class="pj-open-count">{{ p.openCount }}</span>
        </router-link>

        <router-link class="sidebar-item" to="/app/projects" active-class="active">
          <div class="si-icon">📁</div><span>all projects</span>
        </router-link>
      </div>

      <!-- WORKSPACE -->
      <div class="sidebar-section">
        <div class="section-label">workspace</div>
        <router-link class="sidebar-item" to="/app/team" active-class="active">
          <div class="si-icon">👥</div><span>team</span>
        </router-link>
        <router-link class="sidebar-item" to="/app/activity" active-class="active">
          <div class="si-icon">⚡</div><span>activity</span>
        </router-link>
      </div>

      <!-- ACCOUNT -->
      <div class="sidebar-section">
        <div class="section-label">account</div>
        <router-link class="sidebar-item" to="/app/profile" active-class="active">
          <div class="si-icon">👤</div><span>my profile</span>
        </router-link>
        <div class="sidebar-item danger" @click="handleLogout">
          <div class="si-icon danger-icon">🚪</div><span>sign out</span>
        </div>
      </div>
    </div>

    <!-- User card -->
    <div class="sidebar-footer">
      <router-link to="/app/profile" class="user-profile-card">
        <div class="user-avatar-wrap">
          <div class="user-avatar">
            <img v-if="auth.user?.avatarUrl" :src="auth.user.avatarUrl" alt="profile" />
            <span v-else>{{ auth.initials }}</span>
          </div>
          <div class="user-status-dot"></div>
        </div>
        <div class="user-info">
          <div class="user-name">{{ auth.fullName }}</div>
          <div class="user-role">
            <span class="role-dot" :class="roleClass"></span>{{ auth.user?.role }}
          </div>
        </div>
        <div class="user-chevron">›</div>
      </router-link>
    </div>

    <!-- Quick-create project popup -->
    <Teleport to="body">
      <div v-if="showNewProject" class="qc-overlay" @click.self="showNewProject=false">
        <div class="qc-modal">
          <div class="qc-hd">
            <span>quick add project</span>
            <button class="qc-x" @click="showNewProject=false">✕</button>
          </div>
          <div class="form-group">
            <label>Name *</label>
            <input v-model="qc.name" placeholder="My App" @keydown.enter="quickCreate" />
          </div>
          <div class="form-group">
            <label>Website URL</label>
            <input v-model="qc.url" placeholder="https://myapp.com" />
          </div>
          <div class="form-group">
            <label>Colour</label>
            <div class="colour-row">
              <button
                v-for="c in COLOURS" :key="c" class="colour-dot"
                :style="{background:c,outline:qc.color===c?'3px solid '+c:'none',outlineOffset:'3px'}"
                @click="qc.color=c"
              />
            </div>
          </div>
          <p v-if="qcErr" class="qc-err">⚠️ {{ qcErr }}</p>
          <div class="qc-ft">
            <button class="btn btn-ghost" @click="showNewProject=false">cancel</button>
            <button class="btn btn-primary" :disabled="qcSaving" @click="quickCreate">
              {{ qcSaving ? 'Creating…' : 'create' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useIssuesStore } from '../stores/issues'
import { useProjectsStore } from '../stores/projects'
import { useToastStore } from '../stores/toast'
import { useRouter } from 'vue-router'

defineProps({ isOpen: Boolean })

const auth          = useAuthStore()
const issuesStore   = useIssuesStore()
const projectsStore = useProjectsStore()
const toast         = useToastStore()
const router        = useRouter()

const COLOURS = ['#6c63ff','#18a979','#e5484d','#e07b39','#0ea5e9','#f59e0b','#8b5cf6','#ec4899','#3f4452']

const roleClass = computed(() => {
  const r = auth.user?.role?.toLowerCase()
  if (r === 'admin') return 'role-admin'
  if (r === 'developer' || r === 'senior developer') return 'role-dev'
  if (r === 'tester') return 'role-tester'
  return 'role-other'
})

function handleLogout() {
  auth.logout()
  toast.info('signed out successfully')
  router.push('/')
}

if (!projectsStore.projects.length) projectsStore.fetchAll()

const showNewProject = ref(false)
const qcSaving = ref(false)
const qcErr    = ref('')
const qc       = ref({ name:'', url:'', color:'#6c63ff' })

async function quickCreate() {
  qcErr.value = ''
  if (!qc.value.name.trim()) { qcErr.value = 'Name is required.'; return }
  qcSaving.value = true
  const r = await projectsStore.create({ name:qc.value.name.trim(), url:qc.value.url.trim(), color:qc.value.color, stack:[], description:'' }, auth.fullName)
  qcSaving.value = false
  if (r) {
    toast.success(`"${r.name}" created 🚀`)
    qc.value = { name:'', url:'', color:'#6c63ff' }
    showNewProject.value = false
  } else {
    qcErr.value = projectsStore.error || 'Failed'
  }
}
</script>

<style scoped>
.sidebar { width:var(--sidebar-w); background:var(--bg2); border-right:1px solid var(--border); display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; z-index:100; transition:transform var(--transition); box-shadow:2px 0 12px rgba(0,0,0,.04); }
.sidebar-logo { padding:22px 18px 18px; font-family:'Outfit',sans-serif; font-weight:800; font-size:1.25rem; display:flex; align-items:center; gap:10px; border-bottom:1px solid var(--border); letter-spacing:-.03em; color:var(--text); }
.logo-mark { width:32px; height:32px; background:var(--accent); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:15px; }
.sidebar-nav { flex:1; overflow-y:auto; padding:8px 0; }
.sidebar-section { margin-bottom:4px; }
.section-label { padding:14px 18px 6px; font-size:.68rem; font-weight:700; letter-spacing:.1em; color:var(--text3); text-transform:uppercase; font-family:'JetBrains Mono',monospace; display:block; }
.section-label-row { display:flex; align-items:center; padding:14px 10px 6px 18px; gap:4px; }
.pj-all-btn, .pj-add-btn { background:none; border:none; cursor:pointer; padding:2px 7px; font-size:.72rem; font-weight:700; color:var(--text3); border-radius:6px; transition:all .12s; font-family:'Inter',sans-serif; text-decoration:none; }
.pj-all-btn:hover, .pj-add-btn:hover { background:var(--bg3); color:var(--accent); }
.pj-add-btn { font-size:1rem; line-height:1; }
.pj-sidebar-empty { padding:2px 18px 8px; font-size:.72rem; color:var(--text3); font-style:italic; }
.pj-item { gap:9px; }
.pj-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
.pj-item-name { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:.83rem; }
.pj-open-count { background:#ffefef; color:var(--accent2); font-size:.6rem; font-weight:700; padding:1px 6px; border-radius:20px; font-family:'JetBrains Mono',monospace; }
.sidebar-item { display:flex; align-items:center; gap:10px; padding:9px 10px 9px 14px; margin:1px 8px; border-radius:8px; cursor:pointer; color:var(--text2); font-size:.85rem; transition:all var(--transition); text-decoration:none; font-weight:500; }
.sidebar-item span { flex:1; }
.sidebar-item:hover { background:var(--bg); color:var(--text); }
.sidebar-item.active { background:var(--accent-light); color:var(--accent); font-weight:600; }
.sidebar-item.active .si-icon { background:var(--accent); color:#fff; }
.sidebar-item.danger { color:var(--accent2); }
.sidebar-item.danger:hover { background:var(--accent2-light); }
.si-icon { width:28px; height:28px; background:var(--surface2); border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; transition:all var(--transition); }
.danger-icon { background:var(--accent2-light); }
.sidebar-badge { background:var(--accent); color:#fff; font-size:.65rem; font-weight:700; padding:2px 7px; border-radius:50px; font-family:'JetBrains Mono',monospace; }
.sidebar-footer { padding:12px; border-top:1px solid var(--border); }
.user-profile-card { display:flex; align-items:center; gap:11px; padding:11px 12px; border-radius:10px; background:var(--bg); border:1px solid var(--border); cursor:pointer; text-decoration:none; color:inherit; transition:all var(--transition); box-shadow:var(--shadow-sm); }
.user-profile-card:hover { border-color:var(--accent); background:var(--accent-light); transform:translateY(-1px); }
.user-avatar-wrap { position:relative; flex-shrink:0; }
.user-avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,var(--accent),#6b7280); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.88rem; color:#fff; overflow:hidden; border:2px solid var(--border); }
.user-avatar img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
.user-status-dot { position:absolute; bottom:0; right:0; width:10px; height:10px; border-radius:50%; background:var(--accent3); border:2px solid white; }
.user-info { flex:1; min-width:0; }
.user-name { font-size:.83rem; font-weight:700; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.user-role { font-size:.72rem; color:var(--text3); margin-top:2px; display:flex; align-items:center; gap:5px; }
.role-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.role-admin { background:var(--accent2); } .role-dev { background:var(--accent); } .role-tester { background:var(--accent3); } .role-other { background:var(--accent4); }
.user-chevron { font-size:1.1rem; color:var(--text3); transition:transform var(--transition); }
.user-profile-card:hover .user-chevron { transform:translateX(2px); color:var(--accent); }
@media(max-width:720px) { .sidebar { transform:translateX(-100%); } .sidebar.open { transform:translateX(0); } }

/* quick-create popup */
.qc-overlay { position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(3px); }
.qc-modal { background:#fff; border-radius:18px; padding:26px; width:100%; max-width:430px; box-shadow:0 20px 60px rgba(0,0,0,.2); animation:qcin .2s ease; }
@keyframes qcin{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.qc-hd { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; font-family:'Outfit',sans-serif; font-size:1.1rem; font-weight:700; }
.qc-x { background:var(--bg3); border:none; border-radius:8px; width:28px; height:28px; cursor:pointer; font-size:.78rem; }
.qc-x:hover { background:var(--border); }
.qc-ft { display:flex; gap:10px; justify-content:flex-end; margin-top:18px; }
.qc-err { background:#ffefef; border:1px solid #ffc0c0; border-radius:8px; padding:9px 12px; font-size:.82rem; color:var(--accent2); margin-bottom:6px; }
.colour-row { display:flex; gap:7px; flex-wrap:wrap; }
.colour-dot { width:24px; height:24px; border-radius:7px; border:none; cursor:pointer; transition:transform .12s; }
.colour-dot:hover { transform:scale(1.2); }
</style>
