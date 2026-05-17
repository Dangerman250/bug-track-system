<template>
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-title">Report New Bug</div>
        <div class="page-sub">Fill in the details to create an issue</div>
      </div>
    </div>

    <div class="form-wrap">
      <div class="card">

        <!-- ── PROJECT PICKER ── -->
        <div class="form-group">
          <label>Project <span class="lbl-opt">(optional – links this bug to a project)</span></label>
          <select v-model="form.projectId" class="project-select">
            <option value="">— No project —</option>
            <option v-for="p in projectsStore.projects" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
          <!-- selected project chip -->
          <div v-if="selectedProject" class="pj-chip">
            <span class="pj-chip-dot" :style="{background: selectedProject.color}"></span>
            <span>{{ selectedProject.name }}</span>
            <a v-if="selectedProject.url" :href="selectedProject.url" target="_blank" class="pj-chip-link">↗</a>
          </div>
        </div>

        <div class="form-group">
          <label>Issue Title *</label>
          <input type="text" v-model="form.title" placeholder="Short, descriptive title…" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>priority</label>
            <select v-model="form.priority">
              <option>Critical</option><option>High</option>
              <option>Medium</option><option>Low</option>
            </select>
          </div>
          <div class="form-group">
            <label>status</label>
            <select v-model="form.status">
              <option>open</option><option>in progress</option>
              <option>resolved</option><option>closed</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>assignee</label>
            <select v-model="form.assignee">
              <option v-for="m in teamMembers" :key="m">{{ m }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Environment</label>
            <select v-model="form.env">
              <option>Production</option><option>Staging</option>
              <option>Development</option><option>QA</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>tags <span class="lbl-opt">(comma separated)</span></label>
          <input type="text" v-model="form.tagsRaw" placeholder="ui, auth, performance" />
        </div>

        <div class="form-group">
          <label>description *</label>
          <textarea v-model="form.description" placeholder="Describe the bug — what happened, expected vs actual behavior…"></textarea>
        </div>

        <div class="form-group">
          <label>Steps to Reproduce</label>
          <textarea v-model="form.steps" style="min-height:80px" placeholder="1. Go to…&#10;2. Click on…&#10;3. See error" />
        </div>

        <!-- ── FILE UPLOAD ── -->
        <div class="form-group">
          <label>Attachments <span class="lbl-opt">(screenshots, logs, videos — from your computer)</span></label>

          <div
            class="upload-zone"
            :class="{ dragging }"
            @click="$refs.fileInput.click()"
            @dragover.prevent="dragging=true"
            @dragleave.prevent="dragging=false"
            @drop.prevent="onDrop"
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.log,.zip,.json,.csv,.mp4,.mov"
              style="display:none"
              @change="onFileChange"
            />
            <div class="upload-icon">📎</div>
            <div class="upload-cta">
              Drop files here or <span class="upload-browse">click to browse</span>
            </div>
            <div class="upload-hint">Images · PDFs · Logs · Videos · ZIPs — max 20 MB each</div>
          </div>

          <!-- File list -->
          <div v-if="attachments.length" class="attach-list">
            <div v-for="(f,i) in attachments" :key="i" class="attach-row">
              <!-- image preview -->
              <img v-if="f.preview" :src="f.preview" class="attach-thumb" alt="preview" />
              <span v-else class="attach-icon">{{ fileIcon(f.file.name) }}</span>
              <div class="attach-info">
                <div class="attach-name">{{ f.file.name }}</div>
                <div class="attach-size">{{ formatSize(f.file.size) }}</div>
              </div>
              <button class="attach-rm" @click.stop="removeAttach(i)">✕</button>
            </div>
          </div>
        </div>

        <div v-if="errors.length" class="error-box">
          <div v-for="e in errors" :key="e">⚠️ {{ e }}</div>
        </div>

        <div class="action-row">
          <button class="btn btn-primary" :disabled="issuesStore.loading" @click="handleSubmit">
            {{ issuesStore.loading ? 'Submitting…' : 'Submit Issue' }}
          </button>
          <router-link to="/app/issues" class="btn btn-ghost">cancel</router-link>
        </div>
      </div>

      <!-- Preview card -->
      <div class="card preview-card">
        <div class="card-title">👁 Preview</div>
        <div v-if="selectedProject" class="prev-project" :style="{borderLeftColor: selectedProject.color}">
          <span class="prev-pj-dot" :style="{background: selectedProject.color}"></span>
          {{ selectedProject.name }}
        </div>
        <div style="margin-bottom:10px">
          <div style="font-weight:600;margin-bottom:6px">{{ form.title || 'Untitled issue' }}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <span :class="'status status-'+form.status.replace(' ','-')">{{ form.status }}</span>
            <span :class="'priority prio-'+form.priority.toLowerCase()">{{ form.priority }}</span>
          </div>
        </div>
        <div v-if="form.description" style="font-size:.85rem;color:var(--text2);line-height:1.6;margin-bottom:10px">
          {{ form.description.slice(0,120) }}{{ form.description.length>120?'…':'' }}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">
          <span v-for="t in previewtags" :key="t" class="tag">{{ t }}</span>
        </div>
        <div style="font-size:.8rem;color:var(--text3)">
          assignee: {{ form.assignee }} · {{ form.env }}
        </div>
        <div v-if="attachments.length" style="margin-top:10px;font-size:.78rem;color:var(--text3)">
          📎 {{ attachments.length }} file{{ attachments.length>1?'s':'' }} attached
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useIssuesStore }   from '../stores/issues'
import { useAuthStore }     from '../stores/auth'
import { useToastStore }    from '../stores/toast'
import { useProjectsStore } from '../stores/projects'

