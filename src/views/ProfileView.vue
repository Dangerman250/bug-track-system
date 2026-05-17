<template>
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-title">my profile</div>
        <div class="page-sub">manage your personal information and preferences</div>
      </div>
      <button class="btn btn-primary" :disabled="auth.loading" @click="handleSave">
        {{ auth.loading ? 'saving…' : 'save changes' }}
      </button>
    </div>

    <div class="profile-layout">
      <!-- Left column -->
      <div class="profile-left">
        <!-- Profile hero card -->
        <div class="card profile-hero-card">
          <div class="profile-banner">
            <div class="banner-pattern"></div>
          </div>
          <div class="profile-body">
            <div class="profile-top-row">
              <div class="profile-avatar-wrap">
                <div class="profile-avatar">
                  <img v-if="form.avatarUrl" :src="form.avatarUrl" alt="avatar" />
                  <span v-else>{{ auth.initials }}</span>
                </div>
                <label class="avatar-upload-btn" title="Upload photo">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <input type="file" accept="image/*" @change="onAvatar" hidden />
                </label>
                <div class="avatar-status"></div>
              </div>
              <div class="profile-headline">
                <div class="profile-name">{{ form.firstName || 'your' }} {{ form.lastName || 'name' }}</div>
                <div class="profile-role-badge">
                  <span class="role-pill">{{ form.role || 'role' }}</span>
                </div>
                <div v-if="form.location" class="profile-location">
                  <span>📍</span> {{ form.location }}
                </div>
              </div>
            </div>

            <div class="form-row" style="margin-top: 20px">
              <div class="form-group"><label>first name</label><input type="text" v-model="form.firstName" /></div>
              <div class="form-group"><label>last name</label><input type="text" v-model="form.lastName" /></div>
            </div>
            <div class="form-group"><label>email</label><input type="email" v-model="form.email" /></div>
            <div class="form-group"><label>role / title</label><input type="text" v-model="form.role" /></div>
            <div class="form-group">
              <label>bio</label>
              <textarea v-model="form.bio" placeholder="tell your team about yourself…"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group"><label>location</label><input type="text" v-model="form.location" placeholder="city, country" /></div>
              <div class="form-group"><label>github</label><input type="text" v-model="form.github" placeholder="github.com/username" /></div>
            </div>
          </div>
        </div>

        <!-- Password -->
        <div class="card">
          <div class="card-title">🔐 change password</div>
          <div class="form-group"><label>current password</label><input type="password" v-model="pw.current" placeholder="••••••••" /></div>
          <div class="form-group"><label>new password</label><input type="password" v-model="pw.newPw" placeholder="••••••••" /></div>
          <div class="form-group"><label>confirm new password</label><input type="password" v-model="pw.confirm" placeholder="••••••••" /></div>
          <div v-if="pwError" class="pw-error">{{ pwError }}</div>
          <button class="btn btn-primary" @click="handlePasswordChange">update password</button>
        </div>
      </div>

      <!-- Right column -->
      <div class="profile-right">
        <!-- Stats -->
        <div class="card" style="margin-bottom: 18px">
          <div class="card-title">📊 my stats</div>
          <div class="stats-grid">
            <div class="stat-box" v-for="s in statBoxes" :key="s.label" :style="{'--c': s.color, '--cbg': s.bg}">
              <div class="stat-box-icon">{{ s.icon }}</div>
              <div class="stat-box-n">{{ s.n }}</div>
              <div class="stat-box-l">{{ s.label }}</div>
            </div>
          </div>
        </div>

        <!-- Profile preview -->
        <div class="card preview-card" style="margin-bottom: 18px">
          <div class="card-title">🪪 profile preview</div>
          <div class="preview-profile">
            <div class="preview-avatar">
              <img v-if="form.avatarUrl" :src="form.avatarUrl" alt="preview" />
              <span v-else>{{ auth.initials }}</span>
            </div>
            <div class="preview-info">
              <div class="preview-name">{{ form.firstName }} {{ form.lastName }}</div>
              <div class="preview-role">{{ form.role }}</div>
              <div class="preview-bio">{{ form.bio || 'no bio yet.' }}</div>
              <div class="preview-meta">
                <span v-if="form.location">📍 {{ form.location }}</span>
                <span v-if="form.github">🔗 {{ form.github }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- My open issues -->
        <div class="card">
          <div class="card-title">🐞 my open issues</div>
          <div v-if="myIssues.length === 0" class="empty-state">
            no open issues assigned to you.
          </div>
          <div v-for="issue in myIssues" :key="issue.id" class="my-issue-row">
            <router-link :to="'/app/issues/' + issue.id" class="my-issue-title">{{ issue.title }}</router-link>
            <span :class="'priority prio-' + issue.priority.toLowerCase()">{{ issue.priority }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useIssuesStore } from '../stores/issues'
import { useToastStore } from '../stores/toast'

const auth = useAuthStore()
const issuesStore = useIssuesStore()
const toast = useToastStore()

const form = reactive({ ...auth.user })
const pw = reactive({ current: '', newPw: '', confirm: '' })
const pwError = ref('')

const myStats = computed(() => ({
  reported: issuesStore.issues.length,
  resolved: issuesStore.issues.filter(i => i.status === 'resolved').length,
  assigned: issuesStore.issues.filter(i => i.assignee === auth.fullName).length,
  comments: issuesStore.issues.reduce((acc, i) => acc + i.comments.length, 0),
}))

const statBoxes = computed(() => [
  { icon: '📝', label: 'reported', n: myStats.value.reported, color: 'var(--accent)', bg: 'var(--accent-light)' },
  { icon: '✅', label: 'resolved', n: myStats.value.resolved, color: 'var(--accent3)', bg: 'var(--accent3-light)' },
  { icon: '🎯', label: 'assigned', n: myStats.value.assigned, color: 'var(--accent4)', bg: 'var(--accent4-light)' },
  { icon: '💬', label: 'comments', n: myStats.value.comments, color: 'var(--accent2)', bg: 'var(--accent2-light)' },
])

const myIssues = computed(() =>
  issuesStore.issues.filter(i => i.assignee === auth.fullName && i.status === 'open').slice(0, 5)
)

function onAvatar(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => { form.avatarUrl = ev.target.result }
  reader.readAsDataURL(file)
  toast.info('avatar updated — save to keep it')
}

async function handleSave() {
  const ok = await auth.updateProfile({ ...form })
  if (ok) toast.success('profile saved ✅')
  else toast.error(auth.error)
}

async function handlePasswordChange() {
  pwError.value = ''
  if (!pw.current || !pw.newPw || !pw.confirm) { pwError.value = 'fill all fields.'; return }
  if (pw.newPw !== pw.confirm) { pwError.value = 'passwords do not match.'; return }
  const ok = await auth.changePassword(pw.current, pw.newPw)
  if (ok) { toast.success('password updated'); Object.assign(pw, { current: '', newPw: '', confirm: '' }) }
  else pwError.value = auth.error
}

onMounted(async () => {
  if (!issuesStore.issues.length) await issuesStore.fetchAll()
})
</script>

<style scoped>
.profile-layout { display: grid; grid-template-columns: 1fr 320px; gap: 20px; }
@media (max-width: 960px) { .profile-layout { grid-template-columns: 1fr; } }

.profile-hero-card { padding: 0; overflow: hidden; margin-bottom: 18px; }

.profile-banner {
  height: 110px; position: relative; overflow: hidden;
  background: linear-gradient(135deg, #3f4452 0%, #6b7280 50%, #18a979 100%);
}
.banner-pattern {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%);
}

.profile-body { padding: 0 22px 22px; }

.profile-top-row { display: flex; align-items: flex-end; gap: 14px; margin-top: -28px; }

.profile-avatar-wrap { position: relative; flex-shrink: 0; }
.profile-avatar {
  width: 72px; height: 72px; border-radius: 50%;
  border: 3px solid white; box-shadow: var(--shadow);
  background: linear-gradient(135deg, var(--accent), #6b7280);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; font-weight: 700; color: #fff; overflow: hidden;
}
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.avatar-upload-btn {
  position: absolute; bottom: 2px; right: 2px;
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: 2px solid white; transition: all var(--transition);
}
.avatar-upload-btn:hover { background: var(--accent-dark); transform: scale(1.1); }
.avatar-status {
  position: absolute; top: 2px; right: 2px;
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--accent3); border: 2px solid white;
}

.profile-headline { padding-bottom: 4px; flex: 1; }
.profile-name { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.2rem; letter-spacing: -0.02em; color: var(--text); margin-top: 4px; }
.profile-role-badge { margin-top: 4px; }
.role-pill { background: var(--accent-light); color: var(--accent); font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 50px; }
.profile-location { font-size: 0.78rem; color: var(--text3); margin-top: 5px; display: flex; align-items: center; gap: 3px; }

.pw-error { color: var(--accent2); font-size: 0.8rem; margin-bottom: 12px; }

/* Stats */
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.stat-box {
  background: var(--cbg); border-radius: 10px; padding: 14px;
  text-align: center; border: 1px solid transparent;
  transition: all var(--transition);
}
.stat-box:hover { border-color: var(--c); transform: translateY(-1px); }
.stat-box-icon { font-size: 1.2rem; margin-bottom: 6px; }
.stat-box-n { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.6rem; color: var(--c); letter-spacing: -0.03em; }
.stat-box-l { font-size: 0.72rem; color: var(--text3); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600; }

/* Preview */
.preview-profile { display: flex; gap: 14px; align-items: flex-start; }
.preview-avatar {
  width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--accent), #6b7280);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; font-weight: 700; color: #fff; overflow: hidden;
  border: 2px solid var(--border);
}
.preview-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.preview-info { flex: 1; }
.preview-name { font-weight: 700; font-size: 0.95rem; font-family: 'Outfit', sans-serif; letter-spacing: -0.01em; }
.preview-role { color: var(--text3); font-size: 0.75rem; margin-top: 2px; }
.preview-bio { font-size: 0.82rem; color: var(--text2); margin-top: 6px; line-height: 1.55; }
.preview-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; font-size: 0.75rem; color: var(--text3); }

.empty-state { color: var(--text3); font-size: 0.85rem; padding: 12px 0; text-align: center; }

.my-issue-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--border); }
.my-issue-row:last-child { border-bottom: none; }
.my-issue-title { font-size: 0.84rem; color: var(--accent); text-decoration: none; flex: 1; margin-right: 10px; transition: color var(--transition); }
.my-issue-title:hover { color: var(--accent-dark); text-decoration: underline; }
</style>
