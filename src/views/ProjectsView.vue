<template>
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <div class="page-title">projects</div>
        <div class="page-sub">
          {{ store.active.length }} active &nbsp;·&nbsp; {{ store.totalIssues }} issues tracked
        </div>
      </div>
      <button class="btn btn-primary" @click="openCreate">+ new project</button>
    </div>

    <!-- Search bar -->
    <div class="pj-toolbar">
      <div class="pj-search">
        <span>🔍</span>
        <input v-model="q" placeholder="Search projects…" />
      </div>
    </div>

    <!-- Skeleton loader -->
    <div v-if="store.loading" class="pj-grid">
      <div class="pj-skeleton" v-for="i in 3" :key="i" />
    </div>

    <!-- Empty -->
    <div v-else-if="!filtered.length" class="pj-empty">
      <div class="pj-empty-icon">📂</div>
      <div class="pj-empty-title">No projects yet</div>
      <div class="pj-empty-sub">Create your first project to start tracking bugs inside it</div>
      <button class="btn btn-primary" @click="openCreate">+ create project</button>
    </div>

    <!-- Grid -->
    <div v-else class="pj-grid">
      <div
        v-for="p in filtered" :key="p.id"
        class="pj-card"
        @click="openDetail(p)"
      >
        <!-- colour stripe -->
        <div class="pj-stripe" :style="{background: p.color}" />

        <!-- card body -->
        <div class="pj-card-inner">
          <div class="pj-head">
            <div class="pj-avatar" :style="{background:p.color+'22', color:p.color}">
              {{ p.name[0].toUpperCase() }}
            </div>
            <div class="pj-meta">
              <div class="pj-name">{{ p.name }}</div>
              <div class="pj-id">{{ p.id }}</div>
            </div>
            <!-- action buttons – only visible on hover -->
            <div class="pj-actions" @click.stop>
              <button class="pj-btn" @click="openEdit(p)" title="Edit">✏️</button>
              <button class="pj-btn red" @click="askDelete(p)" title="Delete">🗑️</button>
            </div>
          </div>

          <p class="pj-desc">{{ p.description || 'No description.' }}</p>

          <a v-if="p.url" class="pj-url" :href="p.url" target="_blank" @click.stop>
            🔗 {{ bare(p.url) }}
          </a>

          <div class="pj-stack">
            <span v-for="s in p.stack" :key="s" class="pj-tag">{{ s }}</span>
          </div>
        </div>

        <!-- footer stats -->
        <div class="pj-footer">
          <div class="pj-stat">
            <span class="pj-stat-n" :style="{color: p.openCount ? '#e5484d':'#18a979'}">
              {{ p.openCount || 0 }}
            </span>
            <span class="pj-stat-l">open</span>
          </div>
          <div class="pj-divider" />
          <div class="pj-stat">
            <span class="pj-stat-n">{{ p.issueCount || 0 }}</span>
            <span class="pj-stat-l">total</span>
          </div>
          <div class="pj-divider" />
          <div class="pj-stat">
            <span class="pj-stat-n">{{ p.owner.split(' ')[0] }}</span>
            <span class="pj-stat-l">owner</span>
          </div>
          <button
            class="pj-report-btn"
            :style="{background:p.color+'18', color:p.color, borderColor:p.color+'55'}"
            @click.stop="goReport(p)"
          >+ report bug</button>
        </div>
      </div>
    </div>


    <!-- ═══ CREATE / EDIT MODAL ═══ -->
    <Teleport to="body">
      <div v-if="showForm" class="overlay" @click.self="closeForm">
        <div class="modal" @click.stop>
          <div class="modal-hd">
            <span class="modal-title">{{ editing ? 'edit project' : 'new project' }}</span>
            <button class="modal-x" @click="closeForm">✕</button>
          </div>

          <div class="form-group">
            <label>Project Name *</label>
            <input v-model="form.name" placeholder="My Awesome App" />
          </div>
          <div class="form-group">
            <label>Website URL</label>
            <input v-model="form.url" placeholder="https://myapp.com" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" style="min-height:72px" placeholder="What does this project do?" />
          </div>
          <div class="form-group">
            <label>Tech Stack <span style="font-weight:400;color:var(--text3)">(comma separated)</span></label>
            <input v-model="form.stackRaw" placeholder="Vue, Node.js, PostgreSQL" />
          </div>
          <div class="form-group">
            <label>Colour</label>
            <div class="colour-row">
              <button
                v-for="c in COLOURS" :key="c"
                class="colour-dot"
                :style="{background:c, outline: form.color===c ? '3px solid '+c : 'none', outlineOffset:'3px'}"
                @click="form.color = c"
              />
            </div>
          </div>

          <div v-if="formErr" class="form-err">⚠️ {{ formErr }}</div>

          <div class="modal-ft">
            <button class="btn btn-ghost" @click="closeForm">cancel</button>
            <button class="btn btn-primary" :disabled="saving" @click="saveProject">
              {{ saving ? 'Saving…' : (editing ? 'save changes' : 'create project') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>


    <!-- ═══ DETAIL DRAWER ═══ -->
    <Teleport to="body">
      <div v-if="detail" class="overlay" @click.self="detail=null">
        <div class="drawer">
          <div class="drawer-stripe" :style="{background: detail.color}" />

          <div class="drawer-hd">
            <div>
              <div class="drawer-name">{{ detail.name }}</div>
              <div class="drawer-sub">{{ detail.id }} · created {{ detail.created }}</div>
            </div>
            <button class="modal-x" @click="detail=null">✕</button>
          </div>

          <a v-if="detail.url" class="drawer-url" :href="detail.url" target="_blank">
            🔗 {{ detail.url }}
          </a>
          <p class="drawer-desc">{{ detail.description || 'No description.' }}</p>

          <div class="drawer-section">
            <div class="drawer-section-label">Tech Stack</div>
            <div class="pj-stack">
              <span v-for="s in detail.stack" :key="s" class="pj-tag">{{ s }}</span>
              <span v-if="!detail.stack?.length" style="color:var(--text3);font-size:.82rem">—</span>
            </div>
          </div>

          <div class="drawer-section">
            <div class="drawer-section-label" style="display:flex;align-items:center;gap:8px">
              Issues in this project
              <span class="iss-count">{{ detailIssues.length }}</span>
            </div>

            <div v-if="loadingIssues" class="drawer-empty">Loading…</div>
            <div v-else-if="!detailIssues.length" class="drawer-empty">
              No bugs reported yet.
              <br/>
              <button class="btn btn-primary" style="margin-top:14px;width:100%" @click="goReport(detail)">
                + report first bug
              </button>
            </div>

            <div v-else class="iss-list">
              <router-link
                v-for="i in detailIssues" :key="i.id"
                :to="'/app/issues/'+i.id"
                class="iss-row"
                @click="detail=null"
              >
                <span class="iss-id">{{ i.id }}</span>
                <span class="iss-title">{{ i.title }}</span>
                <span :class="'status status-'+i.status.replace(' ','-')">{{ i.status }}</span>
              </router-link>
            </div>

            <button
              v-if="detailIssues.length"
              class="btn btn-outline"
              style="width:100%;margin-top:14px"
              @click="goReport(detail)"
            >+ report another bug</button>
          </div>
        </div>
      </div>
    </Teleport>


    <!-- ═══ DELETE CONFIRM ═══ -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="overlay" @click.self="deleteTarget=null">
        <div class="modal modal-sm">
          <div class="modal-title" style="margin-bottom:10px">Delete project?</div>
          <p style="color:var(--text2);font-size:.87rem;margin-bottom:20px">
            "<strong>{{ deleteTarget.name }}</strong>" will be permanently deleted.
            Existing issues linked to it will remain.
          </p>
          <div class="modal-ft">
            <button class="btn btn-ghost" @click="deleteTarget=null">cancel</button>
            <button class="btn btn-danger" :disabled="saving" @click="doDelete">
              {{ saving ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

const router = useRouter()
const store  = useProjectsStore()
const auth   = useAuthStore()
const toast  = useToastStore()

const COLOURS = ['#6c63ff','#18a979','#e5484d','#e07b39','#0ea5e9','#f59e0b','#8b5cf6','#ec4899','#3f4452']

// ── search ──
const q        = ref('')
const filtered = computed(() => {
  const s = q.value.toLowerCase()
  if (!s) return store.projects
  return store.projects.filter(p =>
    p.name.toLowerCase().includes(s) ||
    p.description?.toLowerCase().includes(s) ||
    p.stack?.some(t => t.toLowerCase().includes(s))
  )
})

// ── form ──
const showForm = ref(false)
const editing  = ref(null)
const saving   = ref(false)
const formErr  = ref('')
const form     = ref({ name:'', url:'', description:'', stackRaw:'', color:'#6c63ff' })

function openCreate() {
  editing.value = null
  form.value = { name:'', url:'', description:'', stackRaw:'', color:'#6c63ff' }
  formErr.value = ''
  showForm.value = true
}
function openEdit(p) {
  editing.value = p
  form.value = { name:p.name, url:p.url||'', description:p.description||'', stackRaw:(p.stack||[]).join(', '), color:p.color||'#6c63ff' }
  formErr.value = ''
  showForm.value = true
}
function closeForm() { showForm.value = false }

async function saveProject() {
  formErr.value = ''
  if (!form.value.name.trim()) { formErr.value = 'Project name is required.'; return }
  saving.value = true
  const data = {
    name: form.value.name.trim(), url: form.value.url.trim(),
    description: form.value.description.trim(),
    stack: form.value.stackRaw.split(',').map(s=>s.trim()).filter(Boolean),
    color: form.value.color,
  }
  if (editing.value) {
    const r = await store.update(editing.value.id, data, auth.fullName)
    if (r) { toast.success('Project updated ✅'); closeForm() }
    else formErr.value = store.error || 'Update failed'
  } else {
    const r = await store.create(data, auth.fullName)
    if (r) { toast.success('Project created 🚀'); closeForm() }
    else formErr.value = store.error || 'Create failed'
  }
  saving.value = false
}

// ── detail drawer ──
const detail       = ref(null)
const detailIssues = ref([])
const loadingIssues= ref(false)

async function openDetail(p) {
  detail.value = p
  loadingIssues.value = true
  detailIssues.value  = await store.getIssues(p.id)
  loadingIssues.value = false
}
watch(detail, async p => {
  if (!p) return
  loadingIssues.value = true
  detailIssues.value  = await store.getIssues(p.id)
  loadingIssues.value = false
})

// ── delete ──
const deleteTarget = ref(null)
function askDelete(p) { deleteTarget.value = p }
async function doDelete() {
  saving.value = true
  const ok = await store.remove(deleteTarget.value.id, auth.fullName)
  saving.value = false
  if (ok) { toast.success('Project deleted'); deleteTarget.value = null }
  else toast.error(store.error || 'Delete failed')
}

// ── navigate ──
function goReport(p) {
  router.push({ path:'/app/create', query:{ projectId: p.id } })
  detail.value = null
}

function bare(url) { return url.replace(/^https?:\/\//,'').replace(/\/$/,'') }

onMounted(() => store.fetchAll())
</script>

<style scoped>
/* toolbar */
.pj-toolbar { display:flex; gap:12px; margin-bottom:24px; }
.pj-search {
  display:flex; align-items:center; gap:8px;
  background:#fff; border:1.5px solid var(--border); border-radius:10px;
  padding:8px 14px; flex:1; max-width:380px;
}
.pj-search:focus-within { border-color:var(--accent); }
.pj-search input { border:none; outline:none; background:transparent; font-size:.87rem; color:var(--text); width:100%; font-family:'Inter',sans-serif; }

/* grid */
.pj-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }

/* skeleton */
.pj-skeleton { height:230px; border-radius:16px; background:linear-gradient(90deg,var(--bg3) 25%,var(--border) 50%,var(--bg3) 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* empty */
.pj-empty { text-align:center; padding:80px 20px; }
.pj-empty-icon { font-size:3rem; margin-bottom:14px; }
.pj-empty-title { font-size:1.1rem; font-weight:700; margin-bottom:6px; }
.pj-empty-sub { color:var(--text3); font-size:.87rem; margin-bottom:22px; }

/* card */
.pj-card {
  background:#fff; border:1.5px solid var(--border); border-radius:16px;
  overflow:hidden; cursor:pointer; display:flex; flex-direction:column;
  transition:all .2s; box-shadow:var(--shadow-sm);
}
.pj-card:hover { box-shadow:var(--shadow); transform:translateY(-2px); border-color:var(--border2); }

.pj-stripe { height:4px; flex-shrink:0; }
.pj-card-inner { padding:18px; flex:1; display:flex; flex-direction:column; gap:10px; }

.pj-head { display:flex; align-items:flex-start; gap:11px; }
.pj-avatar { width:40px; height:40px; border-radius:11px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:800; font-family:'Outfit',sans-serif; }
.pj-meta { flex:1; min-width:0; }
.pj-name { font-weight:700; font-size:.95rem; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pj-id   { font-size:.7rem; color:var(--text3); font-family:'JetBrains Mono',monospace; margin-top:2px; }

.pj-actions { display:flex; gap:4px; opacity:0; transition:opacity .15s; }
.pj-card:hover .pj-actions { opacity:1; }
.pj-btn { background:none; border:none; cursor:pointer; padding:4px 7px; border-radius:6px; font-size:.85rem; transition:background .12s; }
.pj-btn:hover { background:var(--bg3); }
.pj-btn.red:hover { background:#ffefef; }

.pj-desc { font-size:.82rem; color:var(--text2); line-height:1.55; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; flex:1; }
.pj-url  { font-size:.74rem; color:#0ea5e9; text-decoration:none; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pj-url:hover { text-decoration:underline; }
.pj-stack { display:flex; flex-wrap:wrap; gap:5px; }
.pj-tag  { padding:3px 9px; border-radius:20px; font-size:.7rem; font-weight:600; background:var(--bg3); color:var(--text2); font-family:'JetBrains Mono',monospace; }

.pj-footer {
  display:flex; align-items:center; gap:10px;
  border-top:1px solid var(--border); padding:11px 18px;
  background:var(--bg2);
}
.pj-stat { text-align:center; }
.pj-stat-n { display:block; font-size:1rem; font-weight:800; font-family:'Outfit',sans-serif; line-height:1; }
.pj-stat-l { font-size:.62rem; color:var(--text3); text-transform:uppercase; letter-spacing:.05em; }
.pj-divider { width:1px; height:22px; background:var(--border); }
.pj-report-btn {
  margin-left:auto; padding:5px 12px; border-radius:8px; border:1.5px solid;
  font-size:.76rem; font-weight:700; cursor:pointer; transition:filter .15s;
  font-family:'Inter',sans-serif;
}
.pj-report-btn:hover { filter:brightness(.9); }

/* overlay / modal */
.overlay { position:fixed; inset:0; background:rgba(0,0,0,.35); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(2px); }
.modal { background:#fff; border-radius:18px; padding:28px; width:100%; max-width:500px; box-shadow:0 20px 60px rgba(0,0,0,.18); animation:sup .2s ease; }
.modal-sm { max-width:360px; }
@keyframes sup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

.modal-hd { display:flex; justify-content:space-between; align-items:center; margin-bottom:22px; }
.modal-title { font-family:'Outfit',sans-serif; font-size:1.15rem; font-weight:700; }
.modal-x { background:var(--bg3); border:none; border-radius:8px; width:30px; height:30px; cursor:pointer; font-size:.8rem; color:var(--text2); transition:all .12s; }
.modal-x:hover { background:var(--border); }
.modal-ft { display:flex; gap:10px; justify-content:flex-end; margin-top:22px; }
.form-err { background:#ffefef; border:1px solid #ffc0c0; border-radius:8px; padding:10px 14px; font-size:.83rem; color:var(--accent2); margin-bottom:6px; }

.colour-row { display:flex; gap:10px; flex-wrap:wrap; }
.colour-dot { width:28px; height:28px; border-radius:8px; border:none; cursor:pointer; transition:transform .12s; }
.colour-dot:hover { transform:scale(1.18); }

/* drawer */
.overlay { justify-content:flex-end; } /* override for drawer */
.drawer {
  background:#fff; width:100%; max-width:460px; height:100%;
  overflow-y:auto; box-shadow:-8px 0 32px rgba(0,0,0,.12);
  animation:sldr .22s cubic-bezier(.22,1,.36,1); display:flex; flex-direction:column;
}
@keyframes sldr{from{transform:translateX(100%)}to{transform:translateX(0)}}

.drawer-stripe { height:5px; flex-shrink:0; position:sticky; top:0; }
.drawer-hd { display:flex; justify-content:space-between; align-items:flex-start; padding:20px 22px 14px; border-bottom:1px solid var(--border); }
.drawer-name { font-family:'Outfit',sans-serif; font-size:1.25rem; font-weight:800; }
.drawer-sub  { font-size:.73rem; color:var(--text3); font-family:'JetBrains Mono',monospace; margin-top:3px; }
.drawer-url  { display:block; padding:10px 22px; font-size:.82rem; color:#0ea5e9; text-decoration:none; border-bottom:1px solid var(--border); }
.drawer-url:hover { text-decoration:underline; }
.drawer-desc { padding:14px 22px; font-size:.86rem; color:var(--text2); line-height:1.6; border-bottom:1px solid var(--border); }
.drawer-section { padding:16px 22px; border-bottom:1px solid var(--border); }
.drawer-section-label { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--text3); margin-bottom:10px; }
.drawer-empty { color:var(--text3); font-size:.85rem; text-align:center; padding:20px 0; }

.iss-count { background:var(--accent); color:#fff; border-radius:20px; padding:1px 8px; font-size:.68rem; }
.iss-list  { display:flex; flex-direction:column; gap:6px; }
.iss-row   { display:flex; align-items:center; gap:8px; padding:9px 12px; border:1.5px solid var(--border); border-radius:10px; text-decoration:none; transition:all .13s; background:var(--bg2); }
.iss-row:hover { border-color:var(--accent); background:var(--accent-light); }
.iss-id    { font-family:'JetBrains Mono',monospace; font-size:.7rem; color:var(--text3); flex-shrink:0; }
.iss-title { flex:1; font-size:.82rem; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500; }
</style>