const router        = useRouter()
const route         = useRoute()
const issuesStore   = useIssuesStore()
const auth          = useAuthStore()
const toast         = useToastStore()
const projectsStore = useProjectsStore()

const teamMembers = ['Alex Dev','Jamie Chen','Sam Rivera','Jordan Kim','Taylor Smith','Morgan Lee']

const form = reactive({
  projectId: '',
  title: '', priority: 'Medium', status: 'open',
  assignee: auth.fullName, env: 'Production',
  tagsRaw: '', description: '', steps: ''
})

const selectedProject = computed(() =>
  form.projectId ? projectsStore.getById(form.projectId) : null
)

const errors     = ref([])
const attachments= ref([])  // [{file, preview}]
const dragging   = ref(false)
const fileInput  = ref(null)

const previewtags = computed(() =>
  form.tagsRaw.split(',').map(t=>t.trim()).filter(Boolean)
)

function addFiles(fileList) {
  Array.from(fileList).forEach(file => {
    if (file.size > 20 * 1024 * 1024) { toast.error(`${file.name} is over 20 MB`); return }
    const entry = { file, preview: null }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = e => { entry.preview = e.target.result }
      reader.readAsDataURL(file)
    }
    attachments.value.push(entry)
  })
}
function onFileChange(e) { addFiles(e.target.files); e.target.value = '' }
function onDrop(e) { dragging.value = false; addFiles(e.dataTransfer.files) }
function removeAttach(i) { attachments.value.splice(i, 1) }

function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase()
  if (['png','jpg','jpeg','gif','webp','svg'].includes(ext)) return '🖼️'
  if (ext === 'pdf') return '📄'
  if (['log','txt','csv'].includes(ext)) return '📋'
  if (['zip','gz','tar'].includes(ext)) return '📦'
  if (['mp4','mov','avi','webm'].includes(ext)) return '🎬'
  if (ext === 'json') return '🔧'
  return '📎'
}
function formatSize(b) {
  if (b < 1024) return b + ' B'
  if (b < 1024*1024) return (b/1024).toFixed(1) + ' KB'
  return (b/(1024*1024)).toFixed(1) + ' MB'
}

async function handleSubmit() {
  errors.value = []
  if (!form.title.trim())       errors.value.push('Title is required.')
  if (!form.description.trim()) errors.value.push('Description is required.')
  if (errors.value.length) return

  const issue = await issuesStore.create({
    projectId:   form.projectId || null,
    title:       form.title,
    priority:    form.priority,
    status:      form.status,
    assignee:    form.assignee,
    env:         form.env,
    tags:        previewtags.value,
    description: form.description,
    steps:       form.steps,
  }, auth.fullName)

  if (issue) {
    const att = attachments.value.length ? ` with ${attachments.value.length} file(s)` : ''
    toast.success('Issue reported 🐛' + att)
    router.push('/app/issues')
  } else {
    toast.error('Failed to create issue')
  }
}

onMounted(async () => {
  if (!projectsStore.projects.length) await projectsStore.fetchAll()
  if (route.query.projectId) form.projectId = route.query.projectId
})
</script>

<style scoped>
.form-wrap { display:grid; grid-template-columns:1fr 300px; gap:24px; max-width:1000px; }
@media(max-width:900px){ .form-wrap{ grid-template-columns:1fr; } }
.preview-card { height:fit-content; position:sticky; top:80px; }
.error-box { background:#ff475718; border:1px solid #ff475755; border-radius:9px; padding:14px; margin-bottom:16px; font-size:.85rem; color:var(--accent2); display:flex; flex-direction:column; gap:6px; }
.action-row { display:flex; gap:12px; margin-top:8px; }
.lbl-opt { font-weight:400; color:var(--text3); }

/* project picker */
.project-select { width:100%; }
.pj-chip { display:inline-flex; align-items:center; gap:6px; margin-top:8px; padding:5px 12px; border-radius:20px; background:var(--bg3); font-size:.8rem; font-weight:600; }
.pj-chip-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.pj-chip-link { color:#0ea5e9; text-decoration:none; }
.pj-chip-link:hover { text-decoration:underline; }

/* upload zone */
.upload-zone {
  border:2px dashed var(--border); border-radius:12px; padding:32px 20px;
  text-align:center; cursor:pointer; transition:all .2s; background:var(--bg3);
  display:flex; flex-direction:column; align-items:center; gap:6px;
}
.upload-zone:hover, .upload-zone.dragging {
  border-color:var(--accent); background:var(--accent-light);
}
.upload-icon { font-size:2rem; }
.upload-cta { font-size:.87rem; color:var(--text2); }
.upload-browse { color:var(--accent); font-weight:700; text-decoration:underline; }
.upload-hint { font-size:.73rem; color:var(--text3); }

/* attach list */
.attach-list { display:flex; flex-direction:column; gap:7px; margin-top:10px; }
.attach-row {
  display:flex; align-items:center; gap:10px; padding:8px 12px;
  background:#fff; border:1.5px solid var(--border); border-radius:10px;
}
.attach-thumb { width:40px; height:40px; border-radius:6px; object-fit:cover; flex-shrink:0; }
.attach-icon { font-size:1.4rem; flex-shrink:0; width:40px; text-align:center; }
.attach-info { flex:1; min-width:0; }
.attach-name { font-size:.83rem; font-weight:600; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.attach-size { font-size:.72rem; color:var(--text3); }
.attach-rm {
  background:none; border:none; cursor:pointer; color:var(--text3);
  padding:3px 7px; border-radius:6px; font-size:.8rem; transition:all .12s; flex-shrink:0;
}
.attach-rm:hover { background:#ffefef; color:var(--accent2); }

/* preview card extras */
.prev-project { display:flex; align-items:center; gap:7px; border-left:3px solid; padding-left:10px; margin-bottom:12px; font-size:.83rem; font-weight:600; }
.prev-pj-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
</style>
